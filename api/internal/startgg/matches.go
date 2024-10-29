package startgg

import (
	"api/internal/config"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type MatchRes struct {
	Data struct {
		Event struct {
			Sets struct {
				Nodes []Match `json:"nodes"`
			} `json:"sets"`
		} `json:"event"`
	} `json:"data"`
}

type Match struct {
	Slots []struct {
		Entrant struct {
			Participants []struct {
				User struct {
					Id     int `json:"id"`
					Player struct {
						GamerTag string `json:"gamerTag"`
					} `json:"player"`
				} `json:"user"`
			} `json:"participants"`
		} `json:"entrant"`
		Standing struct {
			Stats struct {
				Score struct {
					Value int `json:"value"`
				} `json:"score"`
			} `json:"stats"`
		} `json:"standing"`
	} `json:"slots"`
}

func GetMatches(eventID int) []Match {
	pageLength := 1
	page := 1
	matches := []Match{}
	for pageLength > 0 {
		temp := getMatchesPage(eventID, page)
		matches = append(matches, temp.Data.Event.Sets.Nodes...)
		pageLength = len(temp.Data.Event.Sets.Nodes)
		page += 1
		time.Sleep(time.Second / 3)
	}
	return matches
}

func getMatchesPage(eventID int, page int) MatchRes {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\"query\":\"query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {\\n\\tevent(id: $eventId) {\\n\\t\\tsets(page: $page, perPage: $perPage, sortType: STANDARD) {\\n\\t\\t\\tnodes {\\n\\t\\t\\t\\tslots {\\n\\t\\t\\t\\t\\tentrant {\\n\\t\\t\\t\\t\\t\\tparticipants {\\n\\t\\t\\t\\t\\t\\t\\tuser {\\n\\t\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t\\t\\tplayer {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tgamerTag\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\tstanding {\\n\\t\\t\\t\\t\\t\\tstats {\\n\\t\\t\\t\\t\\t\\t\\tscore {\\n\\t\\t\\t\\t\\t\\t\\t\\tvalue\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n}\\n\",\"operationName\":\"EventSets\",\"variables\":\"{\\n\\t\\\"eventId\\\": " + strconv.Itoa(eventID) + ",\\n\\t\\\"page\\\": " + strconv.Itoa(page) + ",\\n\\t\\\"perPage\\\": 45\\n}\"}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+config.STARTGG_API_TOKEN())

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	var responseObject MatchRes
	json.Unmarshal(body, &responseObject)

	return responseObject
}
