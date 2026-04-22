import { ServiceRes } from "@/types/ServiceTypes";
import { IDepoService } from "./depo.interface";
import { DepoRepository } from "./depo.repository";
import { BaseDepo, DepoForm, DepoFormSchema, DepoIdSchema, DepoTable } from "./depo.schema";
import { Err } from "@/lib/err";
import { ZodError } from "zod";

export class DepoService implements IDepoService {
  constructor(
    private depoRepository: DepoRepository
  ) {}

  async getAllDepo(): Promise<ServiceRes<DepoTable[]>> {
      try {
        const res = await this.depoRepository.getAll();

        return {success: true, status: 200, data: res};
      } catch (error) {
        console.error("DepoService.getAllDepo error:", error);

        if(error instanceof Err) throw error;

        throw new Err("internal server error", 500);
      }
  }

  async createDepo(depoForm: DepoForm): Promise<ServiceRes> {
      try {
        const validatedDepoForm = DepoFormSchema.parse(depoForm);

        await this.depoRepository.create(validatedDepoForm);

        return {success: true, status: 200}
      } catch (error) {
        console.error("DepoService.createDepo error:", error);

        if(error instanceof Err) throw error;
        if(error instanceof ZodError) throw new Err("invalid request data", 500);

        throw new Err("internal server error", 500);
      }
  }

  async updateDepo(depoForm: DepoForm, depoId: BaseDepo["id"]): Promise<ServiceRes> {
      try {
        const validatedDepoForm = DepoFormSchema.parse(depoForm);
        const validatedDepoId = DepoIdSchema.parse(depoId);

        await this.depoRepository.update(validatedDepoForm, validatedDepoId);

        return {success: true, status: 200}
      } catch (error) {
        console.error("DepoService.updateDepo erroe:", error);

        if(error instanceof Err) throw error;
        if(error instanceof ZodError) throw new Err("invalid request data", 500);

        throw new Err("internal server error", 500)
      }
  }

  async deleteDepo(depoId: BaseDepo["id"]): Promise<ServiceRes> {
      try {
        const validatedDepoId = DepoIdSchema.parse(depoId);

        await this.depoRepository.delete(validatedDepoId);

        return {success: true, status: 200}
      } catch (error) {
        console.error("DepoService.deleteDepo erroe:", error);

        if(error instanceof Err) throw error;
        if(error instanceof ZodError) throw new Err("invalid request data", 500);

        throw new Err("internal server error", 500)
      }
  }
}