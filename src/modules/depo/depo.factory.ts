import { DepoRepository } from "./depo.repository";
import { DepoService } from "./depo.service";

export const depoService = new DepoService(new DepoRepository);