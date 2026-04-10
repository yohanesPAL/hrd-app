"use server";
import { withAuth } from "@/lib/withAuth";
import { employeeService } from "@/modules/employee/employee.factory";
import { userService } from "@/modules/user/user.factory";
import { UserForm, UserId } from "@/modules/user/user.schema";
import { revalidatePath } from "next/cache";

const PATH = "user";

export const getAllUsers = withAuth(async () => {
  return await userService.getAllUsers();
});

export const getUnaccountedEmployees = withAuth(
  async (session, selectedId: UserId) => {
    const res = await employeeService.getUnaccountedEmployees(selectedId);
    const selectsOption = res.data?.map(item => ({
      value: item.id,
      label: `${item.nik} | ${item.nama} | ${item.jabatan}`,
    }));
    return selectsOption;
  },
);

export const createUser = withAuth(
  async (session, data: UserForm) => {
    await userService.createUser(data);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const updateUser = withAuth(
  async (session, id: UserId, data: UserForm) => {
    await userService.updateUser(id, data);
    revalidatePath(`${session.user.role}/${PATH}`);
  },
  ["hrd"],
);

export const deleteUser = withAuth(
  async (session, id: UserId) => {
    await userService.deleteUser(id);
    revalidatePath(`/${session.user.role}/${PATH}`);
  },
  ["hrd"],
);
