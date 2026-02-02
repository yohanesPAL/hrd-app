interface MenuInterface {
  nama: string;
  icon: string;
  href: string;
  children?: any[];
}

const DokumenChildren: MenuInterface[] = [
  { nama: "Pengajuan Cuti", href: "pengajuan-cuti", icon: "bi-file-earmark-medical-fill" },
  { nama: "Kontrak Karyawan", href: "kontrak-karyawan", icon: "bi-file-earmark-medical-fill" },
  { nama: "Lain-lain", href: "lain-lain", icon: "bi-file-earmark-medical-fill" },
]

const MasterChildren: MenuInterface[] = [
  { nama: "Divisi", href: "divisi", icon: "bi-stack" },
  { nama: "Jabatan", href: "jabatan", icon: "bi-briefcase-fill" },
]

const Menu: MenuInterface[] = [
  { nama: "Dashboard", href: "dashboard", icon: "bi-speedometer2" },
  { nama: "Master", href: "master", icon: "bi-database", children: MasterChildren },
  { nama: "Kalender Acara", href: "kalender", icon: "bi-calendar-event"},
  { nama: "Karyawan", href: "karyawan", icon: "bi-person" },
  { nama: "Absensi", href: "absensi", icon: "bi-calendar-check" },
  { nama: "Mobil", href: "mobil", icon: "bi-truck" },
  { nama: "Dokumen", href: "dokumen", icon: "bi-file-earmark-medical-fill", children: DokumenChildren },
]



export default Menu