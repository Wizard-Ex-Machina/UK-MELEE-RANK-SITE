import { pool } from "../../..";

export function getplayersWithRatings(appearsBefore: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT p.*, pr.rating, pr.rd, pr.vol, pr.period
      FROM players p
      LEFT JOIN (
          SELECT player, MAX(period) AS max_date
          FROM player_ratings
          GROUP BY player
      ) AS max_dates
      ON p.id = max_dates.player
      LEFT JOIN player_ratings pr
      ON p.id = pr.player AND pr.period = max_dates.max_date
      WHERE p.first_appears < $1`,
      [appearsBefore],
      (error: any, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      },
    );
  });
}
