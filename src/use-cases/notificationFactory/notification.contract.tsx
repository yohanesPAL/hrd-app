import pool from "@/lib/db";
import { Err } from "@/lib/err";
import { employeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { notificationService } from "@/modules/notification/notification.factory";
import { NotificationService } from "@/modules/notification/notification.service";
import { userService } from "@/modules/user/user.factory";
import { UserService } from "@/modules/user/user.service";
import { ServiceRes } from "@/types/ServiceTypes";

class ContractNotificationUseCase {
  constructor(
    private contractService: EmployeeContractService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  async contractExpiration(): Promise<ServiceRes<string>> {
    let conn;
    try {
      const contracts = await this.contractService.getContractNearExpiration();
      if(!contracts.data?.form.length) return {success: true, status: 204, data: "No near expiration contract found"}

      const recipientIds = await this.userService.getUserIdByRole("hrd");
      if(!recipientIds.data?.length) return {success: true, status: 204, data: "No recipient id found"}

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const notificationIds =  await this.notificationService.createNotification(contracts.data.form, conn);
      if(!notificationIds.data?.length) throw new Err("no notification id returned", 500);

      if(contracts.data.day7.length > 0) await this.contractService.updateNotified7d(contracts.data.day7, conn);
      if(contracts.data.day3.length > 0) await this.contractService.updateNotified3d(contracts.data.day3, conn);
      if(contracts.data.today.length > 0) await this.contractService.updateNotifiedToday(contracts.data.today, conn);

      await this.notificationService.createNotificationRecipient(recipientIds.data, notificationIds.data, conn);

      await conn.commit();

      return { success: true, status: 200, data: "ok" }
    } catch (error) {
      if(conn) await conn.rollback();
      console.error("ContractNotificationUseCase.contractExpiration error:", error);

      if (error instanceof Err) throw error

      throw new Err("failed to execute contract expiration notification", 500, error)
    } finally {
      if (conn) conn.release();
    }
  }
}

export const contractNotificationUseCase = new ContractNotificationUseCase(employeeContractService, notificationService, userService);