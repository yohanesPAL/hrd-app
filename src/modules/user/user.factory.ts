import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

export function createUserService() {
  return new UserService(new UserRepository);
}