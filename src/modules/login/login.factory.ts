import { LoginRepository } from "./login.repository";
import { LoginService } from "./login.service";

export const loginService = new LoginService(new LoginRepository);