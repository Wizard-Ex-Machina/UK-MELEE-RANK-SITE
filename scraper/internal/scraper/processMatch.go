package scraper

import (
	"context"
	"fmt"
	"scraper/internal/postgres"
	"scraper/internal/startgg"
	"time"

	glicko "github.com/ShewkShewk/go-glicko2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pkg/errors"
)

/*
Process a match from start.gg
  - @param match The match to process
  - @param event The event the match is part of
  - @return error If an error occurs
*/
func processMatch(match startgg.Set, eventID int32, EndAt int, queries *postgres.Queries, ctx context.Context) error {
	matchConditionsErr := matchConditions(match)
	if matchConditionsErr != nil {
		return errors.Wrap(matchConditionsErr, "match conditions not met")
	}
	// get player info
	player1 := match.Slots[0].Entrant.Participants[0].User
	player2 := match.Slots[1].Entrant.Participants[0].User
	// get player info from db or make new player if not found
	player1db, err := getPlayer(player1.ID, EndAt, player1.Player.GamerTag, queries, ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get player 1")
	}
	player2db, err2 := getPlayer(player2.ID, EndAt, player2.Player.GamerTag, queries, ctx)
	if err2 != nil {
		return errors.Wrap(err2, "failed to get player 2")
	}

	//get most recent match
	player1glicko, err := makeGlickoPlayer(player1db.PlayerID, queries, ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get player 1 glicko")
	}
	player2glicko, err := makeGlickoPlayer(player2db.PlayerID, queries, ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get player 2 glicko")
	}
	oldR1 := player1glicko.Rating().R()
	oldR2 := player2glicko.Rating().R()

	rp := glicko.NewRatingPeriod()

	rp.AddPlayer(player1glicko)
	rp.AddPlayer(player2glicko)

	for i := 0; i < match.Slots[0].Standing.Stats.Score.Value; i++ {
		rp.AddMatch(player1glicko, player2glicko, 1)
	}
	for i := 0; i < match.Slots[1].Standing.Stats.Score.Value; i++ {
		rp.AddMatch(player2glicko, player1glicko, 1)
	}
	rp.Calculate()
	matchDB, err := queries.CreateMatch(ctx, eventID)
	if err != nil {
		return errors.Wrap(err, "Failed to create match:")
	}
	slot1err := saveMatchSlot(player1db.PlayerID, matchDB.MatchID, int32(match.Slots[0].Standing.Stats.Score.Value), match.Slots[0].Standing.Stats.Score.Value > match.Slots[1].Standing.Stats.Score.Value, player1glicko, oldR1, ctx, queries)
	if slot1err != nil {
		return slot1err
	}
	slot2err := saveMatchSlot(player2db.PlayerID, matchDB.MatchID, int32(match.Slots[1].Standing.Stats.Score.Value), match.Slots[1].Standing.Stats.Score.Value > match.Slots[0].Standing.Stats.Score.Value, player2glicko, oldR2, ctx, queries)
	if slot2err != nil {
		return slot2err
	}
	if len(match.Games) > 0 && oldR1 != 2500 && oldR2 != 2500 {
		for i, game := range match.Games {
			if len(game.Selections) > 0 {
				for _, selection := range game.Selections {
					w := game.WinnerID == selection.Entrant.Participants[0].User.ID
					player := player1db
					oldR := oldR1
					if len(selection.Entrant.Participants) > 0 {
						if selection.Entrant.Participants[0].User.ID != match.Slots[0].Entrant.Participants[0].User.ID {
							player = player2db
							oldR = oldR2
						}
						queries.CreateCharacterData(ctx, postgres.CreateCharacterDataParams{
							PlayerID:    player.PlayerID,
							MatchID:     matchDB.MatchID,
							GameNumber:  int32(i),
							CharacterID: int32(selection.Character.ID),
							Win:         w,
							PreRating:   convertFloatToPgtypeNumeric(oldR),
						})
					}
				}
			}
		}
	}
	return nil
}

func saveMatchSlot(playerID int32, matchID int32, score int32, win bool, glickoPlayer *glicko.Player, oldRating float64, ctx context.Context, queries *postgres.Queries) error {

	_, err := queries.CreateMatchSlot(ctx, postgres.CreateMatchSlotParams{
		MatchID:  matchID,
		PlayerID: playerID,
		Score:    score,
		Win:      win,
		R:        convertFloatToPgtypeNumeric(glickoPlayer.Rating().R()),
		Rd:       convertFloatToPgtypeNumeric(glickoPlayer.Rating().Rd()),
		Sigma:    convertFloatToPgtypeNumeric(glickoPlayer.Rating().Sigma()),
		Delta:    convertFloatToPgtypeNumeric(glickoPlayer.Rating().R() - oldRating),
	})
	if err != nil {
		return errors.Wrap(err, "Failed to create match slot:")
	}

	return nil
}

func convertFloatToPgtypeNumeric(f float64) pgtype.Numeric {
	var e pgtype.Numeric
	e.Scan(fmt.Sprintf("%f", f))
	return e
}

func makeGlickoPlayer(id int32, queries *postgres.Queries, ctx context.Context) (*glicko.Player, error) {
	lastMatchSlot, err := queries.GetMostRecentMatchForPlayer(ctx, id)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return glicko.NewPlayer(glicko.NewRating(float64(2500), float64(300), float64(0.05))), nil
		}
		return nil, errors.Wrap(err, "failed to get player's last match")
	}
	r, err := lastMatchSlot.R.Float64Value()
	if err != nil {
		return nil, errors.Wrap(err, "failed in makeGlickoPlayer")
	}
	rd, err := lastMatchSlot.Rd.Float64Value()
	if err != nil {
		return nil, errors.Wrap(err, "failed in makeGlickoPlayer")
	}
	sigma, err := lastMatchSlot.Sigma.Float64Value()
	if err != nil {
		return nil, errors.Wrap(err, "failed in makeGlickoPlayer")
	}

	return glicko.NewPlayer(glicko.NewRating(r.Float64, rd.Float64, sigma.Float64)), nil
}

func getPlayer(ID int, endAt int, gamerTag string, queries *postgres.Queries, ctx context.Context) (*postgres.Player, error) {
	player, err := queries.GetPlayerFromAlias(ctx, int64(ID))
	if err != nil {
		if err.Error() == "no rows in result set" {
			err = nil
			player, err := queries.CreatePlayer(ctx, postgres.CreatePlayerParams{Name: gamerTag, StartGgID: int64(ID), FirstAppearance: pgtype.Date{Time: time.Unix(int64(endAt), 0), Valid: true}})
			if err != nil {
				return nil, errors.Wrap(err, "failed to create player")
			}
			return &postgres.Player{Name: player.Name, FirstAppearance: player.FirstAppearance, PlayerID: player.PlayerID}, nil
		} else {
			return nil, errors.Wrap(err, "failed to get player")
		}
	}
	return &player, nil
}

func matchConditions(match startgg.Set) error {
	if !(len(match.Slots[0].Entrant.Participants)+len(match.Slots[1].Entrant.Participants) == 2) {
		return errors.New("invalid number of participants")
	}
	if match.Slots[0].Standing.Stats.Score.Value == -1 {
		return errors.New("invalid score")
	}
	if match.Slots[1].Standing.Stats.Score.Value == -1 {
		return errors.New("invalid score")
	}
	if match.Slots[0].Entrant.Participants[0].User.ID == match.Slots[1].Entrant.Participants[0].User.ID {
		return errors.New("same player")
	}
	if match.Slots[0].Entrant.Participants[0].User.ID == 0 {
		return errors.New("invalid player")
	}
	if match.Slots[1].Entrant.Participants[0].User.ID == 0 {
		return errors.New("invalid player")
	}
	if match.Slots[0].Standing.Stats.Score.Value == 0 && match.Slots[1].Standing.Stats.Score.Value == 0 {
		return errors.New("invalid score")
	}
	if match.Slots[0].Entrant.Participants[0].User.Player.GamerTag == "" {
		return errors.New("invalid player")
	}
	if match.Slots[1].Entrant.Participants[0].User.Player.GamerTag == "" {
		return errors.New("invalid player")
	}
	return nil
}
