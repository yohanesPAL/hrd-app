import { employeeService } from "../employee/employee.factory";
import { jamAbsenService } from "../master/jamAbsen/jamAbsen.factory";
import { AbsensiRepository } from "./absensi.repository";
import { AbsensiService } from "./absensi.service";
import { AbsensiDetailRepository } from "./detail/absensi.detail.repository";

export const absensiService = new AbsensiService(
  new AbsensiRepository(),
  new AbsensiDetailRepository(),
  jamAbsenService,
  employeeService,
);
