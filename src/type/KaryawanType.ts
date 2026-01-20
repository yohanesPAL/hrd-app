interface KaryawanInt {
  id: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string | null;
  jabatan: string;
  divisi: string;
  statusAktif: boolean;
  statusKontrak: "Kontrak" | "Tetap";
}

interface KaryawanInterface {
  id: string;
  nik: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string | null;
  jabatan: string;
  divisi: string;
  sp: 0 | 1 | 2 | 3;
  cutiTerakhir: number;
  cutiSekarang: number;
  statusAktif: boolean;
  statusKaryawan: "Kontrak" | "Tetap" | "Resign" | "Cutoff";
  tglMasuk: string;
  tglKeluar: string | null;
  durasiKontrak: number | null;
  kodeAbsensi: string | null;
}

export type { KaryawanInt };
