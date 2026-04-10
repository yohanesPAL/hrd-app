import { JamAbsenRepository } from "./jamAbsen.repository";
import { JamAbsenService } from "./jamAbsen.service";

export const jamAbsenService = new JamAbsenService(new JamAbsenRepository());
