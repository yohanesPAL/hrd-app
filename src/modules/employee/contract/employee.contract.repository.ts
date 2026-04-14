import pool from "@/lib/db";
import { IEmployeeContractRepository } from "./employee.contract.interface";
import {
  EmployeeContractTable,
  EmployeeContractForm,
  EmployeeContractExpiration,
  EmployeeContractExpirationSchema,
} from "./employee.contract.schema";
import { BaseEmployee } from "../employee.schema";
import { EmployeeContractMapper } from "./employee.contract.mapper";
import { Err } from "@/lib/err";
import { ZodError } from "zod";
import { Connection } from "mysql2/promise";

export class EmployeeContractRepository implements IEmployeeContractRepository {
  async getByKaryawanId(
    karyawanId: BaseEmployee["id"],
  ): Promise<EmployeeContractTable[]> {
    try {
      const [rows]: any[] = await pool.query(
        `SELECT kk.id, k.nama AS karyawan_nama, kk.jenis, tgl_kontrak, tgl_berakhir, total_kontrak
            FROM kontrak_karyawan kk
            JOIN karyawan k ON (k.id = kk.karyawan_id)
            WHERE kk.karyawan_id = ?`,
        [karyawanId],
      );

      return EmployeeContractMapper.toTableRows(rows);
    } catch (error) {
      console.error("EmployeeContractRepository.getByKaryawanId error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid contract data", 400);

      throw new Err("failed to fetch employees data", 500);
    }
  }

  async create(data: EmployeeContractForm, conn: Connection): Promise<boolean> {
    try {
      await conn.query(
        `INSERT INTO kontrak_karyawan (karyawan_id, jenis, tgl_kontrak, tgl_berakhir, total_kontrak) VALUES (?,?,?,?,?)`,
        [
          data.karyawan_id,
          data.jenis,
          data.tgl_kontrak,
          data.tgl_berakhir,
          data.total_kontrak,
        ],
      );

      return true;
    } catch (error) {
      console.error("EmployeeContractRepository.create error:", error);

      throw new Err("failed to create employees data", 500);
    }
  }

  async update(
    id: BaseEmployee["id"],
    data: EmployeeContractForm,
  ): Promise<boolean> {
    try {
      await pool.query(
        `UPDATE kontrak_karyawan SET jenis = ?, tgl_kontrak = ?, tgl_berakhir = ?, total_kontrak = ? WHERE id = ?`,
        [
          data.jenis,
          data.tgl_kontrak,
          data.tgl_berakhir,
          data.total_kontrak,
          id,
        ],
      );

      return true;
    } catch (error) {
      console.error("EmployeeContractRepository.update error:", error);

      throw new Err("failed to update employee contract", 500);
    }
  }

  async delete(id: BaseEmployee["id"]): Promise<boolean> {
    try {
      await pool.query("DELETE FROM kontrak_karyawan WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.error("EmployeeContractRepository.delete error:", error);

      throw new Err("failed to delete employee contract", 500);
    }
  }

  async deleteByKaryawanId(
    karyawanId: BaseEmployee["id"],
    conn: Connection,
  ): Promise<boolean> {
    try {
      await conn.query("DELETE FROM kontrak_karyawan WHERE karyawan_id = ?", [
        karyawanId,
      ]);

      return true;
    } catch (error) {
      console.error(
        "EmployeeContractRepository.deleteByKaryawanId error:",
        error,
      );

      throw new Err("failed to delete employee contract by karyawan id", 500);
    }
  }

  async getNearExpiration(daysBefore: number): Promise<EmployeeContractExpiration[]> {
    try {
      let daysInterval = "";
      if (daysBefore > 0) daysInterval = ` + INTERVAL ${daysBefore} DAY`;

      const sql = `
        SELECT kk.id, tgl_berakhir, k.nama FROM kontrak_karyawan kk
          JOIN karyawan k ON (k.id = kk.karyawan_id)
          WHERE jenis = 'kontrak' AND tgl_berakhir = CURRENT_DATE${daysInterval}
      `;

      const [rows] = await pool.query(sql);

      return EmployeeContractExpirationSchema.array().parse(rows);
    } catch (error) {
      console.error(
        "EmployeeContractRepository.getNearExpiration error:",
        error,
      );

      if (error instanceof ZodError)
        throw new Err("invalid contract data", 400);

      throw new Err("failed to get near expiration contract", 500);
    }
  }
}
