"use server";
import { withAuth } from "@/lib/withAuth";
import { employeeService } from "@/modules/employee/employee.factory";
import { userService } from "@/modules/user/user.factory";
import { UserForm, UserId } from "@/modules/user/user.schema";
import { revalidatePath } from "next/cache";

const PATH = "user";

export const getAllUsersAction = withAuth(async () => {
  return await userService.getAllUsers();
});

export const getUnaccountedEmployeesAction = withAuth(
  async (session, selectedId: UserId) => {
    return await employeeService.getUnaccountedEmployees(selectedId);
  },
);

export const createUserAction = withAuth(
  async (session, data: UserForm) => {
    await userService.createUser(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateUserAction = withAuth(
  async (session, id: UserId, data: UserForm) => {
    await userService.updateUser(id, data);
    revalidatePath(`${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteUserAction = withAuth(
  async (session, id: UserId) => {
    await userService.deleteUser(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
