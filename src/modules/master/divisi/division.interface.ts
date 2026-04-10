import { ActiveDivision, BaseDivision, DivisionForm, DivisionTable } from "./division.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IDivisionRepository {
  getAll(): Promise<DivisionTable[]>
  getActive(): Promise<ActiveDivision[]>
  create(data: DivisionForm): Promise<boolean>
  update(data: BaseDivision): Promise<boolean>
  delete(id: string): Promise<boolean>
}

export interface IDivisionService {
  getAllDivisions(): Promise<ServiceRes<DivisionTable[]>>;
  getActiveDivisions(): Promise<ServiceRes<ActiveDivision[]>>;
  createDivision(data: DivisionForm): Promise<ServiceRes>;
  updateDivision(data: BaseDivision): Promise<ServiceRes>;
  deleteDivision(id: string): Promise<ServiceRes>;
}