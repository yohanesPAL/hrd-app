import { formatDateYYYYMMDD } from "@/utils/dateFormatting";
import ExcelJS from "exceljs";
import {
  BaseJamAbsen,
  JamAbsenDivisi,
} from "../master/jamAbsen/jamAbsen.schema";
import { AbsensiTable, AbsensiTableSchema } from "./absensi.schema";
import {
  AbsensiDetailTable,
  AbsensiDetailTableSchema,
  ExcelRowData,
  RawExcelRowData,
} from "./detail/absensi.detail.schema";
import { Err } from "@/lib/err";

const parseTimeStringToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export type JamAbsen = Omit<BaseJamAbsen, "id" | "divisi">;

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

  static extractWorksheetRow(worksheet: ExcelJS.Worksheet): {
    rows: RawExcelRowData[];
    employeesAbsentCodes: Map<string, boolean>;
  } {
    const rows: RawExcelRowData[] = [],
      employeesAbsentCodes = new Map<string, boolean>();

    for (const [rowNumber, row] of worksheet
      .getRows(1, worksheet.rowCount)!
      .entries()) {
      if (rowNumber === 0) continue;

      const kodeAbsen: string = row.getCell(1).value as string;
      const namaKaryawan: string = row.getCell(4).value as string;
      const tanggal: string = row.getCell(6).value as string;
      const absent: boolean = (row.getCell(16).value as string) === "True";
      const scanMasuk: string = row.getCell(10).value as string;
      const scanKeluar: string = row.getCell(11).value as string;

      if (!employeesAbsentCodes.has(kodeAbsen)) {
        employeesAbsentCodes.set(kodeAbsen, true);
      }

      rows.push({
        kode_absen: kodeAbsen,
        nama_absen: namaKaryawan,
        tanggal: tanggal,
        absent: absent,
        scan_masuk: scanMasuk,
        scan_keluar: scanKeluar,
      });
    }

    return { rows: rows, employeesAbsentCodes: employeesAbsentCodes };
  }

  static toExcelRowData(
    divCodeMap: Map<string, string>,
    jamAbsenMap: Map<string, JamAbsen>,
    RawExcelRows: RawExcelRowData[],
  ): ExcelRowData[] {
    return RawExcelRows.map((item) => {
      const kodeDiv = divCodeMap.get(item.kode_absen);
      if (!kodeDiv)
        throw new Err("divisi untuk kode absen tidak ditemukan", 400);

      const jamAbsen = jamAbsenMap.get(kodeDiv);
      if (!jamAbsen)
        throw new Err("jam absen untuk divisi tidak ditemukan", 400);

      const scanMasukMinutes: number = parseTimeStringToMinutes(
        item.scan_masuk!,
      );
      const scanKeluarMinutes: number = parseTimeStringToMinutes(
        item.scan_keluar!,
      );

      const isSabtu = new Date(item.tanggal!).getDay() === 6;
      const jamMasuk = jamAbsen.masuk;
      const jamKeluar = isSabtu ? jamAbsen.keluar_sabtu : jamAbsen.keluar;
      const keterlambatan = Math.max(0, scanMasukMinutes - jamMasuk);
      const lembur: number = Math.max(0, scanKeluarMinutes - jamKeluar);
      const totalJamKerja: number = item.scan_masuk
        ? item.scan_keluar
          ? scanKeluarMinutes - jamMasuk
          : jamKeluar - jamMasuk
        : 0;
      const tglParts: string[] = item.tanggal!.split("/");
      const formattedTgl: string = `${tglParts[2]}-${tglParts[0].padStart(2, "0")}-${tglParts[1].padStart(2, "0")}`;

      return {
        kode_absen: item.kode_absen,
        nama_absen: item.nama_absen,
        divisi: kodeDiv,
        tanggal: formattedTgl,
        absent: item.absent,
        scan_masuk: item.scan_masuk,
        scan_keluar: item.scan_keluar,
        terlambat: keterlambatan <= 2 ? 0 : keterlambatan,
        lembur: lembur,
        jam_kerja: totalJamKerja,
      };
    });
  }
}
