import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Table } from "@tanstack/react-table";
import { getTodayDDMMYY } from "./getToday";

export async function exportTableToExcel<T>(table: Table<T>, filename: string) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(filename);

  const excludedColumnIds = ["aksi"];
  const columns = table
    .getVisibleLeafColumns()
    .filter((col) => !excludedColumnIds.includes(col.id));
  const rows = table.getPrePaginationRowModel().rows;

  const titleRow = sheet.getRow(1);
  titleRow.getCell(1).value = filename;
  titleRow.commit();

  sheet.mergeCells(1, 1, 1, 2);

  titleRow.font = {
    bold: true,
    size: 24,
  };

  sheet.columns = columns.map((col) => ({
    key: col.id,
  }));

  const headerRow = sheet.getRow(5);
  headerRow.font = { bold: true };

  columns.forEach((col, index) => {
    headerRow.getCell(index + 1).value = col.columnDef.header as string;
  });

  sheet.getRow(2).eachCell((cell) => {
    cell.border = {
      bottom: { style: "thin" },
    };
  });

  rows.forEach((row) => {
    sheet.addRow(
      columns.map((col) => {
        const cell = row.getVisibleCells().find((c) => c.column.id === col.id);

        const meta = col.columnDef.meta;

        return meta?.print ? meta.print?.(cell?.getValue()) : cell?.getValue();
      })
    );
  });

  sheet.eachRow((row) => {
    if (row.number >= 5) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  sheet.columns.forEach((column) => {
    let maxLength = 10;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      maxLength = Math.max(maxLength, String(cell.value ?? "").length);
    });

    column.width = maxLength + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${filename + getTodayDDMMYY()}.xlsx`);
}
