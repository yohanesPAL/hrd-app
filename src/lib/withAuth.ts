import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { Account } from "@/modules/login/login.schema";

/**
 * Wraps an action with authentication and optional role-based authorization.
 *
 * @template {any[]} Args - Tuple of argument types passed to the wrapped action.
 * @template R - Resolved return type of the wrapped action.
 *
 * @param {(session: Session, ...args: Args) => Promise<R> | R} action
 *   The action to execute. Receives the authenticated session as the first argument.
 *
 * @param {Account["role"][]} [allowedRoles]
 *   Optional list of roles allowed to execute the action.
 *   If provided, users with roles not in this list will be redirected.
 *
 * @returns {(...args: Args) => Promise<R>}
 *   A function that ensures authentication and authorization before executing the action.
 *
 * @remarks
 * - If no session is found, the user is redirected to "/login".
 * - If `allowedRoles` is provided and the user's role is not included,
 *   the user is redirected to "/unauthorized".
 * - The wrapped action can be synchronous or asynchronous.
 *
 * @example
 * const protectedAction = withAuth(
 *   async (session, id: string) => {
 *     return getUserById(id);
 *   },
 *   ["admin"]
 * );
 *
 * await protectedAction("123");
 */
export function withAuth<Args extends any[], R>(
  action: (session: Session, ...args: Args) => Promise<R> | R,
  allowedRoles?: Account["role"][],
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
