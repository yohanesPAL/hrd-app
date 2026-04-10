import { employeeContractService } from "@/modules/employee/contract/employee.contract.factory";
import { EmployeeContractService } from "@/modules/employee/contract/employee.contract.service";
import { notificationService } from "@/modules/notification/notification.factory";
import { NotificationService } from "@/modules/notification/notification.service";

class ContractNotificationUseCase {
  constructor(
    private contractService: EmployeeContractService,
    private notificationService: NotificationService,
  ) { }

  async contractExpiration() {
    
  }
}

export const contractNotificationUseCase = new ContractNotificationUseCase(employeeContractService, notificationService);