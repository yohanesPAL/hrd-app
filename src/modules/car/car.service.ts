import { ServiceRes } from "@/types/ServiceTypes";
import { ICarService } from "./car.interface";
import {
  BaseCar,
  CarForm,
  CarFormSchema,
  CarIdSchema,
  CarTable,
} from "./car.schema";
import { CarRepository } from "./car.repository";
import { Err } from "@/lib/err";
import { Connection } from "mysql2/promise";

export class CarService implements ICarService {
  constructor(private carRepository: CarRepository) {}

  async getAllCars(): Promise<ServiceRes<CarTable[]>> {
    try {
      const res = await this.carRepository.getAll();

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error("CarService.getAllCars error:", error);

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }

  async getCarById(carId: BaseCar["id"]): Promise<ServiceRes<CarForm>> {
      try {
        const validatedCarId = CarIdSchema.parse(carId);

        const res = await this.carRepository.getById(validatedCarId);

        return {success: true, status: 200, data: res};
      } catch (error) {
        console.error("CarService.getCarById error:", error);

        if(error instanceof Err) throw error;

        throw new Err("internal server error", 500)
      }
  }

  async createCar(carForm: CarForm): Promise<ServiceRes> {
    try {
      const validatedForm = CarFormSchema.parse(carForm);

      await this.carRepository.create(validatedForm);

      return { success: true, status: 201 };
    } catch (error) {
      console.error("CarService.createCar error:", error);

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }

  async updateCar(carForm: CarForm, carId: BaseCar["id"]): Promise<ServiceRes> {
    try {
      const validatedForm = CarFormSchema.parse(carForm);
      const validatedId = CarIdSchema.parse(carId);

      await this.carRepository.update(validatedForm, validatedId);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("CarService.updateCar error:", error);

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }

  async deleteCar(carId: BaseCar["id"], conn: Connection): Promise<ServiceRes> {
    try {
      const validatedId = CarIdSchema.parse(carId);

      await this.carRepository.delete(validatedId, conn);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("CarService.deleteCar error:", error);

      if(error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }
}
