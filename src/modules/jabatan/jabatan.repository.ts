import { ZodError } from "zod";
import { IPositionRepository } from "./jabatan.interface";
import {
  BasePosition,
  PositionForm,
  PositionTable,
  PositionTableSchema,
} from "./jabatan.schema";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class PositionRepository implements IPositionRepository {
  async getAll(): Promise<PositionTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT j.id, j.id_divisi, d.nama AS nama_divisi, j.nama, j.is_active FROM jabatan j JOIN divisi d ON (d.id = j.id_divisi)",
      );

      const normalize = rows.map((row, index) => ({
        no: index + 1,
        id: String(row.id),
        id_divisi: String(row.id_divisi),
        nama_divisi: row.nama_divisi,
        nama: row.nama,
        is_active: row.is_active === 1,
      }));

      return PositionTableSchema.array().parse(normalize);
    } catch (error: unknown) {
      console.error("PositionRepository.getAll error:", error);

      if (error instanceof ZodError) throw new Err("invalid positions data", 400);

      throw new Err("failed to read positions", 500);
    }
  }

  async create(data: PositionForm, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `INSERT INTO jabatan (id_divisi, nama, is_active) VALUES (?,?,?)`,
        [data.id_divisi, data.nama, data.is_active],
      );

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.create error:", error);
      throw new Err("failed to create position", 500);
    }
  }

  async update(data: BasePosition, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `UPDATE jabatan SET id_divisi = ?, nama = ?, is_active = ? WHERE id = ?`,
        [data.id_divisi, data.nama, data.is_active, data.id],
      );

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.update error:", error);
      throw new Err("failed to update position", 500);
    }
  }

  async delete(id: string, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(`DELETE FROM jabatan WHERE id = ?`, [id]);

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.delete error:", error);
      throw new Err("failed to delete position", 500);
    }
  }
}
