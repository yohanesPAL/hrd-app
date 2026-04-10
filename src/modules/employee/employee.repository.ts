import pool from "@/lib/db";
import { IEmployeeRepository } from "./employee.interface";
import {
  BaseEmployee,
  BaseEmployeeSchema,
  EmployeeAbsentDiv,
  EmployeeAbsentDivSchema,
  EmployeeForm,
  EmployeeTable,
  EmployeeUpdate,
  OpenEmployee,
  OpenEmployeeSchema,
} from "./employee.schema";
import { Err } from "@/lib/err";
import { ZodError } from "zod";
import { EmployeeMapper } from "./employee.mapper";
import { UserId } from "../user/user.schema";
import { Connection, ResultSetHeader } from "mysql2/promise";

export class EmployeeRepository implements IEmployeeRepository {
  async getAll(): Promise<EmployeeTable[]> {
    try {
      const [rows]: any[] = await pool.query(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, k.is_active, sp, kode_absensi, jenis_kontrak, tgl_berakhir FROM karyawan k
          JOIN divisi d ON (d.id = k.divisi)
          JOIN jabatan j ON (j.id = k.jabatan)
          LEFT JOIN (
         	  SELECT kk.karyawan_id, jenis AS jenis_kontrak, tgl_berakhir FROM kontrak_karyawan kk
				    JOIN (
    				   SELECT karyawan_id, MAX(id) as max_id FROM kontrak_karyawan GROUP BY karyawan_id
				    ) latest ON kk.id = latest.max_id
          ) t1 ON (t1.karyawan_id = k.id);`,
      );

      return EmployeeMapper.toTableRows(rows);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getAll error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid employees data", 400);

      throw new Err("failed to fetch employees data", 500);
    }
  }

  async getById(id: BaseEmployee["id"]): Promise<BaseEmployee> {
    try {
      const [rows]: any = await pool.query(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, sp, cuti_terakhir, cuti_sekarang, k.is_active, tgl_masuk, tgl_keluar, kode_absensi
            FROM karyawan k
            JOIN divisi d ON (d.id = k.divisi)
            JOIN jabatan j ON (j.id = k.jabatan)
            WHERE k.id = ?`,
        [id],
      );

      return BaseEmployeeSchema.parse(rows[0]);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getDetails error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid employee data", 400);

      throw new Err("failed to fetch employee data", 500);
    }
  }

  async getForUpdateById(id: BaseEmployee["id"]): Promise<EmployeeUpdate> {
    try {
      const [rows]: any[] = await pool.query(
        `SELECT nik, nama, jk, alamat, hp, divisi, jabatan, cuti_terakhir, cuti_sekarang, is_active, tgl_masuk, tgl_keluar 
          FROM karyawan k
          WHERE k.id = ?`,
        [id],
      );

      return EmployeeMapper.toUpdateForm(rows[0]);
    } catch (error) {
      console.error("EmployeeRepository.getForUpdateById error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid employee data", 400);

      throw new Err("failed to fetch employee for update", 500);
    }
  }

  async getDivisionCode(absentCodes: string[]): Promise<EmployeeAbsentDiv[]> {
    try {
      const placeholder = absentCodes.map((item) => "?").join(", ");
      const values = absentCodes.map((item) => item);

      const sql = `SELECT kode_absensi, divisi FROM karyawan WHERE kode_absensi IN (${placeholder})`;
      const [rows] = await pool.query(sql, values);

      return EmployeeAbsentDivSchema.array().parse(rows);
    } catch (error) {
      console.error("EmployeeRepository.getDivisionCode error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid div code data", 400);

      throw new Err("failed to fetch div code employee", 500);
    }
  }

  // Get employee that has no account
  async getUnaccountedEmployees(selectedId?: UserId): Promise<OpenEmployee[]> {
    try {
      let selectedFilter = "";
      let args = "";
      if (selectedId) {
        selectedFilter = "OR a.id = ?";
        args = selectedId;
      }

      const [rows] = await pool.query(
        `SELECT k.id, nik, k.nama, j.nama AS jabatan FROM karyawan k
            LEFT JOIN akun a ON (k.id = a.karyawan_id)
            JOIN jabatan j ON (j.id = k.jabatan)
            WHERE a.karyawan_id IS NULL ${selectedFilter}`,
        [args],
      );

      return OpenEmployeeSchema.array().parse(rows);
    } catch (error) {
      console.error("EmployeeRepository.getUnaccountedEmployees error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid open employees data", 400);

      throw new Err("failed to fetch open employees", 500);
    }
  }

  async create(data: EmployeeForm, conn: Connection): Promise<string> {
    try {
      const fields = Object.keys(data) as (keyof EmployeeForm)[];
      if (fields.length === 0) throw new Err("invalid request data", 400);

      const columns = fields.join(", ");
      const placeholder = fields.map(() => "?").join(",");
      const values = fields.map((field) => data[field]);

      const sql = `INSERT INTO karyawan (${columns}) VALUES (${placeholder})`;
      const [res] = await conn.query<ResultSetHeader>(sql, values);

      return String(res.insertId);
    } catch (error: any) {
      console.error("EmployeeRepository.create error:", error);

      if(error.code === "ER_DUP_ENTRY" || error.errno === 1062 ) throw new Err("NIK sudah ada", 400);

      throw new Err("failed to create employee", 500);
    }
  }

  async delete(id: string, conn: Connection): Promise<boolean> {
    try {
      await conn.query("UPDATE karyawan SET is_active = 0 WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.error("EmployeeRepository.delete error:", error);

      throw new Err("failed to update employee", 500);
    }
  }

  async update(id: BaseEmployee["id"], data: EmployeeUpdate): Promise<boolean> {
    try {
      const fields = Object.keys(data) as (keyof EmployeeUpdate)[];
      if (fields.length === 0) throw new Err("invalid request data", 400);

      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((field) => data[field]);

      const sql = `UPDATE karyawan SET ${setClause} WHERE id = ?`;
      await pool.query(sql, [...values, id]);

      return true;
    } catch (error: unknown) {
      console.error("EmployeeRepository.update error:", error);

      throw new Err("failed to update employee", 500);
    }
  }
}
