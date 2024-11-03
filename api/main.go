package main

import (
	"api/internal/scraper"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	scraper.Scraper()
	// router := gin.Default()

	// router.GET("/leaderboard", api.GetLeaderboard)
	// router.GET("/ratingHistory/:id", api.GetRatingHistory)
	// router.GET("/opponentRecords/:id", api.GetOpponentRecords)
	// router.GET("/matchHistory/:id", api.GetMatchHistory)
	// router.Run("localhost:8080")

}
