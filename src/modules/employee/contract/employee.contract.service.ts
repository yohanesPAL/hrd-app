import { ServiceRes } from "@/types/ServiceTypes";
import { BaseEmployee } from "../employee.schema";
import { IEmployeeContractService } from "./employee.contract.interface";
import {
  EmployeeContractFormSchema,
  EmployeeContractIdSchema,
  EmployeeContractForm,
} from "./employee.contract.schema";
import { Err } from "@/lib/err";
import { EmployeeContractRepository } from "./employee.contract.repository";
import { Connection } from "mysql2/promise";
import pool from "@/lib/db";

export class EmployeeContractService implements IEmployeeContractService {
  constructor(private employeeContractRepository: EmployeeContractRepository) {}

  async getContractByKaryawanId(
    karyawanId: BaseEmployee["id"],
  ): Promise<ServiceRes> {
    try {
      const contracts =
        await this.employeeContractRepository.getByKaryawanId(karyawanId);

      return { success: true, status: 200, data: contracts };
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

        const diffTime = validated.tgl_berakhir.getTime() - validated.tgl_kontrak.getTime();
        validated.total_kontrak = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

      await this.employeeContractRepository.update(valId, valData);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("EmployeeContractService.updateContract error:", error);

      if (error instanceof Err) throw error;

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
}
