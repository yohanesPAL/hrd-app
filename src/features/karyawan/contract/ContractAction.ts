"use server";
import { withAuth } from "@/lib/withAuth";
import { createEmployeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractForm } from "@/modules/employee/contract/employee.contract.schema";
import { BaseEmployee } from "@/modules/employee/employee.schema";
import { revalidatePath } from "next/cache";

const contractService = createEmployeeContractService();
const PATH = "profile"

export const getKaryawanContractAction = withAuth(async (session, id: BaseEmployee["id"]) => {
  return await contractService.getContractByKaryawanId(id);
})

export const createKaryawanContractAction = withAuth(async (session, data: EmployeeContractForm) => {
  await contractService.createContract(data);
  revalidatePath(`/${session.user.role}/${PATH}`);
})

export const deleteKaryawanContractAction = withAuth(async (session, id: BaseEmployee["id"]) => {
  await contractService.deleteContract(id);
  revalidatePath(`/${session.user.role}/${PATH}`);
})

export const updateKaryawanContractAction = withAuth(async (session, id: BaseEmployee["id"], data: EmployeeContractForm) => {
  await contractService.updateContract(id, data);
  revalidatePath(`/${session.user.role}/${PATH}`);
})