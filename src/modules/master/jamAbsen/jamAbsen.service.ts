import { Err } from "@/lib/err";
import { IJamAbsenRepository, IJamAbsenService } from "./jamAbsen.interface";
import {
  JamAbsenDivisi,
  JamAbsenForm,
  JamAbsenFormSchema,
  JamAbsenTable,
} from "./jamAbsen.schema";
import pool from "@/lib/db";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";
import { JamAbsenMapper } from "./jamAbsen.mapper";

export class JamAbsenService implements IJamAbsenService {
  constructor(private jamAbsenRepository: IJamAbsenRepository) {}

  async getAllJamAbsen(): Promise<ServiceRes<JamAbsenTable[]>> {
    try {
      const res = await this.jamAbsenRepository.getAll();

      return { success: true, status: 200, data: res };
    } catch (error: unknown) {
      console.error("JamAbsenService.getAllJamAbsen error:", error);

      if (error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500);
    }
  }

  async getJamAbsenDivisi(): Promise<ServiceRes<JamAbsenDivisi[]>> {
    try {
      const res = await this.jamAbsenRepository.getByDivisi();

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error("JamAbsenService.getJamAbsenDivisi error:", error);

      if (error instanceof Err) throw error
      
      throw new Err("internal server error", 500);
    }
  }

  async updateJamAbsen(data: JamAbsenForm) {
    let conn;

    try {
      const validated = JamAbsenFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const persistenceData = JamAbsenMapper.toPersistence(validated)
      await this.jamAbsenRepository.update(persistenceData, conn);

      await conn.commit();
      return { success: true, status: 200 };
    } catch (error: unknown) {
      if (conn) conn.rollback();

      console.error("JamAbsenService.updateJamAbsen error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async resetJamAbsen(id: string): Promise<ServiceRes> {
    if (!id || typeof id !== "string")
      throw new Err("invalid request data", 400);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await this.jamAbsenRepository.reset(id, conn);

      await conn.commit();
      return { success: true, status: 201 };
    } catch (error: unknown) {
      await conn.rollback();

      console.error("JamAbsenService.resetJamAbsen error:", error);

      if (error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500);
    } finally {
      conn.release();
    }
  }
}
