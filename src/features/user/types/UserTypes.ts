import { OpenEmployee } from "@/modules/employee/employee.schema";

export type OpenEmployeeState = {
  isLoading: boolean,
  data: {value: string, label: string}[]
}

export type FormType = "Tambah" | "Update";