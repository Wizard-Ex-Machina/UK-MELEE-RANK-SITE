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

func GetMatchesPerQuarter(c *gin.Context) {
	type data struct {
		MidDate    string
		MatchCount int
	}
	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, _ := queries.GetMatchesPerQuartrer(ctx)

	var points []data
	for _, dbPoint := range dbRecords {
		year, _ := dbPoint.Year.Int64Value()
		quarter, _ := dbPoint.Quarter.Int64Value()
		midDate := strconv.Itoa(int(year.Int64)) + "-" + strconv.Itoa(int(quarter.Int64*3))
		point := data{
			MidDate:    midDate,
			MatchCount: int(dbPoint.NumberOfMatches),
		}

		points = append(points, point)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, points)

}
