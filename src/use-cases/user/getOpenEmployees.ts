import { Err } from "@/lib/err";
import { createEmployeeService } from "@/modules/employee/employee.factory";
import { EmployeeService } from "@/modules/employee/employee.service";
import { UserId } from "@/modules/user/user.schema";

export function createGetOpenEmployeesService() {
  return new GetOpenEmployees(createEmployeeService());
}

class GetOpenEmployees {
  constructor(private employeeService: EmployeeService) {}

  async execute(selectedId: UserId) {
    try {
      const { data } = await this.employeeService.getOpenEmployees(selectedId);

      return data;
    } catch (error) {
      console.error("GetOpenEmployees error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetOpenEmployees unavailable", 500);
    }
  }
}
