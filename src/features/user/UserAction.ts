"use server";
import { withAuth } from "@/lib/withAuth";
import { createUserService } from "@/modules/user/user.factory";
import { UserForm, UserId } from "@/modules/user/user.schema";
import { createGetUnaccountedEmployeesService } from "@/use-cases/user/getUnaccountedEmployees";
import { revalidatePath } from "next/cache";

const userService = createUserService();
const getUnaccountedEmployeeService = createGetUnaccountedEmployeesService();
const PATH = "user"

export const getAllUsers = withAuth(async () => {
  return await userService.getAllUsers();
});

export const getUnaccountedEmployees = withAuth(async (session, selectedId: UserId) => {
  return await getUnaccountedEmployeeService.execute(selectedId);
});

export const createUser = withAuth(
  async (session, data: UserForm) => {
    await userService.createUser(data);
    revalidatePath(`/${session.user.role}/${PATH}`)
  },
  ["hrd"],
);

export const updateUser = withAuth(
  async(session, id: UserId, data: UserForm) => {
    await userService.updateUser(id, data);
    revalidatePath(`${session.user.role}/${PATH}`)
  }, ["hrd"]
)

export const deleteUser = withAuth(
  async(session, id: UserId) => {
    await userService.deleteUser(id);
    revalidatePath(`/${session.user.role}/${PATH}`)
  }, ["hrd"]
)
