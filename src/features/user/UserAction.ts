"use server";
import { withAuth } from "@/lib/withAuth";
import { createUserService } from "@/modules/user/user.factory";
import { UserForm, UserId } from "@/modules/user/user.schema";
import { createGetOpenEmployeesService } from "@/use-cases/user/getOpenEmployees";
import { revalidatePath } from "next/cache";

const userService = createUserService();
const getOpenEmployeeService = createGetOpenEmployeesService();
const PATH = "user"

export const getAllUsers = withAuth(async () => {
  return await userService.getAllUsers();
});

export const getOpenEmployees = withAuth(async (session, selectedId: UserId) => {
  return await getOpenEmployeeService.execute(selectedId);
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
