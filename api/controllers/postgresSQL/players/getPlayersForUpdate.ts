import { pool } from "../../..";

export function getPlayersForUpdate(
  firstAppearanceBefore: string,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM players WHERE first_appears < $1",
      [firstAppearanceBefore],
      (error: any, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      },
    );
  });
}
