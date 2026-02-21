import { Connection } from "mysql2/promise";
import { BaseDivision, DivisionForm, DivisionTable } from "./division.schema";

export interface IDivisionRepository {
  getAll(): Promise<DivisionTable[]>
  create(data: DivisionForm, conn: Connection): Promise<boolean>
  update(data: BaseDivision, conn: Connection): Promise<boolean>
  delete(id: string, conn: Connection): Promise<boolean>
}