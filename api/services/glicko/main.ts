import { log } from "console";
import { createRatingsForPeriod } from "./glicko";
import { addDays } from "../../util/addDays";

export async function main() {
  let startDate = new Date("2016-01-01");
  const finalDate = new Date();
  const interval = 28;
  log(finalDate.toDateString());
  while (addDays(startDate, interval) < finalDate) {
    const endDate = addDays(startDate, interval);

    await createRatingsForPeriod({
      start: startDate.toDateString(),
      end: endDate.toDateString(),
    });
    startDate = addDays(startDate, interval);
  }
}
