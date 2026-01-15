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

export type { KaryawanInt };
