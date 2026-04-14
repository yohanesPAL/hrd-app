import { Err } from "@/lib/err";
import { UserRepository } from "./user.repository";
import {
  BaseUser,
  UserForm,
  UserFormSchema,
  UserId,
  UserIdSchema,
  UserTable,
  UserUpdateForm,
  UserUpdateFormSchema,
} from "./user.schema";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";
import { UserMapper } from "./user.mapper";
import { ServiceRes } from "@/types/ServiceTypes";
import { Connection } from "mysql2/promise";

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<ServiceRes<UserTable[]>> {
    try {
      const users = await this.userRepository.getAll();

      return { success: true, status: 200, data: users };
    } catch (error) {
      console.error("UserService.getAllUsers error:", error);

      if (error instanceof Err) throw error;

      throw new Err("UserService unavailable", 500);
    }
  }

  async getUserIdByKaryawanId(
    karyawanId: string,
    conn: Connection,
  ): Promise<ServiceRes<string | null>> {
    if (typeof karyawanId !== "string") throw new Err("invalid request data");

    try {
      const userId = await this.userRepository.getIdByKaryawanId(
        karyawanId,
        conn,
      );

      return { success: true, status: 200, data: userId };
    } catch (error) {
      console.error("UserService.getUserIdByKaryawanId error:", error);

      if (error instanceof Err) throw error;

      throw new Err("UserService.getUserIdByKaryawanId unavailable", 500);
    }
  }

  async getUserIdByRole(role: BaseUser["role"]): Promise<ServiceRes<UserId[]>> {
    if (!role || typeof role !== "string")
      throw new Err("invalid request data", 400);
    try {
      const res = await this.userRepository.getIdByRole(role);

      return { success: true, status: 200, data: res };
    } catch (error) {
      console.error("UserService.getUserIdByRole error:", error);

      if (error instanceof Err) throw error;

      throw new Err("internal server error", 500);
    }
  }

  async createUser(data: UserForm) {
    try {
      const val = UserFormSchema.parse(data);

      const hashedPass = await bcrypt.hash(val.password, 12);
      const persistence = UserMapper.toPersistence(val, hashedPass);

      await this.userRepository.create(persistence);

      return { success: true, status: 201 };
    } catch (error) {
      console.error("UserService.createUser error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("UserService.createUser unavailable", 500);
    }
  }

  async updateUser(id: UserId, data: UserUpdateForm): Promise<ServiceRes> {
    try {
      const valId = UserIdSchema.parse(id);
      const val = UserUpdateFormSchema.parse(data);

      const hashedPass = await bcrypt.hash(val.password ?? "DUMMY_HASH", 12);
      const persistence = UserMapper.toPersistence(val, hashedPass);

      await this.userRepository.update(valId, persistence);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("UserService.updateUser error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("UserService.updateUser unavailable", 500);
    }
  }

  async deleteUser(id: UserId, conn?: Connection): Promise<ServiceRes> {
    try {
      const valId = UserIdSchema.parse(id);

      await this.userRepository.delete(valId, conn);

      return { success: true, status: 200 };
    } catch (error) {
      console.error("UserService.deleteUser error:", error);

      if (error instanceof Err) throw error;

      throw new Err("UserService.deleteUser unavailable", 500);
    }
  }
}
