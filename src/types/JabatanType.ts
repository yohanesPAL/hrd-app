interface Jabatan {
  nama_divisi: string;
  nama: string;
  is_active: boolean;
}

interface JabatanForm {
  nama: string;
  is_active: boolean;
  id_divisi: string;
}

interface JabatanInterface extends JabatanForm {
  id: string;
}

interface JabatanTable extends Jabatan {
  urutan: number;
  id: string;
  id_divisi: string;
}
