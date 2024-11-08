package main

import (
	"api/internal/api"
	"api/internal/scraper"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron"
)

func main() {
	godotenv.Load()
	scraper.Scraper()
	go func() {
		cronHandler := cron.New()
		cronHandler.AddFunc("0 5 * * * *", scraper.Scraper)
		cronHandler.Start()
	}()

	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://meleeranked.uk/"}
	router.Use(cors.New(config))
	router.GET("/api/leaderboard", api.GetLeaderboard)
	router.GET("/api/ratingHistory/:id", api.GetRatingHistory)
	router.GET("/api/opponentRecords/:id", api.GetOpponentRecords)
	router.GET("/api/matchHistory/:id", api.GetMatchHistory)
	router.GET("/api/recentResults/:id", api.GetRecentResults)
	router.GET("/api/winRateByRatingDifference/:min", api.GetWinRateByRatingDifference)
	router.GET("/api/ratingDistruibtion", api.GetRatingDistribution)
	router.GET("/api/matchesPerQuarter", api.GetMatchesPerQuarter)
	router.GET("/api/eventAttendance", api.GetEventAttendies)

	router.Run()

}
