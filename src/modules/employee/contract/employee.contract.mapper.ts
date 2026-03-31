import { EmployeeContractTableSchema } from "./employee.contract.schema";

export class EmployeeContractMapper {
  static toTableRows(dBrows: any[]) {
    return EmployeeContractTableSchema.array().parse(
      dBrows.map((item, index) => ({
        ...item,
        no: index + 1,
      })),
    );
  }
}
