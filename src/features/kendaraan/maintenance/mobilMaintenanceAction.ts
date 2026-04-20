import { withAuth } from "@/lib/withAuth";
import { BaseCar } from "@/modules/car/car.schema";
import { carMaintenanceService } from "@/modules/car/maintenance/car.maintenance.factory";

export const getCarMaintenanceByCarIdAction = withAuth(async(session, carId: BaseCar["id"]) => {
  return await carMaintenanceService.getMaintenanceByCarId(carId);
})