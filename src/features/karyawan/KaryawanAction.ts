"use server";
import { withAuth } from "@/lib/withAuth";
import { EmployeeContractForm } from "@/modules/employee/contract/employee.contract.schema";
import { employeeService } from "@/modules/employee/employee.factory";
import {
  BaseEmployee,
  EmployeeForm,
  EmployeeKodeAbsenForm,
  EmployeeSpForm,
  EmployeeUpdate,
} from "@/modules/employee/employee.schema";
import { createEmployeeWithContract } from "@/use-cases/employee/createEmployeeWithContract";
import { deleteEmployeeAndUser } from "@/use-cases/employee/deleteEmployeeAndUser";
import { getEmployeeFormOptions } from "@/use-cases/employee/getEmployeeFormOptions";
import { revalidatePath } from "next/cache";

const PATH = "karyawan";

export const getAllKaryawanAction = withAuth(async () => {
  return await employeeService.getAllEmployees();
});

export const getKaryawanByIdAction = withAuth(async (session, id: BaseEmployee["id"]) => {
  return await employeeService.getEmployeeById(id);
});

export const getKaryawanForUpdateAction = withAuth(async (session, id: BaseEmployee["id"]) => {
  return await employeeService.getEmployeeForUpdate(id);
});

export const getKaryawanFormOptionsAction = withAuth(async () => {
  return await getEmployeeFormOptions.execute();
}, ["hrd"]);

export const createKaryawanAction = withAuth(
  async (session, employee: EmployeeForm, contract: EmployeeContractForm) => {
    await createEmployeeWithContract.execute(employee, contract);
  },
  ["hrd"],
);

export const updateKaryawanAction = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeUpdate) => {
    await employeeService.updateEmployee(id, data);
  },
  ["hrd"],
);

export const updateKaryawanSpAction = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeSpForm) => {
    await employeeService.updateEmployeeSP(id, data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateKaryawanKodeAbsenAction = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeKodeAbsenForm) => {
    await employeeService.updateEmployeeKodeAbsen(id, data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteKaryawanAction = withAuth(
  async (session, id: string) => {
    await deleteEmployeeAndUser.execute(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
