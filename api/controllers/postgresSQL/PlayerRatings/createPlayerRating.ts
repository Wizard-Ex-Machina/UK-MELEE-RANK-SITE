import { pool } from "../../..";

export function createPlayerRating(playerRating: {
  playerId: number;
  rating: number;
  rd: number;
  vol: number;
  period: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO player_ratings (player, rating, rd, vol, period) VALUES ($1, $2, $3, $4, $5)",
      [
        playerRating.playerId,
        playerRating.rating,
        playerRating.rd,
        playerRating.vol,
        playerRating.period,
      ],
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}
