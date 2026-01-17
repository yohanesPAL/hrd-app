interface MenuInterface {
  nama: string;
  icon: string;
  href: string;
  children?: any[];
}

const DokumenChildren: MenuInterface[] = [
  {nama: "Pengajuan Cuti", href: "pengajuan-cuti", icon: "bi-file-earmark-medical-fill"},
  {nama: "Kontrak Karyawan", href: "kontrak-karyawan", icon: "bi-file-earmark-medical-fill"},
  {nama: "Lain-lain", href: "lain-lain", icon: "bi-file-earmark-medical-fill"},
]

const Menu: MenuInterface[] = [
  {nama: "Dashboard", href: "dashboard", icon: "bi-speedometer2"},
  {nama: "Karyawan", href: "karyawan", icon: "bi-person"},
  {nama: "Dokumen", href: "dokumen", icon: "bi-file-earmark-medical-fill", children: DokumenChildren},
]



export default Menu