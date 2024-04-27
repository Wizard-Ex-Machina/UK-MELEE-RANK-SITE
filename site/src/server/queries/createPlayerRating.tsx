import { db } from "../db";
import { sql } from "drizzle-orm";

export async function createPlayerRating(props: {
  playerId: number;
  rating: number;
  rd: number;
  vol: number;
  period: string;
}): Promise<any> {
  return await db.execute(sql`
    INSERT INTO player_ratings (player, rating, rd, vol, period) VALUES (${props.playerId}, ${props.rating}, ${props.rd}, ${props.vol}, ${props.period})
	`);
}
