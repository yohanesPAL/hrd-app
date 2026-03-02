import pool from "@/lib/db";
import { IEmployeeRepository } from "./employee.interface";
import {
  BaseEmployee,
  BaseEmployeeSchema,
  EmployeeAbsentDiv,
  EmployeeAbsentDivSchema,
  EmployeeForm,
  EmployeeTable,
  EmployeeTableSchema,
  EmployeeUpdate,
  EmployeeUpdateSchema,
} from "./employee.schema";
import { RowDataPacket } from "mysql2";
import { Err } from "@/lib/err";
import { ZodError } from "zod";
import { Connection } from "mysql2/promise";
import { formatDateYYYYMMDD } from "@/utils/dateFormatting";

export class EmployeeRepository implements IEmployeeRepository {
  async getAll(): Promise<EmployeeTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, status_aktif, sp, status_karyawan, kode_absensi
          FROM karyawan k
          JOIN divisi d ON (d.id = k.divisi)
          JOIN jabatan j ON (j.id = k.jabatan)`,
      );

      const normalize = rows.map((item, index) => ({
        no: index + 1,
        id: String(item.id),
        nik: item.nik,
        nama: item.nama,
        jk: item.jk,
        alamat: item.alamat,
        hp: item.hp,
        divisi: item.divisi,
        jabatan: item.jabatan,
        sp: item.sp,
        status_aktif: Number(item.status_aktif) === 1,
        status_karyawan: item.status_karyawan,
        kode_absensi: item.kode_absensi,
      }));

      return EmployeeTableSchema.array().parse(normalize);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getAll error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid employees data", 400);

      throw new Err("failed to fetch employees data", 500);
    }
  }

  async getById(id: BaseEmployee["id"]): Promise<BaseEmployee> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT k.id, nik, k.nama, jk, alamat, hp, d.nama AS divisi, j.nama AS jabatan, sp, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak, kode_absensi
            FROM karyawan k
            JOIN divisi d ON (d.id = k.divisi)
            JOIN jabatan j ON (j.id = k.jabatan)
            WHERE k.id = ?`,
        [id],
      );

      const normalize = {
        ...rows[0],
        status_aktif: rows[0].status_aktif === 1,
      };

      return BaseEmployeeSchema.parse(normalize);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getDetails error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid employee data", 400);

      throw new Err("failed to fetch employee data", 500);
    }
  }

  async getForUpdateById(id: BaseEmployee["id"]): Promise<EmployeeUpdate> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT nik, nama, jk, alamat, hp, divisi, jabatan, cuti_terakhir, cuti_sekarang, status_aktif, status_karyawan, tgl_masuk, tgl_keluar, durasi_kontrak 
          FROM karyawan k
          WHERE k.id = ?`,
        [id],
      );

      const normalize: EmployeeUpdate = {
        ...rows[0],
        tgl_masuk: rows[0].tgl_masuk
          ? formatDateYYYYMMDD(rows[0].tgl_masuk)
          : "",
        tgl_keluar: rows[0].tgl_keluar
          ? formatDateYYYYMMDD(rows[0].tgl_keluar)
          : "",
        status_aktif: rows[0].status_aktif === 1,
      };

      return EmployeeUpdateSchema.parse(normalize);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getForUpdateById error:", error);

      throw new Err("failed to fetch employee for update", 500);
    }
  }

  async getDivisionCode(absentCodes: string[]): Promise<EmployeeAbsentDiv[]> {
    try {
      const placeholder = absentCodes.map((item) => "?").join(", ");
      const values = absentCodes.map((item) => item);

      const sql = `SELECT kode_absensi, divisi FROM karyawan WHERE kode_absensi IN (${placeholder})`;
      const [rows] = await pool.query<RowDataPacket[]>(sql, values);

      return EmployeeAbsentDivSchema.array().parse(rows);
    } catch (error: unknown) {
      console.error("EmployeeRepository.getDivisionCode error:", error);

      throw new Err("failed to fetch div code employee", 500);
    }
  }

  async create(data: EmployeeForm, conn: Connection): Promise<boolean> {
    try {
      const fields = Object.keys(data) as (keyof EmployeeForm)[];
      if (fields.length === 0) throw new Err("invalid request data", 400);

      const columns = fields.join(", ");
      const placeholder = fields.map(() => "?").join();
      const values = fields.map((field) => data[field]);

      const sql = `INSERT INTO karyawan (${columns}) VALUES (${placeholder})`;
      const [res] = await conn.query(sql, values);

      return true;
    } catch (error: unknown) {
      console.error("EmployeeRepository.create error:", error);

      throw new Err("failed to create employee", 500);
    }
  }

  async delete(id: string, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query<RowDataPacket[]>(
        "DELETE FROM karyawan WHERE id = ?",
        [id],
      );

      return true;
    } catch (error: unknown) {
      console.error("EmployeeRepository.delete error:", error);

      throw new Err("failed to update employee", 500);
    }
  }

  async update(
    id: BaseEmployee["id"],
    data: EmployeeUpdate,
    conn: Connection,
  ): Promise<boolean> {
    try {
      const fields = Object.keys(data) as (keyof EmployeeUpdate)[];
      if (fields.length === 0) throw new Err("invalid request data", 400);

      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((field) => data[field]);

      const sql = `UPDATE karyawan SET ${setClause} WHERE id = ?`;
      const [res] = await conn.query(sql, [...values, id]);

      return (res as any).affectedRows > 0;
    } catch (error: unknown) {
      console.error("EmployeeRepository.update error:", error);

      throw new Err("failed to update employee", 500);
    }
  }
}
