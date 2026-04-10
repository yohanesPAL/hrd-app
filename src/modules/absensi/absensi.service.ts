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
import { AbsensiMapper } from "./absensi.mapper";
import { IEmployeeService } from "../employee/employee.interface";
import { ServiceRes } from "@/types/ServiceTypes";
import { AbsensiTable } from "./absensi.schema";

const parseTimeStringToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
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
    if (!jamAbsenDivisi.data)
      throw new Err("failed to get jam absen divisi", 500);

    const jamAbsenMap = AbsensiMapper.toJamAbsenDivisiMap(jamAbsenDivisi.data);

    const arrayBuffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];

    const rows: RawExcelRowData[] = [];
    const employeesAbsentCodes = new Map<string, boolean>();
    for (const [rowNumber, row] of worksheet
      .getRows(1, worksheet.rowCount)!
      .entries()) {
      if (rowNumber === 0) continue;

      const kodeAbsen: string = row.getCell(1).value as string;
      const namaKaryawan: string = row.getCell(4).value as string;
      const tanggal: string = row.getCell(6).value as string;
      const absent: boolean = (row.getCell(16).value as string) === "True";
      const scanMasuk: string = row.getCell(10).value as string;
      const scanKeluar: string = row.getCell(11).value as string;

      if (!employeesAbsentCodes.has(kodeAbsen)) {
        employeesAbsentCodes.set(kodeAbsen, true);
      }

      rows.push({
        kode_absen: kodeAbsen,
        nama_absen: namaKaryawan,
        tanggal: tanggal,
        absent: absent,
        scan_masuk: scanMasuk,
        scan_keluar: scanKeluar,
      });
    }

    const divCodeMap = await this.employeeService.getEmployeeAbsentDivCode([
      ...employeesAbsentCodes.keys(),
    ]);
    if (!divCodeMap.data) throw new Err("failed to get employee divisi code");

    const absentData: ExcelRowData[] = [];

    rows.forEach((item) => {
      const kodeDiv = divCodeMap.data!.get(item.kode_absen);
      if (!kodeDiv)
        throw new Err("divisi untuk kode absen tidak ditemukan", 400);

      const jamAbsen = jamAbsenMap.get(kodeDiv);
      if (!jamAbsen)
        throw new Err("jam absen untuk divisi tidak ditemukan", 400);

      const scanMasukMinutes: number = parseTimeStringToMinutes(
        item.scan_masuk!,
      );
      const scanKeluarMinutes: number = parseTimeStringToMinutes(
        item.scan_keluar!,
      );

      const isSabtu = new Date(item.tanggal!).getDay() === 6;
      const jamMasuk = jamAbsen.masuk;
      const jamKeluar = isSabtu ? jamAbsen.keluar_sabtu : jamAbsen.keluar;
      const keterlambatan = Math.max(0, scanMasukMinutes - jamMasuk);
      const lembur: number = Math.max(0, scanKeluarMinutes - jamKeluar);
      const totalJamKerja: number = item.scan_masuk
        ? item.scan_keluar
          ? scanKeluarMinutes - jamMasuk
          : jamKeluar - jamMasuk
        : 0;
      const tglParts: string[] = item.tanggal!.split("/");
      const formattedTgl: string = `${tglParts[2]}-${tglParts[0].padStart(2, "0")}-${tglParts[1].padStart(2, "0")}`;

      absentData.push({
        kode_absen: item.kode_absen,
        nama_absen: item.nama_absen,
        divisi: kodeDiv,
        tanggal: formattedTgl,
        absent: item.absent,
        scan_masuk: item.scan_masuk,
        scan_keluar: item.scan_keluar,
        terlambat: keterlambatan <= 2 ? 0 : keterlambatan,
        lembur: lembur,
        jam_kerja: totalJamKerja,
      });
    });

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
