import { Connection } from "mysql2/promise";
import { BaseEmployee } from "../employee.schema";
import { EmployeeContractTable, EmployeeContractForm } from "./employee.contract.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IEmployeeContractRepository {
  getByKaryawanId(karyawanId: BaseEmployee["id"]): Promise<EmployeeContractTable[]>;
  create(data: EmployeeContractForm, conn: Connection): Promise<boolean>;
  update(id: BaseEmployee["id"], data: EmployeeContractForm): Promise<boolean>;
  delete(id: BaseEmployee["id"]): Promise<boolean>;
}

export interface IEmployeeContractService {
  getContractByKaryawanId(karyawanId: BaseEmployee["id"]): Promise<ServiceRes>;
  createContract(data: EmployeeContractForm, conn: Connection): Promise<ServiceRes>;
  updateContract(id: BaseEmployee["id"], data: EmployeeContractForm): Promise<ServiceRes>;
  deleteContract(id: BaseEmployee["id"]): Promise<ServiceRes>;
}