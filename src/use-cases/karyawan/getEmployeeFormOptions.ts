import { Err } from "@/lib/err";
import { createDivisionService } from "@/modules/divisi/division.factory";
import { DivisionService } from "@/modules/divisi/division.service";
import { createPositionService } from "@/modules/jabatan/jabatan.factory";
import { PositionService } from "@/modules/jabatan/jabatan.service";

export function createGetEmployeeFormOptions() {
  return new GetEmployeeFormOptions(
    createDivisionService(),
    createPositionService(),
  );
}

export class GetEmployeeFormOptions {
  constructor(
    private divisionService: DivisionService,
    private positionService: PositionService,
  ) {}

  async execute() {
    try {
      const [division, position] = await Promise.all([
        this.divisionService.getActiveDivisions(),
        this.positionService.getActivePositions(),
      ]);

      return { division, position };
    } catch (error: unknown) {
      console.error("GetEmployeeFormOptions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetEmployeeFormOptions unavailable", 500);
    }
  }
}
