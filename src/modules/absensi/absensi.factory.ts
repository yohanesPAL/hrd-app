import { AbsensiRepository } from "./absensi.repository";
import { AbsensiService } from "./absensi.service";
import { AbsensiDetailRepository } from "./detail/absensi.detail.repository";

export function createAbsenService() {
  return new AbsensiService(
    new AbsensiRepository(),
    new AbsensiDetailRepository(),
  );
}
