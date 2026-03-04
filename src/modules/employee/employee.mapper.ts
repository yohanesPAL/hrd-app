import { formatDateYYYYMMDD } from "@/utils/dateFormatting";
import {
  EmployeeTable,
  EmployeeTableSchema,
  EmployeeUpdate,
  EmployeeUpdateSchema,
} from "./employee.schema";

export class EmployeeMapper {
  static toTableRows(dbRows: any[]): EmployeeTable[] {
    return EmployeeTableSchema.array().parse(
      dbRows.map((item, index) => ({
        ...item,
        no: index + 1,
      })),
    );
  }

  static toUpdateForm(data: any): EmployeeUpdate {
    return EmployeeUpdateSchema.parse({
      ...data,
      tgl_masuk: data.tgl_masuk ? formatDateYYYYMMDD(data.tgl_masuk) : "",
      tgl_keluar: data.tgl_keluar ? formatDateYYYYMMDD(data.tgl_keluar) : "",
    });
  }
}
