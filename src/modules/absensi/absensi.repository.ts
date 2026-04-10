import { Connection, RowDataPacket } from "mysql2/promise";
import { IAbsensiRepository } from "./absensi.interface";
import { Err } from "@/lib/err";
import pool from "@/lib/db";
import { AbsensiTable } from "./absensi.schema";
import { ZodError } from "zod";
import { AbsensiMapper } from "./absensi.mapper";
import { dbErr } from "@/lib/dbErr";

export class AbsensiRepository implements IAbsensiRepository {
  async getAll(): Promise<AbsensiTable[]> {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          `SELECT a.id, kode_absen, nama_absen, d.nama AS divisi, hadir, absent, terlambat, lembur, jam_kerja 
            FROM absen a
            JOIN divisi d ON (d.id = a.divisi)`
        )

        return AbsensiMapper.toAbsensiTable(rows);
      } catch (error) {
        console.error("AbsensiRepository.getAll error:", error);

        if(error instanceof ZodError) throw new Err("invalid absensi data", 400);

        throw new Err("failed to fetch absensi", 500);
      }
  }

  async create(conn: Connection): Promise<boolean> {
    try {
      await conn.query(
        `INSERT INTO absen (kode_absen, nama_absen, divisi, hadir, absent, terlambat, lembur, jam_kerja)
          SELECT 
            ANY_VALUE(kode_absen) AS kode_absen,
            ANY_VALUE(nama_absen) AS nama_absen,
            ANY_VALUE(divisi) AS divisi,
            SUM(CASE WHEN absent = 0 THEN 1 ELSE 0 END) AS hadir,
            SUM(CASE WHEN absent = 1 THEN 1 ELSE 0 END) AS absent,
            SUM(terlambat),
            SUM(lembur),
            SUM(jam_kerja)
            FROM absen_detail
          GROUP BY kode_absen`,
      );

      return true;
    } catch (error: any) {
      console.error("AbsensiRepository.create error:", error);

      if(error.code == dbErr.duplicate) throw new Err("duplicate entry", 400);

      throw new Err(error as string, 500);
    }
  }

  async truncate() {
    try {
      await pool.query("TRUNCATE TABLE absen");

      return true;
    } catch (error) {
      console.error("AbsensiRepository.truncate error:", error);

      throw new Err("failed to truncate absen", 500);
    }
  }
}
