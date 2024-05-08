import { db } from "../db";
import { sql } from "drizzle-orm";

type Props = {
  date: string;
};

export async function getplayersWithRatings(props: Props): Promise<any> {
  return await db.execute(sql`
    SELECT p.*, pr.rating, pr.rd, pr.vol, pr.period
    FROM players p
    LEFT JOIN (
        SELECT player, MAX(period) AS max_date
        FROM player_ratings
        GROUP BY player
    ) AS max_dates
    ON p.id = max_dates.player
    LEFT JOIN player_ratings pr
    ON p.id = pr.player AND pr.period = max_dates.max_date
    WHERE p.first_appears < ${props.date}
	`);
}
