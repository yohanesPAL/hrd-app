interface KaryawanTable {
  urutan: number;
  id: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string | null;
  divisi: string;
  jabatan: string;
  status_aktif: boolean;
  status_karyawan: "Kontrak" | "Tetap" | "Resign" | "Cutoff";
  kode_absensi: string;
  sp: number;
}

interface KaryawanForm {
  nik: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string;
  divisi: string;
  jabatan: string;
  cuti_terakhir: number;
  cuti_sekarang: number;
  status_aktif: boolean;
  status_karyawan: string;
  durasi_kontrak: number;
  kode_absensi: string;
  tgl_masuk: string;
}

interface KaryawanEditForm {
  id: string;
  nik: string;
  nama: string;
  jk: "Pria" | "Wanita";
  alamat: string;
  hp: string;
  divisi: string;
  jabatan: string;
  cuti_terakhir: number;
  cuti_sekarang: number;
  status_aktif: boolean;
  status_karyawan: string;
  durasi_kontrak: number;
  tgl_masuk: string;
  tgl_keluar: string;
}

interface KaryawanFormDepedencies {
  divisi: DivisiInterface[];
  jabatan: JabatanInterface[];
}

interface PatchKodeAbsensi {
  id: string;
  kode_absensi: string;
}

interface PatchSp {
  id: string;
  sp: number;
}
