import { Connection } from "mysql2/promise";
import { BasePosition, PositionForm, PositionTable } from "./jabatan.schema";

export interface IPositionRepository {
  getAll(): Promise<PositionTable[]>;
  create(data: PositionForm, conn: Connection): Promise<boolean>;
  update(data: BasePosition, conn: Connection): Promise<boolean>;
  delete(id: string, conn: Connection): Promise<boolean>;
}
