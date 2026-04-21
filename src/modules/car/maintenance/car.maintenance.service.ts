import { ServiceRes } from "@/types/ServiceTypes";
import { BaseCar, CarIdSchema } from "../car.schema";
import { ICarMaintenanceService } from "./car.maintenance.interface";
import {
  BaseCarMaintenance,
  CarMaintenanceForm,
  CarMaintenanceFormSchema,
  CarMaintenanceIdSchema,
  CarMaintenanceTable,
} from "./car.maintenance.schema";
import { CarMaintenanceRepository } from "./car.maintenance.repository";
import { Err } from "@/lib/err";
import { ZodError } from "zod";
import { Connection } from "mysql2/promise";

export class CarMaintenanceService implements ICarMaintenanceService {
  constructor(private carMaintenanceRepository: CarMaintenanceRepository) {}

  async getMaintenanceByCarId(
    carId: BaseCar["id"],
  ): Promise<ServiceRes<CarMaintenanceTable[]>> {
    try {
      const validatedId = CarIdSchema.parse(carId);

      const res = await this.carMaintenanceRepository.getByCarId(validatedId);

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error(
        "CarMaintenanceService.getMaintenanceByCarId error:",
        error,
      );

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("internal server error", 500);
    }
  }

  async createMaintenance(
    maintenanceForm: CarMaintenanceForm,
  ): Promise<ServiceRes> {
    try {
      const validatedForm = CarMaintenanceFormSchema.parse(maintenanceForm);

      await this.carMaintenanceRepository.create(validatedForm);

      return { success: true, status: 201 };
    } catch (error) {
      console.error("CarMaintenanceService.createMaintenance error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("internal server error", 500);
    }
  }

  async updateMaintenance(
    maintenanceForm: CarMaintenanceForm,
    maintenanceId: BaseCarMaintenance["id"],
  ): Promise<ServiceRes> {
    try {
      const validatedForm = CarMaintenanceFormSchema.parse(maintenanceForm);
      const validatedId = CarMaintenanceIdSchema.parse(maintenanceId);

      await this.carMaintenanceRepository.update(validatedForm, validatedId);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("CarMaintenanceService.updateMaintenance error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("internal server error", 500);
    }
  }

  async deleteMaintenance(
    maintenanceId: BaseCarMaintenance["id"],
  ): Promise<ServiceRes> {
    try {
      const validatedId = CarMaintenanceIdSchema.parse(maintenanceId);

      await this.carMaintenanceRepository.delete(validatedId);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("CarMaintenanceService.deleteMaintenance error:", error);

      if (error instanceof Err) throw error;
      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      throw new Err("internal server error", 500);
    }
  }

  async deleteMaintenanceByCarId(
    carId: BaseCar["id"],
    conn: Connection,
  ): Promise<ServiceRes> {
    try {
      await this.carMaintenanceRepository.deleteByCarId(carId, conn);

      return { success: true, status: 200 };
    } catch (error) {
      console.log(
        "CarMaintenanceService.deleteMaintenanceByCarId error:",
        error,
      );

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }
}
