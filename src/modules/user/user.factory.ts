import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

export const userService = new UserService(new UserRepository);