package main

import (
	api "api/internal/api"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	// scraper.Scraper()
	router := gin.Default()

	router.GET("/leaderboard", api.GetLeaderboard)
	router.GET("/ratingHistory/:id", api.GetRatingHistory)

	router.Run("localhost:8080")

}
