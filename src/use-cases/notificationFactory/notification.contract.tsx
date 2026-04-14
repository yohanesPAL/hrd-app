import pool from "@/lib/db";
import { Err } from "@/lib/err";
import { employeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractExpiration } from "@/modules/employee/contract/employee.contract.schema";
import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { notificationService } from "@/modules/notification/notification.factory";
import { NotificationForm } from "@/modules/notification/notification.schema";
import { NotificationService } from "@/modules/notification/notification.service";
import { userService } from "@/modules/user/user.factory";
import { UserService } from "@/modules/user/user.service";
import { ServiceRes } from "@/types/ServiceTypes";
import { formatDateDDMMYYYY } from "@/utils/dateFormatting";
import { DAYS_BEFORE_EXPIRATION, PRIORITY_LEVEL } from "./lib/var";

const GenerateContractForm = (contracts: EmployeeContractExpiration[]): NotificationForm[] => {
  return contracts.map((item) => ({
    ref: item.id,
    ref_table: "kontrak_karyawan",
    tipe: "contract_expiration",
    judul: "Kontrak Hampir Habis",
    teks: `kontrak karyawan ${item.nama} akan berakhir pada tanggal ${formatDateDDMMYYYY(item.tgl_berakhir)}`,
    level: PRIORITY_LEVEL.medium,
  }))
}

class ContractNotificationUseCase {
  constructor(
    private contractService: EmployeeContractService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  async contractExpiration(): Promise<ServiceRes<string>> {
    const conn = await pool.getConnection();
    try {
      const contracts = await this.contractService.getContractNearExpiration(DAYS_BEFORE_EXPIRATION.sevenDays);
      if(!contracts.data?.length) return {success: true, status: 200, data: "No near expiration contract found"}

      const contractsForm: NotificationForm[] = GenerateContractForm(contracts.data);

      const recipientIds = await this.userService.getUserIdByRole("hrd");
      if(!recipientIds.data?.length) return {success: true, status: 200, data: "No recipient id found"}

      await conn.beginTransaction();

      const notificationIds =  await this.notificationService.createNotification(contractsForm, conn);
      if(!notificationIds.data?.length) throw new Err("no notification id returned", 400);

      await this.notificationService.createNotificationRecipient(recipientIds.data, notificationIds.data, conn);

      await conn.commit();

      return { success: true, status: 200 }
    } catch (error) {
      await conn.rollback();
      console.error("ContractNotificationUseCase.contractExpiration error:", error);

      if (error instanceof Err) throw error

      throw new Err("failed to execute contract expiration notification", 500)
    } finally {
      conn.release();
    }
  }
}

export const contractNotificationUseCase = new ContractNotificationUseCase(employeeContractService, notificationService, userService);