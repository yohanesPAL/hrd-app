import { ZodError } from "zod";
import { ILoginRepository, ILoginService } from "./login.interface";
import { Account, ClientAccountSchema, Credential, CredentialSchema } from "./login.schema";
import bcrypt from "bcrypt";
import { Err } from "@/lib/err";

const dummyHash =
  "$2a$12$KI4oRpUY8YescA2kaGkdKunFTAEF7dUOb5ACJiIgcdgmUONJxrJ5i";

export class LoginService implements ILoginService {
  constructor(private loginRepository: ILoginRepository) {}

  async userLogin(credential: Credential): Promise<Omit<Account, "password"> | null> {
    try {
      const validatedCredential = CredentialSchema.parse(credential);

      const account = await this.loginRepository.getAccount(
        validatedCredential.username,
      );

      const hashPassword = account?.password ?? dummyHash;
      const isValid = await bcrypt.compare(validatedCredential.password, hashPassword);

      if (!isValid || !account) return null;

      const { password, ...clientAccount } = account;

      return ClientAccountSchema.parse(clientAccount);
    } catch (error) {
      console.error("LoginService.userLogin error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);

      if (error instanceof Err) throw error;

      throw new Err("LoginService unavailable", 500)
    }
  }
}
