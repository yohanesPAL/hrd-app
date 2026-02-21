import { LoginRepository } from "./login.repository";
import { Account, Credential } from "./login.schema";
import bcrypt from "bcrypt"
import { Err } from "@/lib/err";

const dummyHash = "$2a$12$KI4oRpUY8YescA2kaGkdKunFTAEF7dUOb5ACJiIgcdgmUONJxrJ5i"; //123

export const LoginService = {
  async userLogin(credential: Credential) {
    const account: Account | null = await LoginRepository.getAccount(credential.username);

    const hashPassword = account?.password ?? dummyHash
    const isValid = await bcrypt.compare(credential.password, hashPassword);

    if(!isValid || !account) throw new Err("username atau password salah", 400);

    const {password, ...clientAccount} = account;

    return clientAccount
  }
}