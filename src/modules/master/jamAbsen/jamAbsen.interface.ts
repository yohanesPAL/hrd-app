import { Connection } from "mysql2/promise";
import { JamAbsenFormDB, RawJamAbsen } from "./jamAbsen.schema";

export interface IJamAbsenRepository {
  getAll(): Promise<RawJamAbsen[]>
  update(data: JamAbsenFormDB, conn: Connection): Promise<boolean>
  reset(id: string, conn: Connection): Promise<boolean>
}