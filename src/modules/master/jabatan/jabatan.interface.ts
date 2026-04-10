import { ActivePosition, BasePosition, PositionForm, PositionTable } from "./jabatan.schema";
import { ServiceRes } from "@/types/ServiceTypes";

export interface IPositionRepository {
  getAll(): Promise<PositionTable[]>;
  getActive(): Promise<ActivePosition[]>
  create(data: PositionForm): Promise<boolean>;
  update(data: BasePosition): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IPositionService {
  getAllPositions(): Promise<ServiceRes<PositionTable[]>>;
  getActivePositions(): Promise<ServiceRes<ActivePosition[]>>;
  createPosition(data: PositionForm): Promise<ServiceRes>;
  updatePosition(data: BasePosition): Promise<ServiceRes>;
  deletePosition(id: string): Promise<ServiceRes>;
}