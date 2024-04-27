import { db } from "../db";
import { sql } from "drizzle-orm";

export async function getEvents(): Promise<any> {
  return await db.execute(sql`
    SELECT * FROM events ORDER BY end_at ASC
	`);
}
