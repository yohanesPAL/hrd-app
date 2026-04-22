import { MenuInterface } from "./Menu.types"

const DokumenChildren: MenuInterface[] = [
  { nama: "Pengajuan Cuti", href: "pengajuan-cuti", icon: "bi-file-earmark-medical-fill" },
  { nama: "Kontrak Karyawan", href: "kontrak-karyawan", icon: "bi-file-earmark-medical-fill" },
  { nama: "Lain-lain", href: "lain-lain", icon: "bi-file-earmark-medical-fill" },
]

const MasterChildren: MenuInterface[] = [
  { nama: "Depo", href: "depo", icon: "bi-building" },
  { nama: "Divisi", href: "divisi", icon: "bi-stack" },
  { nama: "Jabatan", href: "jabatan", icon: "bi-briefcase-fill" },
  { nama: "Jam Absen Divisi", href: "absen-divisi", icon: "bi-clock-fill" },
]

export const HrdMenu: MenuInterface[] = [
  { nama: "Dashboard", href: "dashboard", icon: "bi-speedometer2" },
  { nama: "Master", href: "master", icon: "bi-database", children: MasterChildren },
  { nama: "Kalender Acara", href: "kalender", icon: "bi-calendar-event"},
  { nama: "Karyawan", href: "karyawan", icon: "bi-people-fill" },
  { nama: "Absensi", href: "absensi", icon: "bi-calendar-check" },
  { nama: "Kendaraan", href: "kendaraan", icon: "bi-truck" },
  { nama: "Dokumen", href: "dokumen", icon: "bi-file-earmark-medical-fill", children: DokumenChildren },
  { nama: "User", href: "user", icon: "bi-person-fill" },
]