"use server";
import { withAuth } from "@/lib/withAuth";
import { EmployeeContractForm } from "@/modules/employee/contract/employee.contract.schema";
import { createEmployeeService } from "@/modules/employee/employee.factory";
import {
  BaseEmployee,
  EmployeeForm,
  EmployeeKodeAbsenForm,
  EmployeeSpForm,
  EmployeeUpdate,
} from "@/modules/employee/employee.schema";
import { createCreateEmployeeService } from "@/use-cases/employee/createEmployee";
import { createDeleteEmployeeService } from "@/use-cases/employee/deleteEmployee";
import { createGetEmployeeFormOptions } from "@/use-cases/employee/getEmployeeFormOptions";
import { revalidatePath } from "next/cache";

const employeeService = createEmployeeService();
const employeeFormOptions = createGetEmployeeFormOptions();
const deleteEmployee = createDeleteEmployeeService();
const createEmployee = createCreateEmployeeService();
const PATH = "karyawan";

export const getAllKaryawan = withAuth(async () => {
  return await employeeService.getAllEmployees();
});

export const getKaryawanById = withAuth(async (session, id: BaseEmployee["id"]) => {
  return await employeeService.getEmployeeById(id);
});

export const getKaryawanForUpdate = withAuth(async (session, id: BaseEmployee["id"]) => {
  return await employeeService.getEmployeeForUpdate(id);
});

export const getKaryawanFormOptions = withAuth(async () => {
  return await employeeFormOptions.execute();
}, ["hrd"]);

export const createKaryawan = withAuth(
  async (session, employee: EmployeeForm, contract: EmployeeContractForm) => {
    await createEmployee.execute(employee, contract);
  },
  ["hrd"],
);

export const updateKaryawan = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeUpdate) => {
    await employeeService.updateEmployee(id, data);
  },
  ["hrd"],
);

export const updateKaryawanSP = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeSpForm) => {
    await employeeService.updateEmployeeSP(id, data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateKaryawanKodeAbsen = withAuth(
  async (session, id: BaseEmployee["id"], data: EmployeeKodeAbsenForm) => {
    await employeeService.updateEmployeeKodeAbsen(id, data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteKaryawan = withAuth(
  async (session, id: string) => {
    await deleteEmployee.execute(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
