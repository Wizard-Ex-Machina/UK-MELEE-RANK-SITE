package api

import (
	"api/internal/config"
	"api/internal/postgres"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type ratingHistoryItem struct {
	TournamentName string
	Rating         float64
	Date           string
}

func GetRatingHistory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	ratingHistory, err := queries.GetRatingHistory(ctx, int32(id))
	if err != nil {
		println(err)
	}

	var ratingHistoryItems []ratingHistoryItem
	for _, rating := range ratingHistory {
		R, _ := rating.Rating.Float64Value()
		ratingHistoryItems = append(ratingHistoryItems, ratingHistoryItem{
			TournamentName: rating.Tournamentname,
			Rating:         R.Float64,
			Date:           rating.Tournamentdate.Time.String(),
		})
	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, ratingHistoryItems)

}
