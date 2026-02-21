import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { ServerFetch } from "@/utils/ServerFetch";

type RowData = {
  absen_id: string;
  nama_absen: string;
  divisi_id: string;
  tanggal: string;
  scan_masuk: string;
  scan_keluar: string;
  terlambat: number;
  absent: boolean;
  lembur: number;
  jam_kerja: number;
};

type absenRes = {
  kode_divisi: string;
  masuk: number;
  keluar: number;
  keluar_sabtu: number;
};

type absenMapValue = Omit<absenRes, "kode_divisi">;

const parseTimeStringToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const getKaryawanDiv = async (kodeAbensi: string): Promise<string> => {
  const res = await ServerFetch({
    uri: `/absen/karyawan/${kodeAbensi}`,
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("absen") as File;

  if (!file)
    return NextResponse.json(
      { error: "File tidak boleh kosong" },
      { status: 400 },
    );

  const absenMap = new Map<string, absenMapValue>();
  try {
    const res = await ServerFetch({ uri: `/absen-divisi` });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Request failed");
    }

    data.forEach((item: absenRes) => {
      const value: absenMapValue = {
        masuk: item.masuk,
        keluar: item.keluar,
        keluar_sabtu: item.keluar_sabtu,
      };
      absenMap.set(item.kode_divisi, value);
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const arrayBuffer = await file.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];

  const rows: RowData[] = [];

  const karyawanMap = new Map<string, string>();
  for (const [rowNumber, row] of worksheet
    .getRows(1, worksheet.rowCount)!
    .entries()) {
    if (rowNumber === 0) continue;

    const kodeAbsen: string = row.getCell(1).value as string;
    const namaKaryawan: string = row.getCell(4).value as string;
    const tanggal: string = row.getCell(6).value as string;
    const absent: boolean = (row.getCell(16).value as string) === "True";
    const scanMasuk: string = row.getCell(10).value as string;
    const scanMasukMinutes: number = parseTimeStringToMinutes(scanMasuk);
    const scanKeluar: string = row.getCell(11).value as string;
    const scanKeluarMinutes: number = parseTimeStringToMinutes(scanKeluar);

    if (!karyawanMap.has(kodeAbsen)) {
      try {
        const res = await getKaryawanDiv(kodeAbsen);
        karyawanMap.set(kodeAbsen, res);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    const jamAbsen: absenMapValue | undefined = absenMap.get(
      karyawanMap.get(kodeAbsen)!,
    );
    if (!jamAbsen) {
      return NextResponse.json(
        { error: "jam absen divisi tidak ditemukan" },
        { status: 404 },
      );
    }

    const isSabtu: boolean = new Date(tanggal).getDay() === 6;
    const jamMasuk = jamAbsen.masuk;
    const jamKeluar = isSabtu ? jamAbsen.keluar_sabtu : jamAbsen.keluar;
    const keterlambatan: number = Math.max(0, scanMasukMinutes - jamMasuk);
    const lembur: number = Math.max(0, scanKeluarMinutes - jamKeluar);
    const totalJamKerja: number = scanMasuk
      ? scanKeluar
        ? scanKeluarMinutes - jamMasuk
        : jamKeluar - jamMasuk
      : 0;
    const tglParts: string[] = tanggal.split("/");
    const formattedTgl: string = `${tglParts[2]}-${tglParts[0].padStart(2, "0")}-${tglParts[1].padStart(2, "0")}`;

    rows.push({
      absen_id: kodeAbsen,
      nama_absen: namaKaryawan,
      divisi_id: karyawanMap.get(kodeAbsen)!,
      tanggal: formattedTgl,
      scan_masuk: scanMasuk,
      scan_keluar: scanKeluar,
      terlambat: keterlambatan <= 2 ? 0 : keterlambatan,
      lembur: lembur,
      absent: absent,
      jam_kerja: totalJamKerja,
    });
  }

  const res = await ServerFetch({
    uri: `/absen`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    },
  });

  const data = await res.json();

  return NextResponse.json(data, {status: res.status});
}

export async function DELETE(req: NextRequest) {
  const res = await ServerFetch({
    uri: "/absen/truncate",
    options: {
      method: "DELETE",
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
