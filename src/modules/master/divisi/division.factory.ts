import { DivisionRepository } from "./division.repository";
import { DivisionService } from "./division.service";

export const divisionService = new DivisionService(new DivisionRepository);