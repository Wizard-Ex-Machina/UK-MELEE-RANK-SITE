import { db } from "../db";
import { sql } from "drizzle-orm";

export async function getLatestRating(): Promise<any> {
  return await db.execute(sql`
    SELECT * FROM player_ratings ORDER BY period DESC LIMIT 1
	`);
}
