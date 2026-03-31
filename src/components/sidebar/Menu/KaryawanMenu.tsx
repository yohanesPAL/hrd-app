import { MenuInterface } from "./Menu.types";

const DokumenChildren: MenuInterface[] = [
  { nama: "Pengajuan Cuti", href: "pengajuan-cuti", icon: "bi-file-earmark-medical-fill" },
  { nama: "Kontrak Karyawan", href: "kontrak-karyawan", icon: "bi-file-earmark-medical-fill" },
  { nama: "Lain-lain", href: "lain-lain", icon: "bi-file-earmark-medical-fill" },
]

export const KaryawanMenu: MenuInterface[] = [
  { nama: "Dashboard", href: "dashboard", icon: "bi-speedometer2" },
  { nama: "Absensi", href: "absensi", icon: "bi-calendar-check" },
  { nama: "Dokumen", href: "dokumen", icon: "bi-file-earmark-medical-fill", children: DokumenChildren },
  { nama: "User", href: "user", icon: "bi-person-fill" },
]