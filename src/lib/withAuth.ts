import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { Role } from "@/types/RolesType";

export function withAuth<Args extends any[], R>(
  action: (session: Session, ...args: Args) => R,
  allowedRoles?: Role[],
) {
  return async (...args: Args): Promise<R> => {
    const session = await auth();

    if (!session) {
      redirect("/login");
    }

    const userRole = session.user.role;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      redirect("/unauthorized");
    }

    return action(session, ...args);
  };
}
