import { ServiceRes } from "@/types/ServiceTypes";
import { BaseCar, CarForm, CarTable } from "./car.schema";
import { Connection } from "mysql2/promise";

export interface ICarRepository {
  getAll(): Promise<CarTable[]>;
  getById(carId: BaseCar["id"]): Promise<CarForm>;
  create(carForm: CarForm): Promise<boolean>;
  update(carForm: CarForm, carId: BaseCar["id"]): Promise<boolean>;
  delete(carId: BaseCar["id"], conn: Connection): Promise<boolean>;
}

export interface ICarService {
  getAllCars(): Promise<ServiceRes<CarTable[]>>;
  getCarById(carId: BaseCar["id"]): Promise<ServiceRes<CarForm>>;
  createCar(carForm: CarForm): Promise<ServiceRes>;
  updateCar(carForm: CarForm, carId: BaseCar["id"]): Promise<ServiceRes>;
  deleteCar(carId: BaseCar["id"], conn: Connection): Promise<ServiceRes>;
}