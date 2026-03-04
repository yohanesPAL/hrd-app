import { Err } from "@/lib/err";
import { IEmployeeRepository, IEmployeeService } from "./employee.interface";
import {
  BaseEmployee,
  EmployeeForm,
  EmployeeFormSchema,
  EmployeeIdSchema,
  EmployeeKodeAbsenForm,
  EmployeeKodeAbsenFormSchema,
  EmployeeSpForm,
  EmployeeSpFormSchema,
  EmployeeUpdate,
  EmployeeUpdateSchema,
} from "./employee.schema";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";
import { UserId } from "../user/user.schema";
import { Connection } from "mysql2/promise";

export class EmployeeService implements IEmployeeService {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async getAllEmployees() {
    try {
      const karyawan = await this.employeeRepository.getAll();

      return { success: true, status: 200, data: karyawan };
    } catch (error) {
      console.error("EmployeeService.getAllEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.getAllEmployees unavailable", 500);
    }
  }

  async getEmployeeById(id: BaseEmployee["id"]) {
    try {
      EmployeeIdSchema.parse(id);

      const details = await this.employeeRepository.getById(id);

      return { success: true, status: 200, data: details };
    } catch (error) {
      console.error("EmployeeService.getEmployeeDeails error:", error);

      if (error instanceof ZodError) throw new Err("invalid id", 400);
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.getEmployeeById unavailable", 500);
    }
  }

  async getEmployeeForUpdate(id: BaseEmployee["id"]) {
    try {
      EmployeeIdSchema.parse(id);

      const karyawan = await this.employeeRepository.getForUpdateById(id);

      return { success: true, status: 200, data: karyawan };
    } catch (error: unknown) {
      console.error("EmployeeService.getKaryawanForUpdate error:", error);

      if (error instanceof ZodError) throw new Err("invalid id", 400);
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.getEmployeeForUpdate unavailable", 500);
    }
  }

  async getEmployeeAbsentDivCode(absentCode: string[]) {
    if (absentCode.length === 0) throw new Err("invalid request data", 400);

    try {
      const absentDiv =
        await this.employeeRepository.getDivisionCode(absentCode);

      const divCodeMap = new Map<string, string>();
      absentDiv.forEach((item) => {
        if (!item.kode_absensi) throw new Err("kode absent is null", 400);

        if (!divCodeMap.has(item.kode_absensi)) {
          divCodeMap.set(item.kode_absensi, item.divisi);
        }
      });

      return { success: true, status: 200, data: divCodeMap };
    } catch (error: unknown) {
      console.error("EmployeeService.getEmployeeAbsentDivCode error:", error);

      if (error instanceof Err) throw error;

      throw new Err(
        "EmployeeService.getEmployeeAbsentDivCode unavailable",
        500,
      );
    }
  }

  async getOpenEmployees(selectedId: UserId): Promise<ServiceRes> {
    try {
      const employees = this.employeeRepository.getOpenEmployees(selectedId);

      return { success: true, status: 200, data: employees };
    } catch (error) {
      console.error("EmployeeService.getOpenEmployees error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.getOpenEmployees unavailable", 500);
    }
  }

  async createEmployee(data: EmployeeForm) {
    try {
      EmployeeFormSchema.parse(data);

      await this.employeeRepository.create(data);

      return { success: true, status: 201 };
    } catch (error: unknown) {
      console.error("EmployeeService.createEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.createEmployee unavailable", 500);
    }
  }

  async deleteEmployee(id: string, conn: Connection) {
    if (!id || typeof id !== "string")
      throw new Err("invalid request data", 400);

    try {
      await this.employeeRepository.delete(id, conn);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("EmployeeService.deleteEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.deleteEmployee unavailable", 500);
    }
  }

  async updateEmployee(id: BaseEmployee["id"], data: EmployeeUpdate) {
    try {
      if (data.tgl_keluar === "") data.tgl_keluar = null;

      EmployeeUpdateSchema.parse(data);

      await this.employeeRepository.update(id, data);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("EmployeeService.updateEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.updateEmployee unavailable", 500);
    }
  }

  async updateEmployeeSP(id: BaseEmployee["id"], data: EmployeeSpForm) {
    try {
      EmployeeSpFormSchema.parse(data);

      const res = await this.employeeRepository.update(id, data);

      return { success: res, status: 200 };
    } catch (error: unknown) {
      console.error("EmployeeService.updateEmployeeSP error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.updateEmployeeSP unavailable", 500);
    }
  }

  async updateEmployeeKodeAbsen(
    id: BaseEmployee["id"],
    data: EmployeeKodeAbsenForm,
  ) {
    try {
      EmployeeKodeAbsenFormSchema.parse(data);

      const res = await this.employeeRepository.update(id, data);

      return { success: res, status: 200 };
    } catch (error: unknown) {
      console.error("EmployeeService.updateEmployeeKodeAbsen error:", error);

      if (error instanceof ZodError) throw data;
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService.updateEmployeeKodeAbsen unavailable", 500);
    }
  }
}
