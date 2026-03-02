import { Connection } from "mysql2/promise";
import {
  BaseEmployee,
  EmployeeAbsentDiv,
  EmployeeForm,
  EmployeeTable,
  EmployeeUpdate,
} from "./employee.schema";

export interface IEmployeeRepository {
  getAll(): Promise<EmployeeTable[]>;
  getById(id: BaseEmployee["id"]): Promise<BaseEmployee>;
  getForUpdateById(id: BaseEmployee["id"]): Promise<EmployeeUpdate>;
  getDivisionCode(absentCodes: string[]): Promise<EmployeeAbsentDiv[]>;
  create(data: EmployeeForm, conn: Connection): Promise<boolean>;
  delete(id: string, conn: Connection): Promise<boolean>;
  update(id:string, data: EmployeeUpdate, conn: Connection): Promise<boolean>;
}
