import { Err } from "@/lib/err";
import { divisionService } from "@/modules/master/divisi/division.factory";
import { ActiveDivision } from "@/modules/master/divisi/division.schema";
import { DivisionService } from "@/modules/master/divisi/division.service";
import { positionService } from "@/modules/master/jabatan/jabatan.factory";
import { ActivePosition } from "@/modules/master/jabatan/jabatan.schema";
import { PositionService } from "@/modules/master/jabatan/jabatan.service";

class GetEmployeeFormOptions {
  constructor(
    private divisionService: DivisionService,
    private positionService: PositionService,
  ) {}

  async execute(): Promise<{
    activeDivision: ActiveDivision[];
    activePosition: ActivePosition[];
  }> {
    try {
      const [division, position] = await Promise.all([
        this.divisionService.getActiveDivisions(),
        this.positionService.getActivePositions(),
      ]);

      const activeDivision = division.data ?? [];
      const activePosition = position.data ?? [];

      return { activeDivision, activePosition };
    } catch (error: unknown) {
      console.error("GetEmployeeFormOptions error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetEmployeeFormOptions unavailable", 500);
    }
  }
}

export const getEmployeeFormOptions = new GetEmployeeFormOptions(
  divisionService,
  positionService,
);
