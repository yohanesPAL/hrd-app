import { Err } from "@/lib/err";
import { createJamAbsenService } from "@/modules/master/jamAbsen/jamAbsen.factory";
import { BaseJamAbsen } from "@/modules/master/jamAbsen/jamAbsen.schema";
import { JamAbsenService } from "@/modules/master/jamAbsen/jamAbsen.service";

export function createGetJamAbsenForImport() {
  return new GetJamAbsenForImport(createJamAbsenService());
}

type JamAbsen = Omit<BaseJamAbsen, "id" | "divisi">;

class GetJamAbsenForImport {
  constructor(private jamAbsenService: JamAbsenService) {}

  async execute() {
    try {
      const jamAbsen = await this.jamAbsenService.getBaseJamAbsen()

      const jamAbsenMap = new Map<string, JamAbsen>();
      jamAbsen.forEach((item) =>
        jamAbsenMap.set(String(item.divisi), {
          masuk: item.masuk,
          keluar: item.keluar,
          keluar_sabtu: item.keluar_sabtu,
        }),
      );

      return jamAbsenMap ;
    } catch (error: unknown) {
      console.error("GetJamAbsenForImport error:", error);

      if (error instanceof Err) throw error;

      throw new Err("GetJamAbsenForImport unavailable", 500);
    }
  }
}
