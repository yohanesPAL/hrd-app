import { JamAbsenRepository } from "./jamAbsen.repository";
import { JamAbsenService } from "./jamAbsen.service";

export function createJamAbsenService() {
  return new JamAbsenService(new JamAbsenRepository);
}