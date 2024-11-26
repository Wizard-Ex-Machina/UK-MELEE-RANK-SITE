package api

import (
	"api/internal/config"
	"api/internal/postgres"
	"cmp"
	"context"
	"fmt"
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	_ "github.com/lib/pq"
)

type leaderboardItem struct {
	PlayerID   int32
	Name       string
	Rank       int64
	RankDiff   int64
	R          float64
	Rd         float64
	Delta      float64
	Percentile float64
}

func GetLeaderboard(c *gin.Context) {
	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		fmt.Println(err)
	}

	queries := postgres.New(db)
	currentLeaderboard, err := queries.CurrentLeaderboard(ctx)
	if err != nil {
		fmt.Println(err)
	}
	lastLeaderboard, err := queries.LastWeekLeaderboard(ctx)
	if err != nil {
		fmt.Println(err)
	}
	var leaderboard []leaderboardItem
	slices.SortFunc(lastLeaderboard, func(a, b postgres.LastWeekLeaderboardRow) int {
		return cmp.Compare(a.Playerid, b.Playerid)
	})

	for i := range currentLeaderboard {
		n, found := slices.BinarySearchFunc(lastLeaderboard, currentLeaderboard[i], func(a postgres.LastWeekLeaderboardRow, b postgres.CurrentLeaderboardRow) int {
			return cmp.Compare(a.Playerid, b.Playerid)
		})
		if !found {

			R, _ := currentLeaderboard[i].R.Float64Value()
			OldR, _ := lastLeaderboard[n].R.Float64Value()
			Delta := R.Float64 - OldR.Float64
			RankDiff := lastLeaderboard[n].Rank - currentLeaderboard[i].Rank
			Rd, _ := currentLeaderboard[i].Rd.Float64Value()

			leaderboard = append(leaderboard, leaderboardItem{
				PlayerID:   currentLeaderboard[i].Playerid,
				Name:       currentLeaderboard[i].Name,
				Rank:       currentLeaderboard[i].Rank,
				RankDiff:   RankDiff,
				R:          R.Float64,
				Rd:         Rd.Float64,
				Delta:      Delta,
				Percentile: float64(i+1) / float64(len(currentLeaderboard)) * 100,
			})
		}
	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, leaderboard)
}
