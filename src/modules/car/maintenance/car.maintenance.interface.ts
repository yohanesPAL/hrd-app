import { ServiceRes } from "@/types/ServiceTypes";
import { BaseCar } from "../car.schema";
import { BaseCarMaintenance, CarMaintenanceForm, CarMaintenanceTable } from "./car.maintenance.schema";
import { Connection } from "mysql2/promise";

export interface ICarMaintenanceRepository {
  getByCarId(carId: BaseCar["id"]): Promise<CarMaintenanceTable[]>;
  create(maintenanceForm: CarMaintenanceForm): Promise<boolean>;
  update(maintenanceForm: CarMaintenanceForm, maintenanceId: BaseCarMaintenance["id"]): Promise<boolean>;
  delete(maintenanceId: BaseCarMaintenance["id"]): Promise<boolean>;
  deleteByCarId(carId: BaseCar["id"], conn: Connection): Promise<boolean>;
}

export interface ICarMaintenanceService {
  getMaintenanceByCarId(carId: BaseCar["id"]): Promise<ServiceRes<CarMaintenanceTable[]>>;
  createMaintenance(maintenanceForm: CarMaintenanceForm): Promise<ServiceRes>;
  updateMaintenance(maintenanceForm: CarMaintenanceForm, maintenanceId: BaseCarMaintenance["id"]): Promise<ServiceRes>;
  deleteMaintenance(maintenanceId: BaseCarMaintenance["id"]): Promise<ServiceRes>;
  deleteMaintenanceByCarId(carId: BaseCar["id"], conn: Connection): Promise<ServiceRes>;
}