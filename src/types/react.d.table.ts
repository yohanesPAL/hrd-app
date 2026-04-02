import React from "react";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    print?: (value: any) => string;
    printHeader?: string;
    getRowClassName?: (value: any, row: TData) => string
    getRowStyle?: (value: any, row: TData) => React.CSSProperties
  }
}