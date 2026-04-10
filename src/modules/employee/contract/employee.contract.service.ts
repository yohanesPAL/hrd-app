import { ServiceRes } from "@/types/ServiceTypes";
import { BaseEmployee, EmployeeIdSchema } from "../employee.schema";
import { IEmployeeContractService } from "./employee.contract.interface";
import {
  EmployeeContractFormSchema,
  EmployeeContractIdSchema,
  EmployeeContractForm,
  EmployeeContractExpiration,
  EmployeeContractTable,
} from "./employee.contract.schema";
import { Err } from "@/lib/err";
import { EmployeeContractRepository } from "./employee.contract.repository";
import { Connection } from "mysql2/promise";
import pool from "@/lib/db";
import { ZodError } from "zod";

function calculateContractDuration(
  tglKontrak: Date,
  tglBerakhir: Date,
): number {
  const diffTime = tglBerakhir.getTime() - tglKontrak.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export class EmployeeContractService implements IEmployeeContractService {
  constructor(private employeeContractRepository: EmployeeContractRepository) {}

  async getContractByKaryawanId(
    karyawanId: BaseEmployee["id"],
  ): Promise<ServiceRes<EmployeeContractTable[]>> {
    try {
      const res = await this.employeeContractRepository.getByKaryawanId(karyawanId);

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error(
        "EmployeeContractService.getContractByKaryawanId error:",
        error,
      );

      if (error instanceof Err) throw error;

      throw new Err(
        "EmployeeContractService.getContractByKaryawanId unavailable",
        500,
      );
    }
  }

  async createContract(
    data: EmployeeContractForm,
    conn?: Connection,
  ): Promise<ServiceRes> {
    if (!conn) conn = await pool.getConnection();

    try {
      let validated = EmployeeContractFormSchema.parse(data);

      if (validated.jenis === "kontrak") {
        if (!validated.tgl_berakhir)
          throw new Err("jenis kontrak harus memiliki tanggal berakhir", 400);
        if (validated.tgl_berakhir <= validated.tgl_kontrak)
          throw new Err(
            "tanggal berakhir harus lebih besar dari tanggal kontrak",
            400,
          );

        validated.total_kontrak = calculateContractDuration(
          validated.tgl_kontrak,
          validated.tgl_berakhir,
        );
      }

      await this.employeeContractRepository.create(validated, conn);

      return { success: true, status: 201 };
    } catch (error) {
      console.error("EmployeeService.createContract error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.createContract unavailable", 500);
    }
  }

  async updateContract(
    id: BaseEmployee["id"],
    data: EmployeeContractForm,
  ): Promise<ServiceRes> {
    try {
      const valId = EmployeeContractIdSchema.parse(id);
      const valData = EmployeeContractFormSchema.parse(data);

      if (valData.jenis === "kontrak") {
        if (!valData.tgl_berakhir)
          throw new Err("jenis kontrak harus memiliki tanggal berakhir", 400);
        if (valData.tgl_berakhir <= valData.tgl_kontrak)
          throw new Err(
            "tanggal berakhir harus lebih besar dari tanggal kontrak",
            400,
          );

        valData.total_kontrak = calculateContractDuration(
          valData.tgl_kontrak,
          valData.tgl_berakhir,
        );
      }

      await this.employeeContractRepository.update(valId, valData);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("EmployeeContractService.updateContract error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("Invalid request data", 400);

      throw new Err("EmployeeContractService.updateContract unavailable", 500);
    }
  }

  async deleteContract(id: BaseEmployee["id"]): Promise<ServiceRes> {
    try {
      const validatedId = EmployeeContractIdSchema.parse(id);

      await this.employeeContractRepository.delete(validatedId);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("EmployeeContractService.deleteContract error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeContractService.deleteContract unavailable", 500);
    }
  }

  async deleteContractByKaryawanId(
    karyawanId: BaseEmployee["id"],
    conn: Connection,
  ): Promise<ServiceRes> {
    try {
      const validatedId = EmployeeIdSchema.parse(karyawanId);

      await this.employeeContractRepository.deleteByKaryawanId(
        validatedId,
        conn,
      );

      return { success: true, status: 200 };
    } catch (error) {
      console.error(
        "EmployeeContractService.deleteContractByKaryawanId error:",
        error,
      );

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("Invalid karyawan id", 400);

      throw new Err(
        "EmployeeContractService.deleteContractByKaryawanId unavailable",
        500,
      );
    }
  }

  async getContractNearExpiration(
    daysBefore: number,
  ): Promise<EmployeeContractExpiration[]> {
    try {
      if (typeof daysBefore !== "number")
        throw new Err("days interval must be number");

      const res =
        await this.employeeContractRepository.getNearExpiration(daysBefore);

      return res;
    } catch (error) {
      console.error(
        "EmployeeContractService.getContractNearExpiration error:",
        error,
      );

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }
}
