package scraper

import (
	"context"
	"scraper/internal/postgres"
	"scraper/internal/startgg"
)

func processPlacement(placement startgg.Placement, eventID int32, queries *postgres.Queries, ctx context.Context) error {
	player, err := queries.GetPlayerFromAlias(ctx, int64(placement.Entrant.Particpants[0].User.Id))
	if err != nil {
		if err.Error() == "no rows in result set" {
			return nil
		}
		return err
	}
	_, err2 := queries.CreatePlacement(ctx, postgres.CreatePlacementParams{EventID: eventID, PlayerID: player.PlayerID, Placement: int32(placement.Placement)})
	if err2 != nil {
		return err2
	}
	// Process placement
	return nil
}
