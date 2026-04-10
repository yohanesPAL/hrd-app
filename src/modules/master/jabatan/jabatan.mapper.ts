import { PositionTable, PositionTableSchema } from "./jabatan.schema";

export class JabatanMapper {
  static toTableRows(dbRows: any[]): PositionTable[] {
    return PositionTableSchema.array().parse(
      dbRows.map((item, index) => ({
        no: index + 1,
        ...item,
      })),
    );
  }
}
