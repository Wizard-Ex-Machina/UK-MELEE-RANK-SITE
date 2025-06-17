package scraper

import (
	"scraper/internal/startgg"

	"github.com/pkg/errors"
)

/**Process a match from start.gg
 * @param match The match to process
 * @param event The event the match is part of
 * @return error If an error occurs
 */
func processMatch(match startgg.Set, event startgg.Tournament) error {
	if !matchConditions(match) {
		return errors.New("match conditions not met")
	}

	// get player info
	player1 := match.Slots[0].Entrant.Participants[0].User
	player2 := match.Slots[1].Entrant.Participants[0].User
	// get player info from db or make new player if not found
	player1db, err := getPlayer(player1.ID)
	if err != nil {
		return errors.Wrap(err, "failed to get player 1")
	}
	player2db, err := getPlayer(player2.ID)
	if err != nil {
		return errors.Wrap(err, "failed to get player 2")
	}
	// do glicko stuff

	// save to database
	return nil
}

func matchConditions(match startgg.Set) bool {
	if !(len(match.Slots[0].Entrant.Participants)+len(match.Slots[1].Entrant.Participants) == 2) {
		return false
	}
	if match.Slots[0].Standing.Stats.Score.Value == -1 {
		return false
	}
	if match.Slots[1].Standing.Stats.Score.Value == -1 {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.ID == match.Slots[1].Entrant.Participants[0].User.ID {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.ID == 0 {
		return false
	}
	if match.Slots[1].Entrant.Participants[0].User.ID == 0 {
		return false
	}
	if match.Slots[0].Standing.Stats.Score.Value == 0 && match.Slots[1].Standing.Stats.Score.Value == 0 {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.Player.GamerTag == "" {
		return false
	}
	if match.Slots[1].Entrant.Participants[0].User.Player.GamerTag == "" {
		return false
	}
	return true
}
