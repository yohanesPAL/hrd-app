import { RowDataPacket } from "mysql2/promise";
import { IAbsensiDetailRepository } from "./absensi.detail.interface";
import {
  AbsensiDetailTable,
  ExcelRowData,
  KodeAbsen,
} from "./absensi.detail.schema";
import { Err } from "@/lib/err";
import pool from "@/lib/db";
import { ZodError } from "zod";
import { AbsensiMapper } from "../absensi.mapper";
import { Connection } from "mysql2/promise";

export class AbsensiDetailRepository implements IAbsensiDetailRepository {
  async getByKodeAbsen(
    kodeAbsen: KodeAbsen,
  ): Promise<AbsensiDetailTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT ad.id, kode_absen, nama_absen, d.nama AS divisi, tanggal, absent, scan_masuk, scan_keluar, terlambat, lembur, jam_kerja
            FROM absen_detail ad
            JOIN divisi d ON (d.id = ad.divisi)
            WHERE kode_absen = ?`,
        [kodeAbsen],
      );

      return AbsensiMapper.toAbsensiDetailTable(rows);
    } catch (error) {
      console.error("AbsensiDetailRepository error:", error);

      if (error instanceof ZodError) throw new Err("invalid absen detail data", 400);

      throw new Err("failed to fetch absensi detail", 500);
    }
  }

  async create(data: ExcelRowData[], conn: Connection): Promise<boolean> {
    try {
      const fields = Object.keys(data[0]) as (keyof ExcelRowData)[];

      const columns = fields.join(", ");
      const placeholder = data
        .map(() => `(${fields.map(() => "?").join(", ")})`)
        .join(", ");
      const value = data.flatMap((item) => fields.map((field) => item[field]));

      const sql = `INSERT INTO absen_detail (${columns}) VALUES ${placeholder}`;
      await conn.query(sql, value);

      return true;
    } catch (error) {
      console.error("AbsensiDetailRepository.create error:", error);

      throw new Err("failed to import absen detail", 500);
    }
  }

  async truncate(): Promise<boolean> {
    try {
      await pool.query("TRUNCATE TABLE absen_detail");

      return true;
    } catch (error) {
      console.error("AbsensiDetailRepository.truncate error:", error);

      throw new Err("failed to truncate absen detail", 500);
    }
  }
}
