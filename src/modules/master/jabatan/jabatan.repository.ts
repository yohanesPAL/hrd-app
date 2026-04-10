import { ZodError } from "zod";
import { IPositionRepository } from "./jabatan.interface";
import {
  ActivePosition,
  ActivePositionSchema,
  BasePosition,
  PositionForm,
  PositionTable,
} from "./jabatan.schema";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Err } from "@/lib/err";
import { JabatanMapper } from "./jabatan.mapper";

export class PositionRepository implements IPositionRepository {
  async getAll(): Promise<PositionTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT j.id, j.id_divisi, d.nama AS nama_divisi, j.nama, j.is_active FROM jabatan j JOIN divisi d ON (d.id = j.id_divisi)",
      );

      return JabatanMapper.toTableRows(rows);
    } catch (error: unknown) {
      console.error("PositionRepository.getAll error:", error);

      if (error instanceof ZodError) throw new Err("invalid positions data", 400);

      throw new Err("failed to read positions", 500);
    }
  }

 async getActive(): Promise<ActivePosition[]> {
  try {
    const [rows] = await pool.query(
      "SELECT id, id_divisi, nama FROM jabatan j WHERE j.is_active = 1"
    )

    return ActivePositionSchema.array().parse(rows);
  } catch (error: unknown) {
    console.error("PositionRepositoru.getActive error:", error);

    if (error instanceof ZodError) throw new Err("invalid active positions data", 400);

    throw new Err("failed to read positions", 500)
  }
 }

  async create(data: PositionForm): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO jabatan (id_divisi, nama, is_active) VALUES (?,?,?)`,
        [data.id_divisi, data.nama, data.is_active],
      );

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.create error:", error);

      throw new Err("failed to create position", 500);
    }
  }

  async update(data: BasePosition): Promise<boolean> {
    try {
      await pool.query(
        `UPDATE jabatan SET id_divisi = ?, nama = ?, is_active = ? WHERE id = ?`,
        [data.id_divisi, data.nama, data.is_active, data.id],
      );

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.update error:", error);

      throw new Err("failed to update position", 500);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await pool.query(`DELETE FROM jabatan WHERE id = ?`, [id]);

      return true;
    } catch (error: unknown) {
      console.error("PositionRepository.delete error:", error);

      throw new Err("failed to delete position", 500);
    }
  }
}
