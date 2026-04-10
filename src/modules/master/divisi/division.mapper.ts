import { DivisionTable, DivisionTableSchema } from "./division.schema";

export class DivisionMapper {
  static toTableRows(dbRows: any[]): DivisionTable[] {
    return DivisionTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      })),
    );
  }
}
