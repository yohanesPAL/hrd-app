import pool from "@/lib/db";
import { IUserRepository } from "./user.interface";
import { BaseUser, UserId, UserIdSchema, UserPersistence, UserTable } from "./user.schema";
import { ZodError } from "zod";
import { Err } from "@/lib/err";
import { RowDataPacket } from "mysql2";
import { UserMapper } from "./user.mapper";
import { dbErr } from "@/lib/dbErr";
import { Connection } from "mysql2/promise";

export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserTable[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT akun.id, username, role, karyawan_id, k.nama AS nama_karyawan FROM akun
            JOIN karyawan k ON (k.id = akun.karyawan_id)`,
      );

      return UserMapper.toTableRows(rows);
    } catch (error) {
      console.error("UserRepository.getAll error:", error);

      if (error instanceof ZodError) throw new Err("invalid users data", 400);

      throw new Err("failed to fetch users", 500);
    }
  }

  async getIdByKaryawanId(karyawanId: string, conn: Connection): Promise<UserId | null> {
      try {
        const [rows]: any[] = await conn.query("SELECT id FROM akun WHERE karyawan_id = ?", [karyawanId]);
        
        if(rows.length === 0) return null;

        return UserIdSchema.parse(rows[0].id);
      } catch (error) {
        console.error("UserRepository.getIdByKaryawanId error:", error);

        if(error instanceof ZodError) throw new Err("invalid user id", 400);

        throw new Err("failed to fetch user id", 500);
      }
  }

  async getIdByRole(role: BaseUser["role"]): Promise<UserId[]> {
      try {
        const [rows] = await pool.query(`SELECT id FROM akun WHERE role = ? AND is_active = 1`, [role]);
        const ids = (rows as any[]).map(row => row.id)

        return UserIdSchema.array().parse(ids);
      } catch (error) {
        console.error("UserRepository.getIdByRole error:", error);

        if(error instanceof ZodError) throw new Err("invalid id data", 400);

        throw new Err("failed to get id by role", 500);
      }
  }

  async create(data: UserPersistence): Promise<boolean> {
    try {
      await pool.query(
        "INSERT INTO akun (username, password, role, karyawan_id) VALUES (?,?,?,?)",
        [data.username, data.password, data.role, data.karyawan_id],
      );

      return true;
    } catch (error: any) {
      console.error("UserRepository.create error:", error);

      if (error.code === dbErr.duplicate)
        throw new Err("username already exists", 409);

      throw new Err("failed to create user", 500);
    }
  }

  async update(id: UserId, data: UserPersistence): Promise<boolean> {
    try {
      let passwordCol = "", args = [data.username, data.role, data.karyawan_id, id];
      if(data.isPassChange === true) {
        passwordCol = "password = ?,";
        args.unshift(data.password);
      }

      const query = `UPDATE akun SET ${passwordCol} username = ?, role = ?, karyawan_id = ? WHERE id = ?`
      await pool.query(query, args);

      return true;
    } catch (error: any) {
      console.error("UserRepository.update error:", error);

      if (error.code === dbErr.duplicate)
        throw new Err("username already exists", 409);

      throw new Err("failed to update user", 500);
    }
  }

  async delete(id: UserId, conn?: Connection): Promise<boolean> {
    const connection = conn ? conn : pool;
    try {
      await connection.query("DELETE FROM akun WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.error("UserRepository.delete error:", error);

      throw new Err("failed to delete user", 500);
    }
  }
}
