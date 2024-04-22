import { RatingTitle } from "./RatingTitle";
import { RatingRow } from "./RatingRow";
import { db } from "../../server/db";
import { sql } from "drizzle-orm";

type Player = {
  id: number;
  name: string;
  rating: number;
  rd: number;
  rating_change: number;
  total_match_count: number;
};

export default async function RatingTable() {
  const players: Player[] = await db.execute(sql`
        SELECT
          p.id,
          p.name,
          pr.rating,
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
  return (
    <div className="w-full px-96">
      <RatingTitle />
      {players.map((player: Player, index: number) => {
        return (
          <RatingRow
            key={player.id}
            rank={index + 1}
            name={player.name}
            rating={Math.round(player.rating)}
            rd={Math.round(player.rd)}
            change={Math.round(player.rating_change)}
          />
        );
      })}
    </div>
  );
}
