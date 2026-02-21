import { Err } from "@/lib/err";
import { IDivisionRepository } from "./division.interface";
import {
  BaseDivision,
  BaseDivisionSchema,
  DivisionForm,
  DivisionFormSchema,
} from "./division.schema";
import pool from "@/lib/db";
import { string, ZodError } from "zod";

export class DivisionService {
  constructor(private divisionRepository: IDivisionRepository) {}

  async getAllDivisions() {
    try {
      const divisions = await this.divisionRepository.getAll();

      if (!divisions.length) {
        throw new Err("no divisions found", 404);
      }

      return divisions;
    } catch (error) {
      console.error("DivisionService.getAllDivisions error:", error);

      if (error instanceof Err) {
        throw error;
      }

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async createDivision(data: DivisionForm) {
    let conn;
    try {
      DivisionFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.divisionRepository.create(data, conn);

      await conn.commit();

      return { success: res, status: 201 };
    } catch (error) {
      if (conn) await conn.rollback();

      console.error("DivisionService.createDivision error:", error);

      if (error instanceof ZodError) {
        throw new Err(`invalid request data`, 400);
      }

      if (error instanceof Err) {
        throw error;
      }

      throw new Err("DivisionService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async updateDivision(data: BaseDivision) {
    let conn;
    try {
      BaseDivisionSchema.parse(data);

      conn = await pool.getConnection();
      conn.beginTransaction();

      const res = await this.divisionRepository.update(data, conn);

      await conn.commit();

      return { success: res, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();

      console.error("DivisionService.updateDivision error:", error);

      if (error instanceof ZodError) {
        throw new Err(`invalid request data`, 400);
      }

      if (error instanceof Err) {
        throw error;
      }

      throw new Err("DivisionService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async deleteDivision(id: string) {
    if (!id || typeof id !== "string") throw new Err("invalid request data", 400);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const res = await this.divisionRepository.delete(id, conn);

      await conn.commit();

      return {success: res, status: 200}
    } catch (error: unknown) {
      await conn.rollback();

      console.log("DivisionService.deleteDivision error:", error);

      if(error instanceof Err) {
        throw error;
      }

      throw new Err("DivisionService unavailable", 500)
    } finally {
      conn.release();
    }
  }
}
