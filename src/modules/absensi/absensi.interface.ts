import { Connection } from "mysql2/promise";
import { AbsensiTable } from "./absensi.schema";

export interface IAbsensiRepository {
  getAll(): Promise<AbsensiTable[]>;
  create(conn: Connection): Promise<boolean>;
  truncate(): Promise<boolean>;
}