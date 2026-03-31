import { Err } from "@/lib/err";
import { createEmployeeService } from "@/modules/employee/employee.factory";
import { EmployeeService } from "@/modules/employee/employee.service";
import { UserId } from "@/modules/user/user.schema";

export function createGetUnaccountedEmployeesService() {
  return new GetUnaccountedEmployees(createEmployeeService());
}

class GetUnaccountedEmployees {
  constructor(private employeeService: EmployeeService) {}

  async execute(selectedId: UserId) {
    try {
      const { data } = await this.employeeService.getUnaccountedEmployees(selectedId);

      return data;
    } catch (error) {
      console.error("GetUnaccountedEmployees error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetUnaccountedEmployees unavailable", 500);
    }
  }
}
