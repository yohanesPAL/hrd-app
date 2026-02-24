import { Err } from "@/lib/err";
import { IPositionRepository } from "./jabatan.interface";
import {
  BasePosition,
  PositionForm,
  PositionFormSchema,
} from "./jabatan.schema";
import pool from "@/lib/db";
import { ZodError } from "zod";
import { BaseDivisionSchema } from "../divisi/division.schema";

export class PositionService {
  constructor(private positionRepository: IPositionRepository) {}

  async getAllPositions() {
    try {
      const positions = await this.positionRepository.getAll();

      return positions;
    } catch (error: unknown) {
      console.error("PositionService.getAllPositions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async createPosition(data: PositionForm) {
    let conn;
    try {
      PositionFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.positionRepository.create(data, conn);

      await conn.commit();

      return { success: res, status: 201 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();

      console.error("PositionService.createPosition error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    } finally {
      if (conn) await conn.release();
    }
  }

  async updatePosition(data: BasePosition) {
    let conn;
    try {
      BaseDivisionSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.positionRepository.update(data, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();

      console.error("PositionService.updateDivision error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("DivisionService unvailable", 500);
    } finally {
      if (conn) await conn.release();
    }
  }

  async deletePosition(id: string) {
    if (!id || typeof id !== "string")
      throw new Err("invalid request body", 400);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const res = await this.positionRepository.delete(id, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      await conn.rollback();

      console.error("PositionService.deletePosition error:", error);

      if (error instanceof Err) throw error;

      throw new Err("PositionService unavailable", 500);
    } finally {
      await conn.release();
    }
  }
}
