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

type Match struct {
	MatchID       int
	PlayerID      int
	OpponentID    int
	OpponentName  string
	PlayerScore   int
	OpponentScore int
	RatingChange  float64
	PlayerWin     bool
}

func GetMatchHistory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, err := queries.GetMatchHistory(ctx, int32(id))
	if err != nil {
		println(err)
	}

	var matches []Match
	for _, match := range dbRecords {
		ratingChange, _ := match.Ratingchange.Float64Value()
		record := Match{
			MatchID:       int(match.Matchid),
			PlayerID:      int(match.Playerid),
			OpponentID:    int(match.Opponentid),
			OpponentName:  match.Opponentname,
			PlayerScore:   int(match.Playerscore),
			OpponentScore: int(match.Opponentscore),
			RatingChange:  ratingChange.Float64,
			PlayerWin:     match.Playerwin,
		}

		matches = append(matches, record)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, matches)

}
