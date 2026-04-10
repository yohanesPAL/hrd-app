import pool from "@/lib/db";
import { IJamAbsenRepository } from "./jamAbsen.interface";
import {
  JamAbsenDivisi,
  JamAbsenDivisiSchema,
  JamAbsenFormDB,
  JamAbsenTable,
} from "./jamAbsen.schema";
import { RowDataPacket } from "mysql2";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";
import { JamAbsenMapper } from "./jamAbsen.mapper";

export class JamAbsenRepository implements IJamAbsenRepository {
  async getAll(): Promise<JamAbsenTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT ja.id, divisi, d.nama AS nama_divisi, masuk, keluar, keluar_sabtu
            FROM jam_absensi ja
            JOIN divisi d ON (d.id = ja.divisi)`,
      );

      return JamAbsenMapper.toTableRows(rows);
    } catch (error: unknown) {
      console.error("JamAbsenRepository.getAll error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid jam absen data", 400);

      throw new Err("failed to fetch jam absen", 500);
    }
  }

  async getByDivisi(): Promise<JamAbsenDivisi[]> {
    try {
      const [rows] = await pool.query(`
          SELECT divisi, masuk, keluar, keluar_sabtu FROM jam_absensi
        `);

      return JamAbsenDivisiSchema.array().parse(rows);
    } catch (error) {
      console.error("JamAbsenRepository.getByDivisi error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid jam absesn divisi data", 400);

      throw new Err("failed to get jam absen divisi", 500);
    }
  }

  async update(data: JamAbsenFormDB, conn: Connection): Promise<boolean> {
    try {
      await conn.query(
        `UPDATE jam_absensi SET masuk = ?, keluar = ?, keluar_sabtu = ? WHERE id = ?`,
        [data.masuk, data.keluar, data.keluar_sabtu, data.id],
      );

      return true;
    } catch (error: unknown) {
      console.error("JamAbsenRepository.update error", error);
      throw new Err("failed to update jam absen", 500);
    }
  }

  async reset(id: string, conn: Connection): Promise<boolean> {
    try {
      await conn.query(
        `UPDATE jam_absensi SET masuk = DEFAULT, keluar = DEFAULT, keluar_sabtu = DEFAULT WHERE id = ?`,
        [id],
      );

      return true;
    } catch (error: unknown) {
      console.error("JamAbsenRepository.resetJamAbsen error:", error);
      throw new Err("failed to reset jam absen", 500);
    }
  }
}
