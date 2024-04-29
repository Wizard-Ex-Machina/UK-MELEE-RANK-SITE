import { db } from "../db";
import { sql } from "drizzle-orm";

export type PlayerWithRanking = {
  id: number;
  name: string;
  rating: number;
  rd: number;
};

export async function playersWithRanking(): Promise<PlayerWithRanking[]> {
  return await db.execute(sql`
    SELECT
        p.id, p.name, pr.rating, pr.rd
    FROM
        players p
    LEFT JOIN (
        SELECT
            player_1_id AS player_id,
            COUNT(*) AS total_match_count
        FROM
            matches m
        JOIN
            events e ON m.event_id = e.melee_id
        WHERE
            e.end_at BETWEEN '2023-04-18' AND '2024-04-18'
        GROUP BY
            player_1_id
        UNION ALL
        SELECT
            player_2_id AS player_id,
            COUNT(*) AS total_match_count
        FROM
            matches m
        JOIN
            events e ON m.event_id = e.melee_id
        WHERE
            e.end_at BETWEEN '2023-04-18' AND '2024-04-18'
        GROUP BY
            player_2_id
    ) AS match_counts ON p.id = match_counts.player_id
    LEFT JOIN (
        SELECT player, MAX(period) AS max_date
        FROM player_ratings
        GROUP BY player
    ) AS max_dates ON p.id = max_dates.player
    LEFT JOIN player_ratings pr ON p.id = pr.player AND pr.period = max_dates.max_date
    GROUP BY
        p.id, pr.rating, pr.rd, pr.vol, pr.period
    HAVING
        COALESCE(SUM(match_counts.total_match_count), 0) >= 35
    ORDER BY
      pr.rating DESC
	`);
}
