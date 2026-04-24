import { ActiveDivision, BaseDivision, DivisionForm, DivisionTable } from "./division.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IDivisionRepository {
  getAll(): Promise<DivisionTable[]>
  getActive(): Promise<ActiveDivision[]>
  create(data: DivisionForm): Promise<boolean>
  update(data: DivisionForm, id: BaseDivision["id"]): Promise<boolean>
  delete(id: BaseDivision["id"]): Promise<boolean>
}

export interface IDivisionService {
  getAllDivisions(): Promise<ServiceRes<DivisionTable[]>>;
  getActiveDivisions(): Promise<ServiceRes<ActiveDivision[]>>;
  createDivision(data: DivisionForm): Promise<ServiceRes>;
  updateDivision(data: BaseDivision, id: BaseDivision["id"]): Promise<ServiceRes>;
  deleteDivision(id: BaseDivision["id"]): Promise<ServiceRes>;
}