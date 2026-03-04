import {
  UserForm,
  UserPersistence,
  UserPersistenceSchema,
  UserTable,
  UserTableSchema,
  UserUpdateForm,
} from "./user.schema";

export class UserMapper {
  static toTableRows(dbRows: any[]): UserTable[] {
    return UserTableSchema.array().parse(
      dbRows.map((item, index) => ({
        ...item,
        no: index + 1,
      })),
    );
  }

  static toPersistence(
    user: UserForm | UserUpdateForm,
    hashedPassword: string,
  ): UserPersistence {
    return UserPersistenceSchema.parse({
      username: user.username,
      password: hashedPassword,
      role: user.role,
      karyawan_id: user.karyawan_id,
      isPassChange: !user.password ? false : true,
    });
  }
}
