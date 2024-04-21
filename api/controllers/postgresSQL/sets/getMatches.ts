import { pool } from "../../..";

export function getMatches(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM matches", (error: any, results: any) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  });
}
