import { HrdMenu } from "./HrdMenu"
import { KaryawanMenu } from "./KaryawanMenu"

export function getMenu(role: string) {
  switch(role) {
    case "hrd": return HrdMenu
    case "karyawan": return KaryawanMenu
    default: return []
  }
}