interface AbsenDivisi {
  id: string;
  kode_divisi: string;
  masuk: number;
  keluar: number;
  keluar_sabtu: number;
}

type AbsenDivisiTable = Pick<AbsenDivisi, "id" | "kode_divisi"> & {
  nama_divisi: string;
  masuk: string;
  keluar: string;
  keluar_sabtu: string;
};

type PatchAbsenDivisiForm = Pick<AbsenDivisi, "id"> & {
  masuk: string;
  keluar: string;
  keluar_sabtu: string;
};
