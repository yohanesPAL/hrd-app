import { ServiceRes } from "@/types/ServiceTypes";
import { BaseDepo, DepoForm, DepoTable } from "./depo.schema";

export interface IDepoRepository {
  getAll(): Promise<DepoTable[]>,
  create(depoForm: DepoForm): Promise<boolean>,
  update(depoForm: DepoForm, depoId: BaseDepo["id"]): Promise<boolean>,
  delete(depoId: BaseDepo["id"]): Promise<boolean>,
}

export interface IDepoService {
  getAllDepo(): Promise<ServiceRes<DepoTable[]>>,
  createDepo(depoForm: DepoForm): Promise<ServiceRes>,
  updateDepo(depoForm: DepoForm, depoId: BaseDepo["id"]): Promise<ServiceRes>,
  deleteDepo(depoId: BaseDepo["id"]): Promise<ServiceRes>,
}