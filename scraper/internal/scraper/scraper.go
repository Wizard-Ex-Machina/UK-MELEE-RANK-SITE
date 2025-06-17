package scraper

import (
	"scraper/internal/startgg"
)

func Scraper() {
	events, err := startgg.GetEvents()
	if err != nil {
		// Handle error
		return
	}

	for _, event := range events {
		// Process event
		matches, err := startgg.GetMatches(event.Id)
		if err != nil {
			// Handle error
			continue
		}
		for _, match := range matches {
			// Process match
			err := processMatch(match, event)
			if err != nil {
				// Handle error
				continue
			}
		}
	}

}
