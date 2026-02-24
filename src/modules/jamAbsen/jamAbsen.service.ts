import { Err } from "@/lib/err";
import { IJamAbsenRepository } from "./jamAbsen.interface";
import { JamAbsenForm, JamAbsenFormDB, JamAbsenFormSchema, JamAbsenTableSchema } from "./jamAbsen.schema";
import pool from "@/lib/db";
import { ZodError } from "zod";

function timeToClock(time: number): string {
  const hours = String(Math.floor(time / 60)).padStart(2, "0");
  const minutes = String(time % 60).padStart(2, "0");
  return `${hours}:${minutes}`
}

function clockToTime(clock: string): number {
  const [hours, minutes] = clock.split(":").map(Number);
  return (hours * 60) + minutes
}

export class JamAbsenService {
  constructor(private jamAbsenRepository: IJamAbsenRepository) {}

  async getAllJamAbsen() {
    try {
      const jamAbsen = await this.jamAbsenRepository.getAll();

      const normalize = jamAbsen.map((item, index) => ({
        no: index + 1,
        id: String(item.id),
        divisi: String(item.divisi),
        nama_divisi: item.nama_divisi,
        masuk: timeToClock(item.masuk),
        keluar: timeToClock(item.keluar),
        keluar_sabtu: timeToClock(item.keluar_sabtu),
      }))

      return JamAbsenTableSchema.array().parse(normalize)
    } catch (error: unknown) {
      console.error("JamAbsenService.getAllJamAbsen error:", error);

      if (error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500);
    }
  }

  async updateJamAbsen(data: JamAbsenForm) {
    let conn;

    try {
      JamAbsenFormSchema.parse(data);

      const normalized: JamAbsenFormDB = {
        id: data.id,
        masuk: clockToTime(data.masuk),
        keluar: clockToTime(data.keluar),
        keluar_sabtu: clockToTime(data.keluar_sabtu),
      }

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.jamAbsenRepository.update(normalized, conn);

      await conn.beginTransaction();
      return {success: res, status: 200}
    } catch (error: unknown) {
      if(conn) conn.rollback();
      
      console.error("JamAbsenService.updateJamAbsen error:", error)

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500)
    } finally {
      if (conn) await conn.release();
    }
  }

  async resetJamAbsen(id: string) {
    if(!id || typeof id !== "string") throw new Err("invalid request data", 400);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const res = this.jamAbsenRepository.reset(id, conn);

      await conn.commit();
      return {success: res, status: 201}
    } catch (error: unknown) {
      await conn.rollback();

      console.error("JamAbsenService.resetJamAbsen error:", error);

      if(error instanceof Err) throw error;

      throw new Err("JamAbsenService unavailable", 500)
    } finally {
      await conn.release();
    }
  }
}