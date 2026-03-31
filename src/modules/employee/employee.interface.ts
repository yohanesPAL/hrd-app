import { Connection } from "mysql2/promise";
import {
  BaseEmployee,
  EmployeeAbsentDiv,
  EmployeeForm,
  EmployeeKodeAbsenForm,
  EmployeeSpForm,
  EmployeeTable,
  EmployeeUpdate,
  OpenEmployee,
} from "./employee.schema";
import { ServiceRes } from "@/types/ServiceTypes";
import { UserId } from "../user/user.schema";

export interface IEmployeeRepository {
  getAll(): Promise<EmployeeTable[]>;
  getById(id: BaseEmployee["id"]): Promise<BaseEmployee>;
  getForUpdateById(id: BaseEmployee["id"]): Promise<EmployeeUpdate>;
  getDivisionCode(absentCodes: string[]): Promise<EmployeeAbsentDiv[]>;
  getUnaccountedEmployees(selectedId?: UserId): Promise<OpenEmployee[]>;
  create(data: EmployeeForm, conn: Connection): Promise<string>;
  delete(id: string, conn: Connection): Promise<boolean>;
  update(id: string, data: EmployeeUpdate): Promise<boolean>;
}

export interface IEmployeeService {
  getAllEmployees(): Promise<ServiceRes>;
  getEmployeeById(id: BaseEmployee["id"]): Promise<ServiceRes>;
  getEmployeeForUpdate(id: BaseEmployee["id"]): Promise<ServiceRes>;
  getEmployeeAbsentDivCode(absentCode: string[]): Promise<ServiceRes>;
  getUnaccountedEmployees(selectedId?: UserId): Promise<ServiceRes>;
  createEmployee(data: EmployeeForm, conn: Connection): Promise<ServiceRes>;
  deleteEmployee(id: string, conn: Connection): Promise<ServiceRes>;
  updateEmployee(
    id: BaseEmployee["id"],
    data: EmployeeUpdate,
  ): Promise<ServiceRes>;
  updateEmployeeSP(
    id: BaseEmployee["id"],
    data: EmployeeSpForm,
  ): Promise<ServiceRes>;
  updateEmployeeKodeAbsen(
    id: BaseEmployee["id"],
    data: EmployeeKodeAbsenForm,
  ): Promise<ServiceRes>;
}
