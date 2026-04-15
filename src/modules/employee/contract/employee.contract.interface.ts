import { Connection } from "mysql2/promise";
import { BaseEmployee } from "../employee.schema";
import {
  EmployeeContractTable,
  EmployeeContractForm,
  EmployeeContractExpiration,
  BaseEmployeeContract,
} from "./employee.contract.schema";
import { ServiceRes } from "@/types/ServiceTypes";
import { NotificationForm } from "@/modules/notification/notification.schema";

export interface IEmployeeContractRepository {
  getByKaryawanId(
    karyawanId: BaseEmployee["id"],
  ): Promise<EmployeeContractTable[]>;
  getNearExpiration(): Promise<EmployeeContractExpiration[]>;
  create(data: EmployeeContractForm, conn: Connection): Promise<boolean>;
  update(id: BaseEmployee["id"], data: EmployeeContractForm): Promise<boolean>;
  delete(id: BaseEmployee["id"]): Promise<boolean>;
  deleteByKaryawanId(
    karyawanId: BaseEmployee["id"],
    conn: Connection,
  ): Promise<boolean>;
  update7d(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<boolean>;
  update3d(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<boolean>;
  updateToday(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<boolean>;
}

export interface IEmployeeContractService {
  getContractByKaryawanId(
    karyawanId: BaseEmployee["id"],
  ): Promise<ServiceRes<EmployeeContractTable[]>>;
  getContractNearExpiration(): Promise<
    ServiceRes<{
      form: NotificationForm[];
      day7: string[];
      day3: string[];
      today: string[];
    }>
  >;
  createContract(
    data: EmployeeContractForm,
    conn: Connection,
  ): Promise<ServiceRes>;
  updateContract(
    id: BaseEmployee["id"],
    data: EmployeeContractForm,
  ): Promise<ServiceRes>;
  deleteContract(id: BaseEmployee["id"]): Promise<ServiceRes>;
  deleteContractByKaryawanId(
    karyawanId: BaseEmployee["id"],
    conn: Connection,
  ): Promise<ServiceRes>;
  updateNotified7d(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<ServiceRes>;
  updateNotified3d(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<ServiceRes>;
  updateNotifiedToday(
    contractIds: BaseEmployeeContract["id"][],
    conn: Connection,
  ): Promise<ServiceRes>;
}
