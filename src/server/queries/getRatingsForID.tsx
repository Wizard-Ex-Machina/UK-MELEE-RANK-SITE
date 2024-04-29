import { db } from "../db";
import { sql } from "drizzle-orm";

export type rating = {
  rating: number;
  rd: number;
  period: Date;
};

export async function getRatingsForId(id: number): Promise<rating[]> {
  return await db.execute(sql`
    SELECT rating, rd, period from player_ratings WHERE player = ${id}

	`);
}
