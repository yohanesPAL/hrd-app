import pool from "@/lib/db";
import { Account, AccountSchema } from "./login.schema";
import { RowDataPacket } from "mysql2";
import { ILoginRepository } from "./login.interface";
import { ZodError } from "zod";
import { Err } from "@/lib/err";

export class LoginRepository implements ILoginRepository {
  async getAccount(username: string): Promise<Account | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT a.id, username, role, a.karyawan_id, password, k.nama FROM akun a
          JOIN karyawan k ON k.id = a.karyawan_id
          WHERE a.username = ?`,
        [username],
      );

      if (!rows[0]) return null;
      else {
        const akun: Account = rows[0] as Account;
        return AccountSchema.parse(akun);
      }
    } catch (error: unknown) {
      console.error("LoginRepository.getAccount error:", error);

      if (error instanceof ZodError) throw new Err("invalid account data", 400)

      throw new Err("failed to login", 500);
    }
  }
}
