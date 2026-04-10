import { Connection } from "mysql2/promise";
import { AbsensiTable } from "./absensi.schema";
import { ServiceRes } from "@/types/ServiceTypes";
import { AbsensiDetailTable, KodeAbsen } from "./detail/absensi.detail.schema";

export interface IAbsensiRepository {
  getAll(): Promise<AbsensiTable[]>;
  create(conn: Connection): Promise<boolean>;
  truncate(): Promise<boolean>;
}

export interface IAbsenService {
  getAllAbsensi(): Promise<ServiceRes<AbsensiTable[]>>;
  getAbsensiByKodeAbsen(kodeAbsen: KodeAbsen): Promise<ServiceRes<AbsensiDetailTable[]>>;
  importAbsen(file: File): Promise<ServiceRes>;
  truncateAbsen(): Promise<ServiceRes>;
}