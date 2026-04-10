import { PositionRepository } from "./jabatan.repository";
import { PositionService } from "./jabatan.service";

export const positionService = new PositionService(new PositionRepository);
