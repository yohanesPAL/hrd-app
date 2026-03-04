import { Account, Credential } from "./login.schema";

export interface ILoginRepository {
  getAccount(username: string): Promise<Account | null>
}

export interface ILoginService {
  userLogin(credential: Credential): Promise<Partial<Account> | null>;
}