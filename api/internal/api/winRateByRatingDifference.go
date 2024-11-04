package api

import (
	"api/internal/config"
	"api/internal/postgres"
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type Point struct {
	RatingRange int
	WinRate     float64
}

func ConvertFloatToPgtypeNumeric(f float64) pgtype.Numeric {
	var e pgtype.Numeric
	e.Scan(fmt.Sprintf("%f", f))
	return e
}

func GetWinRateByRatingDifference(c *gin.Context) {
	min, err := strconv.Atoi(c.Param("min"))

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, _ := queries.GetWinRateByRatingDifference(ctx, ConvertFloatToPgtypeNumeric(float64(min)))

	var points []Point
	for _, dbPoint := range dbRecords {
		winRate, _ := dbPoint.Winrate.Float64Value()

		ratingRange, _ := strconv.Atoi(dbPoint.Ratingrange)
		point := Point{
			RatingRange: ratingRange,
			WinRate:     winRate.Float64,
		}

		points = append(points, point)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, points)

}
