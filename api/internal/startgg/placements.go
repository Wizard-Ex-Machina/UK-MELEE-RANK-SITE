package startgg

import (
	"bytes"
	"net/http"
  "log"
  "io"
  "encoding/json"
  "api/internal/config"
  "strconv"
)

type PlacemaentRes struct {
	Data struct {
		Event struct {
			Id int `json:"id"`
			Name string `json:"name"`
			Standings struct {
				Nodes []Placement `json:"nodes"`
			} `json:"standings"`
		} `json:"event"`
	} `json:"data"`
}

type Placement struct {
	Placement int `json:"placement"`
	Entrant struct {
		Particpants []struct {
			User struct {
				Id int `json:"id"`
				Player struct {
					GamerTag string `json:"gamerTag"`
				} `json:"player"`
			} `json:"user"`
		} `json:"participants"`
	} `json:"entrant"`
}


func GetPlacements(eventID int) []Placement {
	pageLength := 1
	page := 0
	tournaments:= [] Placement{}
	for pageLength > 0 {
			temp := getPlacementsPage(eventID, page)
			tournaments = append(tournaments, temp.Data.Event.Standings.Nodes...)
			pageLength = len(temp.Data.Event.Standings.Nodes)
			page += 1
	}
	return tournaments
}

func getPlacementsPage(eventID int, page int) PlacemaentRes {
	posturl := "https://api.start.gg/gql/alpha"
	body := []byte(`{
		"query": "query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {\n  event(id: $eventId) {\n    id\n    name\n    standings(query: {\n      perPage: $perPage,\n      page: $page\n    }){\n      nodes {\n        placement\n        entrant {\n          participants {\n              user {\n                id\n                player {\n                  gamerTag\n                }\n              }\n            }\n        }\n      }\n    }\n  }\n}",
		"operationName": "EventStandings",
		"variables": "{\n  \"eventId\":`+ strconv.Itoa(eventID) +`,\n  \"page\":` + strconv.Itoa(page) + `,\n  \"perPage\": 195}"
}`)
	r, err := http.NewRequest("POST", posturl, bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}
	r.Header.Add("Authorization", "Bearer " + config.STARTGG_API_TOKEN())
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
