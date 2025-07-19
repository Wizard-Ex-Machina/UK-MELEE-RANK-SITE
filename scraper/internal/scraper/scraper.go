package scraper

import (
	"cmp"
	"context"
	"scraper/internal/config"
	"scraper/internal/postgres"
	"scraper/internal/startgg"
	"slices"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func Scraper() {
	ctx := context.Background()
	dburl, err := config.GLOBAL_DATEBASE_URL()
	if err != nil {
		panic(err)
	}
	db, err := pgx.Connect(ctx, dburl)
	if err != nil {
		panic(err)
	}

	startDate := time.Date(2014, 1, 1, 0, 0, 0, 0, time.UTC)

	qurries := postgres.New(db)

	lastTournament, err := qurries.GetLastTournament(ctx)
	if err == nil {
		startDate = lastTournament.EndAt.Time.AddDate(0, -1, 0)
	}

	events, err := startgg.GetEvents(startDate)
	if err != nil {
		panic(err)
	}
	slices.SortFunc(events, func(a, b startgg.Tournament) int {
		return cmp.Compare(a.EndAt, b.EndAt)
	})

	for _, tournament := range events {
		// create tournament in db
		tournamentDB, tournamenterr := qurries.CreateTournament(ctx, postgres.CreateTournamentParams{Name: tournament.Name, CountryCode: tournament.CountryCode, Postcode: pgtype.Text{String: tournament.PostalCode, Valid: true}, Slug: tournament.Slug, EndAt: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})

		if tournamenterr != nil {
			println(tournamenterr.Error())
			continue
		}

		for _, event := range tournament.Events {
			if event.Videogame.Id == 1 && (slices.Contains([]string{"MELEE", "SINGLES", "SUPER SMASH BROS. MELEE", "SUPER SMASH BROS. MELEE - SINGLES"}, strings.ToUpper(event.Name)) || strings.Contains(strings.ToUpper(event.Name), "MELEE SINGLES")) {
				// Process event
				// create event in db
				eventDB, err := qurries.CreateEvent(ctx, postgres.CreateEventParams{Name: event.Name, StartGgID: int64(event.Id), TournamentID: tournamentDB.TournamentID})
				if err != nil {
					println(err.Error())
					continue
				}

				matches, err := startgg.GetMatches(event.Id)
				if err != nil {
					// Handle error
					continue
				}
				for _, match := range matches {
					// Process match
					matchErr := processMatch(match, eventDB.EventID, tournament.EndAt, qurries, ctx)
					if matchErr != nil {
						if strings.Contains(matchErr.Error(), "match conditions not met") {
							continue
						} else {
							panic(matchErr)
						}

						// Handle error
					}
				}

				placements, err := startgg.GetPlacements(event.Id)
				if err != nil {
					// Handle error
					continue
				}
				for _, placement := range placements {
					// Process placement
					placementErr := processPlacement(placement, eventDB.EventID, qurries, ctx)
					if placementErr != nil {
						if strings.Contains(placementErr.Error(), "placement conditions not met") {
							continue
						} else {
							panic(placementErr)
						}

						// Handle error
					}
				}
			}
		}
	}
}
