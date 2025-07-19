package startgg

import (
	"encoding/json"
	"io"
	"net/http"
	"scraper/internal/config"
	"strconv"
	"strings"
	"time"
)

type PlacemaentRes struct {
	Data struct {
		Event struct {
			Id        int    `json:"id"`
			Name      string `json:"name"`
			Standings struct {
				Nodes []Placement `json:"nodes"`
			} `json:"standings"`
		} `json:"event"`
	} `json:"data"`
}

type Placement struct {
	Placement int `json:"placement"`
	Entrant   struct {
		Particpants []struct {
			User struct {
				Id     int `json:"id"`
				Player struct {
					GamerTag string `json:"gamerTag"`
				} `json:"player"`
			} `json:"user"`
		} `json:"participants"`
	} `json:"entrant"`
}

func GetPlacements(eventID int) ([]Placement, error) {
	token, _ := config.STARTGG_API_TOKEN()
	pageLength, page, retries := 1, 1, 0
	placements := []Placement{}
	for pageLength > 0 {
		placementsPage, err := getPlacementsPage(eventID, page, token)
		if err == nil {
			placements = append(placements, placementsPage...)
			retries = 0
			page++
			pageLength = len(placementsPage)
		}
		if err != nil {
			if err.Error() == "429" {
				println(strconv.Itoa(eventID) + " page:" + strconv.Itoa(page) + " matches so far:" + strconv.Itoa(len(placements)) + " hit rate limit waiting 5 secs")
				time.Sleep(time.Second * 5)
			} else {
				println(err.Error())
				println(retries)
				if retries > 10 {
					page++
					retries = 0
				}
				retries++
			}
		}

	}
	return placements, nil
}

func getPlacementsPage(eventID int, page int, token string) ([]Placement, error) {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\n  \"query\": \"query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {\\n  event(id: $eventId) {\\n    id\\n    name\\n    standings(query: {\\n      perPage: $perPage,\\n      page: $page\\n    }){\\n      nodes {\\n        placement\\n        entrant {\\n\\t\\t\\t\\t\\tparticipants {\\n\\t\\t\\t\\t\\t\\tuser {\\n\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\n        }\\n      }\\n    }\\n  }\\n},\\n\",\n  \"operationName\": \"EventStandings\",\n  \"variables\": {\n    \"eventId\": " + strconv.Itoa(eventID) + ",\n    \"page\": " + strconv.Itoa(page) + ",\n    \"perPage\": 200\n  }\n}")

	r, _ := http.NewRequest("POST", url, payload)
	r.Header.Add("Authorization", "Bearer "+token)
	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	responseData, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var responseObject PlacemaentRes
	json.Unmarshal(responseData, &responseObject)
	return responseObject.Data.Event.Standings.Nodes, nil
}
