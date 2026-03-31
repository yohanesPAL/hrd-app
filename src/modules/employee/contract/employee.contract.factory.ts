import { EmployeeContractRepository } from "./employee.contract.repository";
import { EmployeeContractService } from "./employee.contract.service";

export function createEmployeeContractService () {
  return new EmployeeContractService(new EmployeeContractRepository)
}