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
import { Connection } from "mysql2/promise";

export class EmployeeRepository implements IEmployeeRepository {
  async getAll(): Promise<EmployeeTable[]> {
    try {
      const [rows]: any[] = await pool.query(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, status_aktif, sp, status_karyawan, kode_absensi
          FROM karyawan k
          JOIN divisi d ON (d.id = k.divisi)
          JOIN jabatan j ON (j.id = k.jabatan)`,
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
      const [rows] = await pool.query(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, sp, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak, kode_absensi
            FROM karyawan k
            JOIN divisi d ON (d.id = k.divisi)
            JOIN jabatan j ON (j.id = k.jabatan)
            WHERE k.id = ?`,
        [id],
      );

      return BaseEmployeeSchema.parse(rows);
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
        `SELECT nik, nama, jk, alamat, hp, divisi, jabatan, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak 
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

  async getOpenEmployees(selectedId?: UserId): Promise<OpenEmployee[]> {
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
      console.error("EmployeeRepository.getOpenEmployees error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid open employees data", 400);

      throw new Err("failed to fetch open employees", 500);
    }
  }

  async create(data: EmployeeForm): Promise<boolean> {
    try {
      const fields = Object.keys(data) as (keyof EmployeeForm)[];
      if (fields.length === 0) throw new Err("invalid request data", 400);

      const columns = fields.join(", ");
      const placeholder = fields.map(() => "?").join();
      const values = fields.map((field) => data[field]);

      const sql = `INSERT INTO karyawan (${columns}) VALUES (${placeholder})`;
      await pool.query(sql, values);

      return true;
    } catch (error) {
      console.error("EmployeeRepository.create error:", error);

      throw new Err("failed to create employee", 500);
    }
  }

  async delete(id: string, conn: Connection): Promise<boolean> {
    try {
      await conn.query("DELETE FROM karyawan WHERE id = ?", [id]);

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
