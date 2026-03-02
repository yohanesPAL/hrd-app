import { Err } from "@/lib/err";
import { createEmployeeService } from "@/modules/karyawan/employee.factory";
import { EmployeeService } from "@/modules/karyawan/employee.service";

export function createGetAbsentDivCode() {
  return new GetAbsentDivCode(createEmployeeService());
}

export class GetAbsentDivCode {
  constructor(private employeeService: EmployeeService) {}

  async execute(absentCode: string[]) {
    try {
      const kodeDivMap =
        await this.employeeService.getEmployeeAbsentDivCode(absentCode);

      return kodeDivMap;
    } catch (error: unknown) {
      console.error("GetAbsentDivCode error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetJamAbsenForImport unavailable", 500);
    }
  }
}
