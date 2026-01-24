interface Divisi {
  nama: string;
  is_active: boolean;
}

interface DivisiInterface extends Divisi {
  id: string;
}

interface DivisiTable extends Divisi {
  urutan: number;
  id: string
}
