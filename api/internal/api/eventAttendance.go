package api

import (
	"api/internal/config"
	"api/internal/postgres"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type Event struct {
	EventDate      string
	TouranmentID   int
	TouranmentName string
	TotalPlayers   int
}

func GetEventAttendies(c *gin.Context) {

	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		println(err)
	}

	queries := postgres.New(db)
	dbRecords, err := queries.GetEventAttendies(ctx)
	if err != nil {
		println(err)
	}
	println(len(dbRecords))

	var events []Event
	for _, event := range dbRecords {
		record := Event{
			EventDate:      event.EventDate.Time.String(),
			TouranmentID:   int(event.ID),
			TouranmentName: event.EventName,
			TotalPlayers:   int(event.NumberOfPlacements),
		}

		events = append(events, record)

	}
	defer db.Close(ctx)
	c.IndentedJSON(http.StatusOK, events)

}
