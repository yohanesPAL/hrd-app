import { Connection } from "mysql2/promise";
import { JamAbsenDivisi, JamAbsenForm, JamAbsenFormDB, JamAbsenTable, RawJamAbsen } from "./jamAbsen.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IJamAbsenRepository {
  getAll(): Promise<JamAbsenTable[]>;
  getByDivisi(): Promise<JamAbsenDivisi[]>;
  update(data: JamAbsenFormDB, conn: Connection): Promise<boolean>;
  reset(id: string, conn: Connection): Promise<boolean>;
}

export interface IJamAbsenService {
  getAllJamAbsen(): Promise<ServiceRes<JamAbsenTable[]>>;
  getJamAbsenDivisi(): Promise<ServiceRes<JamAbsenDivisi[]>>;
  updateJamAbsen(data: JamAbsenForm, conn: Connection): Promise<ServiceRes>;
  resetJamAbsen(id: string, conn: Connection): Promise<ServiceRes>;
}