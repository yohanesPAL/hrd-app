import pool from "@/lib/db";
import {
  DivisionTable,
  DivisionForm,
  BaseDivision,
  ActiveDivision,
  ActiveDivisionSchema,
} from "./division.schema";
import { RowDataPacket } from "mysql2";
import { IDivisionRepository } from "./division.interface";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";
import { DivisionMapper } from "./division.mapper";

export class DivisionRepository implements IDivisionRepository {
  async getAll(): Promise<DivisionTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT id, nama, is_active FROM divisi`,
      );

      return DivisionMapper.toTableRows(rows);
    } catch (error: unknown) {
      console.error("DivisionRepository.getAll error:", error);

      if (error instanceof ZodError) throw new Err("invalid divisions data", 400);
      
      throw new Err("failed to read divisions", 500);
    }
  }

  async getActive(): Promise<ActiveDivision[]> {
      try {
        const [rows] = await pool.query("SELECT id, nama FROM divisi WHERE is_active = 1");

        return ActiveDivisionSchema.array().parse(rows)
      } catch (error: unknown) {
        console.error("DivisionRepository.getActive error:", error)

        if (error instanceof ZodError) throw new Err("invalid active division data", 400)

        throw new Err("failed to fetch active division", 500)
      }
  }

  async create(data: DivisionForm): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO divisi (nama, is_active) VALUES (?,?)`,
        [data.nama, data.is_active],
      );

      return true;
    } catch (error: unknown) {
      console.error("DivisionRepository.create error:", error);

      throw new Err("failed to create division", 500);
    }
  }

  async update(data: BaseDivision): Promise<boolean> {
    try {
      await pool.query(
        `UPDATE divisi SET nama = ?, is_active = ? WHERE id = ?`,
        [data.nama, data.is_active, data.id],
      );

      return true;
    } catch (error: unknown) {
      console.error("DivisionRepository.update error:", error);
      throw new Err("failed to update division", 500);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await pool.query(`DELETE FROM divisi WHERE id = ?`, [id]);

      return true;
    } catch (error: unknown) {
      console.error("DivisionRepository.delete error:", error);
      
      throw new Err("failed to delete division", 500);
    }
  }
}
