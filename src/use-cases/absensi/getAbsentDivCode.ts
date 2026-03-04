import { Err } from "@/lib/err";
import { createEmployeeService } from "@/modules/employee/employee.factory";
import { EmployeeService } from "@/modules/employee/employee.service";

export function createGetAbsentDivCode() {
  return new GetAbsentDivCode(createEmployeeService());
}

class GetAbsentDivCode {
  constructor(private employeeService: EmployeeService) {}

  async execute(absentCode: string[]) {
    try {
      const {data} =
        await this.employeeService.getEmployeeAbsentDivCode(absentCode);

      return data;
    } catch (error: unknown) {
      console.error("GetAbsentDivCode error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetJamAbsenForImport unavailable", 500);
    }
  }
}
