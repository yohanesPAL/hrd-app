import { Connection } from "mysql2/promise";
import { ActivePosition, BasePosition, PositionForm, PositionTable } from "./jabatan.schema";

export interface IPositionRepository {
  getAll(): Promise<PositionTable[]>;
  getActive(): Promise<ActivePosition[]>
  create(data: PositionForm, conn: Connection): Promise<boolean>;
  update(data: BasePosition, conn: Connection): Promise<boolean>;
  delete(id: string, conn: Connection): Promise<boolean>;
}
