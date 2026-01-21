interface KaryawanInterface {
  id: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string | null;
  divisi: string;
  jabatan: string;
  statusAktif: boolean;
  statusKaryawan: "Kontrak" | "Tetap" | "Resign" | "Cutoff";
}

export type { KaryawanInterface };
