import { Connection } from "mysql2/promise";
import { AbsensiDetailTable, ExcelRowData, KodeAbsen } from "./absensi.detail.schema";

export interface IAbsensiDetailRepository {
  getByKodeAbsen(kodeAbsen: KodeAbsen): Promise<AbsensiDetailTable[]>
  create(data: ExcelRowData[], conn: Connection): Promise<boolean>;
  truncate(): Promise<boolean>;
}