import { Err } from "@/lib/err";
import { IEmployeeRepository } from "./employee.interface";
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
import pool from "@/lib/db";
import { ZodError } from "zod";

export class EmployeeService {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async getAllEmployees() {
    try {
      const karyawan = await this.employeeRepository.getAll();

      return karyawan;
    } catch (error: unknown) {
      console.error("EmployeeService.getAllEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    }
  }

  async getEmployeeById(id: BaseEmployee["id"]) {
    try {
      EmployeeIdSchema.parse(id);

      const details = await this.employeeRepository.getById(id);

      return details;
    } catch (error: unknown) {
      console.error("EmployeeService.getEmployeeDeails error:", error);

      if (error instanceof ZodError) throw new Err("invalid id", 400);
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    }
  }

  async getEmployeeForUpdate(id: BaseEmployee["id"]) {
    try {
      EmployeeIdSchema.parse(id);

      const karyawan = await this.employeeRepository.getForUpdateById(id);

      return karyawan;
    } catch (error: unknown) {
      console.error("EmployeeService.getKaryawanForUpdate error:", error);

      if (error instanceof ZodError) throw new Err("invalid id", 400);
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
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

      return divCodeMap;
    } catch (error: unknown) {
      console.error("EmployeeService.getEmployeeAbsentDivCode error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    }
  }

  async createEmployee(data: EmployeeForm) {
    let conn;
    try {
      EmployeeFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.employeeRepository.create(data, conn);

      await conn.commit();

      return { success: res, status: 201 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EmployeeService.createEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async deleteEmployee(id: string) {
    if (!id || typeof id !== "string")
      throw new Err("invalid request data", 400);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const res = this.employeeRepository.delete(id, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      await conn.rollback();
      console.error("EmployeeService.deleteEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    } finally {
      conn.release();
    }
  }

  async updateEmployee(id: BaseEmployee["id"], data: EmployeeUpdate) {
    let conn;
    try {
      if (data.tgl_keluar === "") data.tgl_keluar = null;

      EmployeeUpdateSchema.parse(data);
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.employeeRepository.update(id, data, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EmployeeService.updateEmployee error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async updateEmployeeSP(id: BaseEmployee["id"], data: EmployeeSpForm) {
    let conn;
    try {
      EmployeeSpFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.employeeRepository.update(id, data, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EmployeeService.updateEmployeeSP error:", error);

      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }

  async updateEmployeeKodeAbsen(
    id: BaseEmployee["id"],
    data: EmployeeKodeAbsenForm,
  ) {
    let conn;
    try {
      EmployeeKodeAbsenFormSchema.parse(data);

      conn = await pool.getConnection();
      await conn.beginTransaction();

      const res = await this.employeeRepository.update(id, data, conn);

      await conn.commit();
      return { success: res, status: 200 };
    } catch (error: unknown) {
      if (conn) await conn.rollback();
      console.error("EmployeeService.updateEmployeeKodeAbsen error:", error);

      if (error instanceof ZodError) throw data;
      if (error instanceof Err) throw error;

      throw new Err("EmployeeService unavailable", 500);
    } finally {
      if (conn) conn.release();
    }
  }
}
