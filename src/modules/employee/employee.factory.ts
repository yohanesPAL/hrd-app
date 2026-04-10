import { EmployeeRepository } from "./employee.repository";
import { EmployeeService } from "./employee.service";

export const employeeService = new EmployeeService(new EmployeeRepository);