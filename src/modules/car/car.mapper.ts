import { CarTable, CarTableSchema } from "./car.schema";

export class CarMapper {
  static toTableRow(dbRows: any[]): CarTable[] {
    return CarTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      }))
    );
  }
}
