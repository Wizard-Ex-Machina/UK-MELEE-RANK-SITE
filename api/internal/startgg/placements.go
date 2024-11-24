package startgg

import (
	"api/internal/config"
	"encoding/json"
	"io"
	"log"
	"net/http"
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

func GetPlacements(eventID int) []Placement {
	pageLength := 1
	page := 1
	tournaments := []Placement{}
	for pageLength > 0 {
		temp := getPlacementsPage(eventID, page)
		tournaments = append(tournaments, temp.Data.Event.Standings.Nodes...)
		pageLength = len(temp.Data.Event.Standings.Nodes)
		page += 1

		time.Sleep(time.Second * 4 / 5)

	}
	return tournaments
}

func getPlacementsPage(eventID int, page int) PlacemaentRes {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\n  \"query\": \"query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {\\n  event(id: $eventId) {\\n    id\\n    name\\n    standings(query: {\\n      perPage: $perPage,\\n      page: $page\\n    }){\\n      nodes {\\n        placement\\n        entrant {\\n\\t\\t\\t\\t\\tparticipants {\\n\\t\\t\\t\\t\\t\\tuser {\\n\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\n        }\\n      }\\n    }\\n  }\\n},\\n\",\n  \"operationName\": \"EventStandings\",\n  \"variables\": {\n    \"eventId\": " + strconv.Itoa(eventID) + ",\n    \"page\": " + strconv.Itoa(page) + ",\n    \"perPage\": 200\n  }\n}")

	r, _ := http.NewRequest("POST", url, payload)
	r.Header.Add("Authorization", "Bearer "+config.STARTGG_API_TOKEN())
	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	responseData, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	var responseObject PlacemaentRes
	json.Unmarshal(responseData, &responseObject)
	return responseObject
}
