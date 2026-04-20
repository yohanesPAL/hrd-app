import { CarMaintenanceRepository } from "./car.maintenance.repository";
import { CarMaintenanceService } from "./car.maintenance.service";

export const carMaintenanceService = new CarMaintenanceService(new CarMaintenanceRepository);