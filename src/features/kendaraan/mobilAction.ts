"use server"
import { withAuth } from "@/lib/withAuth";
import { carService } from "@/modules/car/car.factory";
import { BaseCar, CarForm } from "@/modules/car/car.schema";
import { deleteCarAndMaintenance } from "@/use-cases/car/deleteCarAndMaintenance";

export const getAllCarsAction = withAuth(async () => {
  return await carService.getAllCars();
});

export const getCarByIdAction = withAuth(async(session, Carid: BaseCar["id"]) => {
  return await carService.getCarById(Carid);
})

export const createCarAction = withAuth(async (session, carForm: CarForm) => {
  await carService.createCar(carForm);
});

export const updateCarAction = withAuth(
  async (session, carForm: CarForm, carId: BaseCar["id"]) => {
    await carService.updateCar(carForm, carId);
  },
);

export const deleteCarAndMaintenanceAction = withAuth(
  async (session, carId: BaseCar["id"]) => {
    await deleteCarAndMaintenance.execute(carId);
  },
);
