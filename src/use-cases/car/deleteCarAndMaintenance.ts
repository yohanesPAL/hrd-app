import pool from "@/lib/db";
import { Err } from "@/lib/err";
import { carService } from "@/modules/car/car.factory";
import { BaseCar, CarIdSchema } from "@/modules/car/car.schema";
import { CarService } from "@/modules/car/car.service";
import { carMaintenanceService } from "@/modules/car/maintenance/car.maintenance.factory";
import { CarMaintenanceService } from "@/modules/car/maintenance/car.maintenance.service";
import { ServiceRes } from "@/types/ServiceTypes";

class DeleteCarAndMaintenance {
  constructor (
    private carService: CarService,
    private carMaintenanceService: CarMaintenanceService,
  ){}

  async execute(CarId: BaseCar["id"]): Promise<ServiceRes> {
    let conn;
    try {
      const validatedId = CarIdSchema.parse(CarId);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      await this.carService.deleteCar(validatedId, conn);
      await this.carMaintenanceService.deleteMaintenanceByCarId(validatedId, conn);

      await conn.commit();

      return {success: true, status: 200}
    } catch (error) {
      console.error("DeleteCarAndMaintenance error:", error);

      if(error instanceof Err) throw error;

      throw new Err("internal server error", 500, error);
    }
  }
}

export const deleteCarAndMaintenance = new DeleteCarAndMaintenance(carService, carMaintenanceService)