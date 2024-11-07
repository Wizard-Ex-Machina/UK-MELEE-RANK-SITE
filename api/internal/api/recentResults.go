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

type Result struct {
	PlayerID       int
	TournamentID   int
	Placement      int
	TouranmentName string
	TotalPlayers   int
}

func GetRecentResults(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, err := queries.GetRecentPlacements(ctx, int32(id))
	if err != nil {
		println(err)
	}

	var results []Result
	for _, match := range dbRecords {
		record := Result{
			PlayerID:       int(match.Playerid),
			TournamentID:   int(match.Tournamentid),
			Placement:      int(match.Placement),
			TouranmentName: match.Tournamentname,
			TotalPlayers:   int(match.Totalplayers),
		}

		results = append(results, record)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, results)

}
