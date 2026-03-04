import { OpenEmployee } from "@/modules/employee/employee.schema";

export type OpenEmployeeState = {
  isLoading: boolean,
  data: OpenEmployee[]
}

export type FormType = "Tambah" | "Update";