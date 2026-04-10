import { EmployeeContractRepository } from "./employee.contract.repository";
import { EmployeeContractService } from "./employee.contract.service";

export const employeeContractService = new EmployeeContractService(new EmployeeContractRepository)