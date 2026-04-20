import { DepoTable, DepoTableSchema } from "./depo.schema";

export class DepoMapper {
  static toTableRows(dbRows: any[]): DepoTable[] {
    return DepoTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      })),
    );
  }
}
