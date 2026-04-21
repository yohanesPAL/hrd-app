import pool from "@/lib/db";
import { BaseCar } from "../car.schema";
import { ICarMaintenanceRepository } from "./car.maintenance.interface";
import {
  BaseCarMaintenance,
  CarMaintenanceForm,
  CarMaintenanceTable,
} from "./car.maintenance.schema";
import { CarMaintenanceMapper } from "./car.maintenance.mapper";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class CarMaintenanceRepository implements ICarMaintenanceRepository {
  async getByCarId(carId: BaseCar["id"]): Promise<CarMaintenanceTable[]> {
    try {
      const [res]: any[] = await pool.query(
        "SELECT id, id_kendaraan, ket, tanggal FROM perawatan_kendaraan WHERE id_kendaraan = ?",
        [carId],
      );

      return CarMaintenanceMapper.toTableRows(res);
    } catch (error) {
      console.error("CarMaintenanceRepository.getByCarId error:", error);

      if (error instanceof ZodError)
        throw new Err("invalid maintenance data", 400);

      throw new Err("failed to get car maintenance data", 500);
    }
  }

  async create(maintenanceForm: CarMaintenanceForm): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO perawatan_kendaraan (id_kendaraan, ket, tanggal) VALUES (?,?,?)`,
        [
          maintenanceForm.id_kendaraan,
          maintenanceForm.ket,
          maintenanceForm.tanggal,
        ],
      );

      return true;
    } catch (error) {
      console.error("CarMaintenanceRepository.create error:", error);

      throw new Err("failed to create car maintenance", 500)
    }
  }

  async update(maintenanceForm: CarMaintenanceForm, maintenanceId: BaseCarMaintenance["id"]): Promise<boolean> {
      try {
        await pool.query(`UPDATE perawatan_kendaraan SET ket = ?, tanggal = ? WHERE id = ?`, 
          [
            maintenanceForm.ket,
            maintenanceForm.tanggal,
            maintenanceId,
          ])

          return true;
      } catch (error) {
        console.error("CarMaintenanceRepository.update error:", error);

        throw new Err("failed to update maintenance", 500);
      }
  }

  async delete(maintenanceId: BaseCarMaintenance["id"]): Promise<boolean> {
      try {
        await pool.query(`DELETE FROM perawatan_kendaraan WHERE id = ?`, [maintenanceId]);

        return true;
      } catch (error) {
        console.error("CarMaintenanceRepository.delete error:", error);

        throw new Err("failed to delete maintenance", 500);
      }
  }

  async deleteByCarId(carId: BaseCar["id"], conn: Connection): Promise<boolean> {
      try {
        await conn.query("DELETE FROM perawatan_kendaraan WHERE id_kendaraan = ?", [carId]);

        return true
      } catch (error) {
        console.error("CarMaintenanceRepository.delteByCarId error:", error);

        throw new Err("failed to delete car maintenance by car id", 500);
      }
  }
}
