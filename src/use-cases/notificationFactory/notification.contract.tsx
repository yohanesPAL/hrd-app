import { createEmployeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { createNotificationService } from "@/modules/notification/notification.factory";
import { NotificationService } from "@/modules/notification/notification.service";

export function createContractNotificationService() {
  return new ContractNotification(
    createEmployeeContractService(),
    createNotificationService(),
  )
}

class ContractNotification {
  constructor(
    private contractService: EmployeeContractService,
    private notificationService: NotificationService,
  ) { }

  async contractExpiration() {
    
  }
}