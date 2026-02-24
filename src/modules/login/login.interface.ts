import { Account } from "./login.schema";

export interface ILoginRepository {
  getAccount(username: string): Promise<Account | null>
}