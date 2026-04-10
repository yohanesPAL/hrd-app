import { Connection } from "mysql2/promise";
import { BaseEmployee } from "../employee.schema";
import { EmployeeContractTable, EmployeeContractForm, EmployeeContractExpiration } from "./employee.contract.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IEmployeeContractRepository {
  getByKaryawanId(karyawanId: BaseEmployee["id"]): Promise<EmployeeContractTable[]>;
  getNearExpiration(daysBefore: number): Promise<EmployeeContractExpiration[]>;
  create(data: EmployeeContractForm, conn: Connection): Promise<boolean>;
  update(id: BaseEmployee["id"], data: EmployeeContractForm): Promise<boolean>;
  delete(id: BaseEmployee["id"]): Promise<boolean>;
  deleteByKaryawanId(karyawanId: BaseEmployee["id"], conn: Connection): Promise<boolean>;
}

export interface IEmployeeContractService {
  getContractByKaryawanId(karyawanId: BaseEmployee["id"]): Promise<ServiceRes<EmployeeContractTable[]>>;
  getContractNearExpiration(daysBefore: number): Promise<ServiceRes<EmployeeContractExpiration[]>>;
  createContract(data: EmployeeContractForm, conn: Connection): Promise<ServiceRes>;
  updateContract(id: BaseEmployee["id"], data: EmployeeContractForm): Promise<ServiceRes>;
  deleteContract(id: BaseEmployee["id"]): Promise<ServiceRes>;
  deleteContractByKaryawanId(karyawanId: BaseEmployee["id"], conn: Connection): Promise<ServiceRes>;
}