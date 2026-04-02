import pool from "@/lib/db";
import { Err } from "@/lib/err";
import { createEmployeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { createEmployeeService } from "@/modules/employee/employee.factory";
import { EmployeeService } from "@/modules/employee/employee.service";
import { createUserService } from "@/modules/user/user.factory";
import { UserService } from "@/modules/user/user.service";
import { ServiceRes } from "@/types/ServiceTypes";

export function createDeleteEmployeeService() {
  return new DeleteEmployee(createEmployeeService(), createUserService());
}

class DeleteEmployee {
  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
  ) {}

  async execute(karyawanId: string): Promise<ServiceRes> {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const userId = await this.userService.getUserIdByKaryawanId(
        karyawanId,
        conn,
      );
      
      if(userId.data) {
        await this.userService.deleteUser(userId.data, conn);
      }

      await this.employeeService.deleteEmployee(karyawanId, conn);

      await conn.commit();
      return { success: true, status: 200 };
    } catch (error) {
      if (conn) await conn.rollback();

      console.error("DeleteEmployee.execute error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DeleteEmployee unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }
}
