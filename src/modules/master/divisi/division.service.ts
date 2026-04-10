import { Err } from "@/lib/err";
import { IDivisionRepository, IDivisionService } from "./division.interface";
import {
  ActiveDivision,
  BaseDivision,
  BaseDivisionSchema,
  DivisionForm,
  DivisionFormSchema,
  DivisionTable,
} from "./division.schema";
import { ZodError } from "zod";
import { ServiceRes } from "@/types/ServiceTypes";

export class DivisionService implements IDivisionService {
  constructor(private divisionRepository: IDivisionRepository) {}

  async getAllDivisions(): Promise<ServiceRes<DivisionTable[]>> {
    try {
      const res = await this.divisionRepository.getAll();

      return {success: true, status: 200, data: res};
    } catch (error) {
      console.error("DivisionService.getAllDivisions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async getActiveDivisions(): Promise<ServiceRes<ActiveDivision[]>> {
    try {
      const res = await this.divisionRepository.getActive();

      return {success: true, status: 200, data: res};
    } catch (error: unknown) {
      console.error("DivisionService.getActiveDivision error:", error);

      if (error instanceof Err) throw error;

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async createDivision(data: DivisionForm): Promise<ServiceRes> {
    try {
      const validated = DivisionFormSchema.parse(data);

      await this.divisionRepository.create(validated);

      return { success: true, status: 201 };
    } catch (error) {
      console.error("DivisionService.createDivision error:", error);

      if (error instanceof ZodError) throw new Err(`invalid request data`, 400)
      if (error instanceof Err) throw error

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async updateDivision(data: BaseDivision): Promise<ServiceRes> {
    try {
      const validated = BaseDivisionSchema.parse(data);

      await this.divisionRepository.update(validated);

      return { success: true, status: 200 };
    } catch (error: unknown) {
      console.error("DivisionService.updateDivision error:", error);

      if (error instanceof ZodError) throw new Err(`invalid request data`, 400)
      if (error instanceof Err) throw error

      throw new Err("DivisionService unavailable", 500);
    }
  }

  async deleteDivision(id: string): Promise<ServiceRes> {
    if (!id || typeof id !== "string") throw new Err("invalid request data", 400);

    try {
      await this.divisionRepository.delete(id);

      return {success: true, status: 200}
    } catch (error: unknown) {
      console.error("DivisionService.deleteDivision error:", error);

      if(error instanceof Err) throw error

      throw new Err("DivisionService unavailable", 500)
    }
  }
}
