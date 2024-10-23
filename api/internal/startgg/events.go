package startgg

import (
	"api/internal/config"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type eventRes struct {
	Data struct {
		Tournaments struct {
			Nodes []Tournaments `json:"nodes"`
		} `json:"tournaments"`
	} `json:"data"`
}

type Tournaments struct {
	Slug        string `json:"slug"`
	Id          int    `json:"id"`
	Name        string `json:"name"`
	CountryCode string `json:"countryCode"`
	Events      []struct {
		Name      string `json:"name"`
		Id        int    `json:"id"`
		Videogame struct {
			Id int `json:"id"`
		} `json:"videogame"`
	} `json:"events"`
	NumAttendees int    `json:"numAttendees"`
	EndAt        int    `json:"endAt"`
	PostalCode   string `json:"postalCode"`
}

func GetEvents() []Tournaments {
	pageLength := 1
	page := 0
	tournaments := []Tournaments{}
	for pageLength > 0 {

		temp := getEventsPage(page)
		tournaments = append(tournaments, temp.Data.Tournaments.Nodes...)
		pageLength = len(temp.Data.Tournaments.Nodes)
		page += 1
		pageLength = 0
	}
	return tournaments
}

func getEventsPage(page int) eventRes {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\"query\":\"query (, $page: Int!) {\\n  tournaments(\\n    query: {page: $page, perPage:  150, filter: {past: true, countryCode: \\\"GB\\\", videogameIds: [1]} }\\n  ) {\\n    nodes {\\n\\t\\t\\tslug\\n      id\\n      name\\n      countryCode\\n      events {\\n        name\\n        id\\n\\t\\t\\t\\tvideogame {\\n\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t}\\n      }\\n      numAttendees\\n      endAt\\n      postalCode\\n    }\\n  }\\n}\\n\\n\",\"variables\":{\"page\":" + strconv.Itoa(page) + "}}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+config.STARTGG_API_TOKEN())

	res, err := http.DefaultClient.Do(req)

	defer res.Body.Close()
	responseData, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	var responseObject eventRes
	json.Unmarshal(responseData, &responseObject)

	return responseObject
}
