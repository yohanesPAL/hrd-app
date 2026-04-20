import { CarRepository } from "./car.repository";
import { CarService } from "./car.service";

export const carService = new CarService(new CarRepository);