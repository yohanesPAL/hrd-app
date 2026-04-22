import ExcelJS from "exceljs";
import { Err } from "@/lib/err";
import { IAbsenService, IAbsensiRepository } from "./absensi.interface";
import pool from "@/lib/db";
import {
  AbsensiDetailTable,
  ExcelRowData,
  KodeAbsen,
  KodeAbsenSchema,
  RawExcelRowData,
} from "./detail/absensi.detail.schema";
import { IAbsensiDetailRepository } from "./detail/absensi.detail.interface";
import { ZodError } from "zod";
import { IJamAbsenService } from "../master/jamAbsen/jamAbsen.interface";
import { AbsensiMapper, JamAbsen } from "./absensi.mapper";
import { IEmployeeService } from "../employee/employee.interface";
import { ServiceRes } from "@/types/ServiceTypes";
import { AbsensiTable } from "./absensi.schema";

const loadExcelWorksheet = async (file: File): Promise<ExcelJS.Worksheet> => {
  const arrayBuffer = await file.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  return workbook.worksheets[0];
};

export class AbsensiService implements IAbsenService {
  constructor(
    private absensiRepository: IAbsensiRepository,
    private absensiDetailRepository: IAbsensiDetailRepository,
    private jamAbsenService: IJamAbsenService,
    private employeeService: IEmployeeService,
  ) {}

  async getAllAbsensi(): Promise<ServiceRes<AbsensiTable[]>> {
    try {
      const res = await this.absensiRepository.getAll();

      return { success: true, status: 200, data: res };
    } catch (error: unknown) {
      console.error("AbsensiService.getAllAbsensi error:", error);

      if (error instanceof Err) throw error;

      throw new Err("AbsensiService unavailable", 500);
    }
  }

  async getAbsensiByKodeAbsen(
    kodeAbsen: KodeAbsen,
  ): Promise<ServiceRes<AbsensiDetailTable[]>> {
    try {
      KodeAbsenSchema.parse(kodeAbsen);

      const res = await this.absensiDetailRepository.getByKodeAbsen(kodeAbsen);

      return { success: true, status: 200, data: res };
    } catch (error: unknown) {
      console.error("AbsensiService.getAbsensiByKodeAbsen error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("AbsensiService unavailable", 500);
    }
  }

  async importAbsen(file: File): Promise<ServiceRes> {
    const jamAbsenDivisi = await this.jamAbsenService.getJamAbsenDivisi();
    if (!jamAbsenDivisi.data || jamAbsenDivisi.data.length === 0) throw new Err("failed to get jam absen divisi", 500);

    const jamAbsenMap = AbsensiMapper.toJamAbsenDivisiMap(jamAbsenDivisi.data);
    const worksheet = await loadExcelWorksheet(file);

    const { rows, employeesAbsentCodes } = AbsensiMapper.extractWorksheetRow(worksheet);

    const divCodeMap = await this.employeeService.getEmployeeAbsentDivCode([
      ...employeesAbsentCodes.keys(),
    ]);
    if (!divCodeMap.data) throw new Err("failed to get employee divisi code");

    const absentData = AbsensiMapper.toExcelRowData(divCodeMap.data, jamAbsenMap, rows);

    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      await this.absensiDetailRepository.create(absentData, conn);
      await this.absensiRepository.create(conn);

      await conn.commit();
      return { success: true, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("AbsensiService.importAbsen error:", error);

      if (error instanceof Err) throw error;

      throw new Err("AbsensiService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async truncateAbsen(): Promise<ServiceRes> {
    try {
      await Promise.all([
        this.absensiRepository.truncate(),
        this.absensiDetailRepository.truncate(),
      ]);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("AbsensiService.truncateAbsen error:", error);

      if (error instanceof Err) throw error;

      throw new Err("AbsensiService unavailable", 500);
    }
  }
}
