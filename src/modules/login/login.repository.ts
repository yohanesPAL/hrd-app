import pool from "@/lib/db";
import { Account } from "./login.schema";
import { RowDataPacket } from "mysql2";

export const LoginRepository = {
  async getAccount(username: string): Promise<Account | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.id, username, role, a.karyawan_id, password, k.nama FROM akun a
        JOIN karyawan k ON k.id = a.karyawan_id
        WHERE a.username = ?`,
      [username],
    );

    return rows[0] as Account ?? null;
  },
};
