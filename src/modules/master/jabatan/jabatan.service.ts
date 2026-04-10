import { Err } from "@/lib/err";
import { IPositionRepository, IPositionService } from "./jabatan.interface";
import {
  ActivePosition,
  BasePosition,
  BasePositionSchema,
  PositionForm,
  PositionFormSchema,
  PositionTable,
} from "./jabatan.schema";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";

export class PositionService implements IPositionService {
  constructor(private positionRepository: IPositionRepository) {}

  async getAllPositions(): Promise<ServiceRes<PositionTable[]>> {
    try {
      const res = await this.positionRepository.getAll();

      return {success: true, status: 200, data: res};
    } catch (error: unknown) {
      console.error("PositionService.getAllPositions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async getActivePositions(): Promise<ServiceRes<ActivePosition[]>> {
    try {
      const res = await this.positionRepository.getActive();

      return {success: true, status: 200, data: res};
    } catch (error: unknown) {
      console.error("PositionService.getAllPositions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async createPosition(data: PositionForm): Promise<ServiceRes> {
    try {
      const validated = PositionFormSchema.parse(data);

      await this.positionRepository.create(validated);

      return { success: true, status: 201 };
    } catch (error: unknown) {
      console.error("PositionService.createPosition error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async updatePosition(data: BasePosition): Promise<ServiceRes> {
    try {
      const validated = BasePositionSchema.parse(data);

      await this.positionRepository.update(validated);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("PositionService.updateDivision error:", error);

      if (error instanceof ZodError) throw new Err("invalid request data", 400);
      if (error instanceof Err) throw error;

      throw new Err("DivisionService unvailable", 500);
    }
  }

  async deletePosition(id: string): Promise<ServiceRes> {
    if (!id || typeof id !== "string")
      throw new Err("invalid request body", 400);

    try {
      const res = await this.positionRepository.delete(id);

      return { success: res, status: 200 };
    } catch (error: unknown) {
      console.error("PositionService.deletePosition error:", error);

      if (error instanceof Err) throw error;

      throw new Err("PositionService unavailable", 500);
    }
  }
}
