"use server"
import { withAuth } from "@/lib/withAuth";
import { BaseCar } from "@/modules/car/car.schema";
import { carMaintenanceService } from "@/modules/car/maintenance/car.maintenance.factory";
import {
  BaseCarMaintenance,
  CarMaintenanceForm,
} from "@/modules/car/maintenance/car.maintenance.schema";
import { revalidatePath } from "next/cache";

const PATH = "kendaraan"

export const getCarMaintenanceByCarIdAction = withAuth(
  async (_, carId: BaseCar["id"]) => {
    return await carMaintenanceService.getMaintenanceByCarId(carId);
  },
);

export const createCarMaintenanceAction = withAuth(
  async (session, maintenanceForm: CarMaintenanceForm) => {
    await carMaintenanceService.createMaintenance(maintenanceForm);
    revalidatePath(`/${session.user.role}/${PATH}`)
  },
);

export const updateCarMaintenanceAction = withAuth(
  async (
    session,
    maintenanceForm: CarMaintenanceForm,
    maintenanceId: BaseCarMaintenance["id"],
  ) => {
    await carMaintenanceService.updateMaintenance(
      maintenanceForm,
      maintenanceId,
    );
    revalidatePath(`/${session.user.role}/${PATH}`)
  },
);

export const deleteCarMaintenanceAction = withAuth(async(session, carMaintenanceId: BaseCarMaintenance["id"]) => {
  await carMaintenanceService.deleteMaintenance(carMaintenanceId);
  revalidatePath(`/${session.user.role}/${PATH}`)
})