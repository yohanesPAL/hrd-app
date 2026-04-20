import pool from "@/lib/db";
import { IDepoRepository } from "./depo.interface";
import { BaseDepo, DepoForm, DepoTable } from "./depo.schema";
import { DepoMapper } from "./depo.mapper";
import { Err } from "@/lib/err";
import { ZodError } from "zod";

export class DepoRepository implements IDepoRepository {
  async getAll(): Promise<DepoTable[]> {
    try {
      const [res]: any[] = await pool.query("SELECT id, nama FROM depo");

      return DepoMapper.toTableRows(res);
    } catch (error) {
      console.error("DepoRepository.getAll error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid depo data", 400, error);

      throw new Err("failed to fetch depo", 500, error);
    }
  }

  async create(depoForm: DepoForm): Promise<boolean> {
      try {
        await pool.query("INSERT INTO depo (nama) VALUES (?)", depoForm.nama);

        return true;
      } catch (error) {
        console.error("DepoRepository.create error:", error);

        throw new Err("failed to create depo", 500, error)
      }
  }

  async update(depoForm: DepoForm, depoId: BaseDepo["id"]): Promise<boolean> {
      try {
        await pool.query("UPDATE depo SET nama = ? WHERE id = ?", [depoForm.nama, depoId]);

        return true;
      } catch (error) {
        console.error("DepoRepository.update error:", error);

        throw new Err("failed to update depo", 500, error);
      }
  }

  async delete(depoId: BaseDepo["id"]): Promise<boolean> {
      try {
        await pool.query("DELETE FROM depo WHERE id = ?", [depoId]);

        return true;
      } catch (error) {
        console.error("DepoRepository.delete error:", error);

        throw new Err("failed to delete depo", 500, error);
      }
  }
}
