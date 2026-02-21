"use server";
import { createDivisionService } from "@/modules/divisi/division.factory";
import { BaseDivision, DivisionForm } from "@/modules/divisi/division.schema";

const divisionService = createDivisionService();

export async function createDivisionAction(data: DivisionForm) {
  await divisionService.createDivision(data);
}

export async function updateDivisionAction(data: BaseDivision) {
  await divisionService.updateDivision(data);
}

export async function deleteDivisionAction(id: string) {
  await divisionService.deleteDivision(id);
}