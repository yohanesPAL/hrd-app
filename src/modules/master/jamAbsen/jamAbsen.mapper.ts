import { JamAbsenForm, JamAbsenFormDB, JamAbsenTable, JamAbsenTableSchema } from "./jamAbsen.schema";

/**
 * Converts a time in minutes to a clock string in "HH:MM" format.
 *
 * @param {number} time - The time in minutes.
 * @returns {string} The formatted clock string in 24-hour format (HH:MM).
 *
 * @example timeToClock(150) // returns "02:30"
 */
function timeToClock(time: number): string {
  const hours = String(Math.floor(time / 60)).padStart(2, "0");
  const minutes = String(time % 60).padStart(2, "0");
  return `${hours}:${minutes}`
}

/**
 * Converts a clock time string (HH:mm) into total minutes.
 *
 * @param {string} clock - Time in "HH:mm" format (e.g., "14:30").
 * @returns {number} Total time in minutes since 00:00.
 *
 * @example
 * clockToTime("02:30"); // 150
 * clockToTime("14:00"); // 840
 */
function clockToTime(clock: string): number {
  const [hours, minutes] = clock.split(":").map(Number);
  return hours * 60 + minutes;
}

export class JamAbsenMapper {
  static toTableRows(dbRows: any[]): JamAbsenTable[] {
    return JamAbsenTableSchema.array().parse(
      dbRows.map((item, index) => ({
        ...item,
        no: index + 1,
        masuk: timeToClock(item.masuk),
        keluar: timeToClock(item.keluar),
        keluar_sabtu: timeToClock(item.keluar_sabtu),
      }))
    )
  }

  static toPersistence(jamAbsenForm: JamAbsenForm): JamAbsenFormDB {
    return {
      id: jamAbsenForm.id,
      masuk: clockToTime(jamAbsenForm.masuk),
      keluar: clockToTime(jamAbsenForm.keluar),
      keluar_sabtu: clockToTime(jamAbsenForm.keluar_sabtu),
    }
  }
}