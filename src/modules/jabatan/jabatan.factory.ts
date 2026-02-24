import { PositionRepository } from "./jabatan.repository";
import { PositionService } from "./jabatan.service";

export function createPositionService() {
  return new PositionService(new PositionRepository);
}
