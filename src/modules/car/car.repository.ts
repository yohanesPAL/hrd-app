import pool from "@/lib/db";
import { ICarRepository } from "./car.interface";
import { BaseCar, BaseCarSchema, CarForm, CarTable } from "./car.schema";
import { CarMapper } from "./car.mapper";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class CarRepository implements ICarRepository {
  async getAll(): Promise<CarTable[]> {
    try {
      const [res]: any[] = await pool.query(
        `SELECT id, nama, jenis, merk, nopol, depo, tahun, jumlah_roda, status FROM kendaraan`,
      );

      return CarMapper.toTableRow(res);
    } catch (error) {
      console.error("CarRepository.getAll error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid car data", 400, error);

      throw new Err("failed to get car data", 500);
    }
  }

  async getById(carId: BaseCar["id"]): Promise<BaseCar> {
      try {
        const [res]: any[] = await pool.query("SELECT id, nama, jenis, merk, nopol, depo, tahun, jumlah_roda, status FROM kendaraan WHERE id = ?", [carId]);

        return BaseCarSchema.parse(res[0]);
      } catch (error) {
        console.error("CarRepository.getById error:", error);

        if(error instanceof ZodError) throw new Err("invalid car data", 400);

        throw new Err("failed to get car by id", 500);
      }
  }

  async create(carForm: CarForm): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO kendaraan 
        (nama, jenis, merk, nopol, depo, tahun, jumlah_roda, status)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
          carForm.nama,
          carForm.jenis,
          carForm.merk,
          carForm.nopol,
          carForm.depo,
          carForm.tahun,
          carForm.jumlah_roda,
          carForm.status,
        ],
      );

      return true;
    } catch (error) {
      console.error("CarRepository.create error:", error);

      throw new Err("failed to create car", 500);
    }
  }

  async update(carForm: CarForm, carId: BaseCar["id"]): Promise<boolean> {
    try {
      await pool.query(
        `UPDATE kendaraan SET nama = ?, jenis = ?, merk = ?, nopol = ?, depo = ?, tahun = ?, jumlah_roda = ?, status = ? WHERE id = ?`,
        [
          carForm.nama,
          carForm.jenis,
          carForm.merk,
          carForm.nopol,
          carForm.depo,
          carForm.tahun,
          carForm.jumlah_roda,
          carForm.status,
          carId,
        ],
      );

      return true
    } catch (error) {
      console.error("CarRepository.update error:", error);

      throw new Err("failed to update", 500);
    }
  }

  async delete(carId: BaseCar["id"], conn: Connection): Promise<boolean> {
      try {
        await conn.query(`DELETE FROM kendaraan WHERE id = ?`);

        return true;
      } catch (error) {
        console.log("CarRepository.delete error:", error);

        throw new Err("failed to delete car", 500);
      }
  }
}
