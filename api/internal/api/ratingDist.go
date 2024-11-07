package api

import (
	"api/internal/config"
	"api/internal/postgres"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/jackc/pgx/v5"
)

type data struct {
	RatingRange int
	Frequency   int
}

func GetRatingDistribution(c *gin.Context) {

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, _ := queries.GetRatingDistribution(ctx)

	var points []data
	for _, dbPoint := range dbRecords {

		point := data{
			RatingRange: int(dbPoint.Ratingmidpoint),
			Frequency:   int(dbPoint.Playercount),
		}

		points = append(points, point)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, points)

}
