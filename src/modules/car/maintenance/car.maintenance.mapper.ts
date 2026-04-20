import {
  CarMaintenanceTable,
  CarMaintenanceTableSchema,
} from "./car.maintenance.schema";

export class CarMaintenanceMapper {
  static toTableRows(dbRows: any[]): CarMaintenanceTable[] {
    return CarMaintenanceTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      })),
    );
  }
}
