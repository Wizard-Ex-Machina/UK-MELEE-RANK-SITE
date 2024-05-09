package startgg

import (
	"bytes"
	"net/http"
	"fmt"
  "log"
  "io"
  "encoding/json"
  "api/internal/config"
)

type eventRes struct {
	Data struct {
		Tournaments struct {
			Nodes []Tournaments `json:"nodes"`
		} `json:"tournaments"`
	} `json:"data"`
}

type Tournaments struct {
	Id int `json:"id"`
	Name string `json:"name"`
	CountryCode string `json:"countryCode"`
	Events []struct {
		Name string `json:"name"`
		Id int `json:"id"`
	} `json:"events"`
	NumAttendees int `json:"numAttendees"`
	EndAt string `json:"endAt"`
	PostalCode string `json:"postalCode"`
}



func GetEvents() []Tournaments {
	pageLength := 1
	page := 0
	tournaments:= []Tournaments{}
	for pageLength > 0 {

			temp := getEventsPage(page)
			tournaments = append(tournaments, temp.Data.Tournaments.Nodes...)
			pageLength = len(temp.Data.Tournaments.Nodes)
			page += 1

	}
	return tournaments
}

func getEventsPage(page int) eventRes {
	posturl := "https://api.start.gg/gql/alpha"
	body := []byte(fmt.Sprintf(`{
		"query": "query (, $page: Int!) {\n  tournaments(\n    query: {page: $page, perPage:  250, filter: {past: true, countryCode: \"GB\", videogameIds: [1]} }\n  ) {\n    nodes {\n      id\n      name\n      countryCode\n      events {\n        name\n        id\n      }\n      numAttendees\n      endAt\n      postalCode\n    }\n  }\n}\n\n",
		"variables": {
			"page": %d
		}
}`, page))
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
    var responseObject eventRes
    json.Unmarshal(responseData, &responseObject)

    return responseObject
}