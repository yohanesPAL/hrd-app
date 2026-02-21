import pool from "@/lib/db";
import {
  DivisionTableSchema,
  DivisionTable,
  DivisionForm,
  BaseDivision,
} from "./division.schema";
import { RowDataPacket } from "mysql2";
import { IDivisionRepository } from "./division.interface";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class DivisionRepository implements IDivisionRepository {
  async getAll(): Promise<DivisionTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT id, nama, is_active FROM divisi`,
      );

      const normalized = rows.map((row, index) => ({
        no: index + 1,
        id: String(row.id),
        nama: row.nama,
        is_active: row.is_active === 1,
      }));

      return DivisionTableSchema.array().parse(normalized);
    } catch (error: unknown) {
      console.error("DivisionRepository.getAll error:", error);
      if (error instanceof ZodError) {
        throw new Err("invalid divisions data", 400);
      }
      throw new Err("failed to read divisions", 500);
    }
  }

  async create(data: DivisionForm, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `INSERT INTO divisi (nama, is_active) VALUES (?,?)`,
        [data.nama, data.is_active],
      );

      return true;
    } catch (error: unknown) {
      console.error("DivisionRepository.create error:", error);
      throw new Err("failed to create division", 500);
    }
  }

  async update(data: BaseDivision, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(
        `UPDATE divisi SET nama = ?, is_active = ? WHERE id = ?`,
        [data.nama, data.is_active, data.id],
      );

      return true;
    } catch (error: unknown) {
      console.error("DivisionRepository.update error:", error);
      throw new Err("failed to update division", 500);
    }
  }

  async delete(id: string, conn: Connection): Promise<boolean> {
    try {
      const [res] = await conn.query(`DELETE FROM divisi WHERE id = ?`, [id]);

      return true;
    } catch (error: unknown) {
      console.log("DivisionRepository.delete error:", error);
      throw new Err("failed to delete division", 500);
    }
  }
}
