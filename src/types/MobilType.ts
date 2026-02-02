interface Mobil {
  id: string;
  nama: string;
  jenis: string;
  merk: string;
  plat: string;
  depo: string;
  tahun: string;
  jumlah_roda: number;
  status: "Baik" | "Rusak" | "Non Aktif";
}
