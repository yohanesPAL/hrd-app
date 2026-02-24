import { LoginRepository } from "./login.repository";
import { LoginService } from "./login.service";

export function createLoginService() {
  return new LoginService(new LoginRepository);
}