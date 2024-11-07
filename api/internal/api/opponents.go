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

type OpponentRecord struct {
	OpponentId     int
	OpponentName   string
	Wins           int
	Losses         int
	OpponentRating float64
}

func GetOpponentRecords(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, err := queries.GetOpponentRecords(ctx, int32(id))
	if err != nil {
		println(err)
	}

	var opponentRecords []OpponentRecord
	for _, opponentRecord := range dbRecords {
		opponentRating, _ := opponentRecord.Opponentmostrecentrating.Float64Value()
		record := OpponentRecord{
			OpponentId:     int(opponentRecord.Opponentid),
			OpponentName:   opponentRecord.Opponentname,
			Wins:           int(opponentRecord.Wins),
			Losses:         int(opponentRecord.Losses),
			OpponentRating: opponentRating.Float64,
		}

		opponentRecords = append(opponentRecords, record)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, opponentRecords)

}
