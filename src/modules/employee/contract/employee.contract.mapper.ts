import { NotificationForm } from "@/modules/notification/notification.schema";
import {
  EmployeeContractExpiration,
  EmployeeContractTable,
  EmployeeContractTableSchema,
} from "./employee.contract.schema";
import { PRIORITY_LEVEL } from "@/use-cases/notificationFactory/lib/var";
import { formatDateDDMMYYYY } from "@/utils/dateFormatting";

export class EmployeeContractMapper {
  static toTableRows(dBrows: any[]): EmployeeContractTable[] {
    return EmployeeContractTableSchema.array().parse(
      dBrows.map((item, index) => ({
        ...item,
        no: index + 1,
      })),
    );
  }

  static toContractForm(contracts: EmployeeContractExpiration[]) {
    const contractForms: NotificationForm[] = [];
    const notified7d = [],
      notified3d = [],
      notifiedToday = [];

    for (const item of contracts) {
      if (item.days_diff > 3) {
        if (!item.notified_7_day) notified7d.push(item.id);
        else continue;
      } else if (item.days_diff > 0) {
        if (!item.notified_3_day) notified3d.push(item.id);
        else continue;
      } else if (item.days_diff === 0) {
        if (!item.notified_today) notifiedToday.push(item.id);
        else continue;
      }

      let priorityLevel, teks;
      if(item.days_diff === 0) {
        priorityLevel = PRIORITY_LEVEL.high;
        teks = `kontrak karyawan ${item.nama} akan berakhir hari ini !!`
      } else {
        priorityLevel = PRIORITY_LEVEL.medium;
        teks = `kontrak karyawan ${item.nama} akan berakhir pada tanggal ${formatDateDDMMYYYY(item.tgl_berakhir)}`
      }

      contractForms.push({
        ref: item.id,
        ref_table: "kontrak_karyawan",
        tipe: "contract_expiration",
        judul: "Kontrak Hampir Habis",
        teks: teks,
        level: priorityLevel,
      });
    }

    return {
      form: contractForms,
      day7: notified7d,
      day3: notified3d,
      today: notifiedToday,
    };
  }
}
