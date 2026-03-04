import { EmployeeRepository } from "./employee.repository";
import { EmployeeService } from "./employee.service";

export function createEmployeeService() {
  return new EmployeeService(new EmployeeRepository);
}