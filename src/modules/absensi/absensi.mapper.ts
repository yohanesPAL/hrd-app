import { formatDateYYYYMMDD } from "@/utils/dateFormatting";
import {
  BaseJamAbsen,
  JamAbsenDivisi,
} from "../master/jamAbsen/jamAbsen.schema";
import { AbsensiTable, AbsensiTableSchema } from "./absensi.schema";
import { AbsensiDetailTable, AbsensiDetailTableSchema } from "./detail/absensi.detail.schema";

type JamAbsen = Omit<BaseJamAbsen, "id" | "divisi">;

export class AbsensiMapper {
  static toAbsensiTable(dbRows: any[]): AbsensiTable[] {
    return AbsensiTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      })),
    );
  }

  static toAbsensiDetailTable(dbRows: any[]): AbsensiDetailTable[] {
    return AbsensiDetailTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
        tanggal: formatDateYYYYMMDD(item.tanggal),
      })),
    );
  }

  static toJamAbsenDivisiMap(dbRows: JamAbsenDivisi[]): Map<string, JamAbsen> {
    const jamAbsenDivisiMap = new Map<string, JamAbsen>();
    dbRows.forEach((item) =>
      jamAbsenDivisiMap.set(item.divisi, {
        masuk: item.masuk,
        keluar: item.keluar,
        keluar_sabtu: item.keluar_sabtu,
      }),
    );
    return jamAbsenDivisiMap;
  }
}
