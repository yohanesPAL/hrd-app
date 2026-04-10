import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { EmployeeForm } from "@/modules/employee/employee.schema";
import { EmployeeService } from "@/modules/employee/employee.service";
import { EmployeeContractForm } from "@/modules/employee/contract/employee.contract.schema";
import { ServiceRes } from "@/types/ServiceTypes";
import pool from "@/lib/db";
import { Err } from "@/lib/err";
import { employeeService } from "@/modules/employee/employee.factory";
import { employeeContractService } from "@/modules/employee/contract/employee.contract.factory";

class CreateEmployeeWithContract {
  constructor(
    private employeeService: EmployeeService,
    private contractService: EmployeeContractService,
  ) {}

  async execute(
    employee: EmployeeForm,
    contract: Omit<EmployeeContractForm, "karyawan_id">,
  ): Promise<ServiceRes> {
    let conn;

    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const createEmployeeRes = await this.employeeService.createEmployee(
        employee,
        conn,
      );

      if(!createEmployeeRes.data) throw new Err("failed to create employee", 500);

      await this.contractService.createContract(
        {
          ...contract,
          karyawan_id: createEmployeeRes.data,
        },
        conn,
      );

      await conn.commit();
      return { success: true, status: 201 };
    } catch (error) {
      if (conn) await conn.rollback();

      console.error("CreateEmployee.execute error:", error);

      if (error instanceof Err) throw error;

      throw new Err("CreateEmployee unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }
}

export const createEmployeeWithContract = new CreateEmployeeWithContract(employeeService, employeeContractService)