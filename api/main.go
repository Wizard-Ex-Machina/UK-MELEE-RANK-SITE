package main

import (
	"api/internal/api"
	"api/internal/scraper"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron"
)

func main() {
	godotenv.Load()
	go func() {
		cronHandler := cron.New()
		cronHandler.AddFunc("0 5 * * * *", scraper.Scraper)
		cronHandler.Start()
	}()

	router := gin.Default()

	router.GET("/leaderboard", api.GetLeaderboard)
	router.GET("/ratingHistory/:id", api.GetRatingHistory)
	router.GET("/opponentRecords/:id", api.GetOpponentRecords)
	router.GET("/matchHistory/:id", api.GetMatchHistory)
	router.GET("/recentResults/:id", api.GetRecentResults)
	router.GET("/winRateByRatingDifference/:min", api.GetWinRateByRatingDifference)
	router.GET("/ratingDistruibtion", api.GetRatingDistribution)
	router.GET("/matchesPerQuarter", api.GetMatchesPerQuarter)
	router.GET("/eventAttendance", api.GetEventAttendies)
	router.Run("localhost:8080")

}
