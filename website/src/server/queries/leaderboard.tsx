import "server-only";
import { db } from "../db";
import { sql } from "drizzle-orm";

export type PlayerForLeaderboard = {
  id: number;
  name: string;
  rating: number;
  last_rating: number;
  rd: number;
  rating_change: number;
  total_match_count: number;
  rankChange?: number;
};

export async function getLeaderBoard(): Promise<PlayerForLeaderboard[]> {
  return await db.execute(sql`
    SELECT
      p.id,
      p.name,
      pr.rating,
      pr_prev.rating AS last_rating,
      pr.rd,
      pr.rating - COALESCE(pr_prev.rating, pr.rating) AS rating_change,
      COALESCE(SUM(match_counts.total_match_count), 0) AS total_match_count
    FROM
      players p
      LEFT JOIN (
        SELECT
          player,
          rating,
          rd,
          ROW_NUMBER() OVER (
            PARTITION BY
              player
            ORDER BY
              period DESC
          ) AS rn
        FROM
          player_ratings
      ) AS pr ON p.id = pr.player
      AND pr.rn = 1
      LEFT JOIN (
        SELECT
          player,
          rating,
          ROW_NUMBER() OVER (
            PARTITION BY
              player
            ORDER BY
              period DESC
          ) AS rn
        FROM
          player_ratings
      ) AS pr_prev ON p.id = pr_prev.player
      AND pr_prev.rn = 2
      LEFT JOIN (
        SELECT
          player_1_id AS player_id,
          COUNT(*) AS total_match_count
        FROM
          matches m
          JOIN events e ON m.event_id = e.melee_id
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
          JOIN events e ON m.event_id = e.melee_id
        WHERE
          e.end_at BETWEEN '2023-04-18' AND '2024-04-18'
        GROUP BY
          player_2_id
      ) AS match_counts ON p.id = match_counts.player_id
    WHERE
      pr.rating IS NOT NULL -- Filter out players with null ratings
    GROUP BY
      p.id,
      p.name,
      pr.rating,
      pr.rd,
      pr_prev.rating
    HAVING
      COALESCE(SUM(match_counts.total_match_count), 0) >= 35
    ORDER BY
      pr.rating DESC
        `);
}
