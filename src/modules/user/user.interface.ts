import { Connection } from "mysql2/promise";
import { UserForm, UserId, UserPersistence, UserTable, UserUpdateForm } from "./user.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IUserRepository {
  getAll(): Promise<UserTable[]>;
  getIdByKaryawanId(karyawanId: string, conn: Connection): Promise<UserId | null>;
  create(data: UserPersistence): Promise<boolean>;
  update(id: UserId, data: UserPersistence): Promise<boolean>;
  delete(id: UserId, conn?: Connection): Promise<boolean>;
}

export interface IUserService {
  getAllUsers(): Promise<ServiceRes<UserTable[]>>;
  getUserIdByKaryawanId(karyawanId: string, conn: Connection): Promise<ServiceRes<UserId | null>>;
  createUser(data: UserForm): Promise<ServiceRes>;
  updateUser(id: UserId, data: UserUpdateForm): Promise<ServiceRes>;
  deleteUser(id: UserId, conn?: Connection): Promise<ServiceRes>;
}
