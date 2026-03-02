import { DivisionRepository } from "./division.repository";
import { DivisionService } from "./division.service";

export function createDivisionService() {
  return new DivisionService(new DivisionRepository);
}