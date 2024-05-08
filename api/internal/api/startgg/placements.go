package startgg

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type Placement struct {
	Placement int `json:"placement"`
	Entrant   struct {
		Participants[] struct {
			User struct {
				ID     int `json:"id"`
				Player struct {
					GamerTag string `json:"gamerTag"`
					} `json:"player"`
					} `json:"user"`
					} `json:"participants"`
					} `json:"entrant"`
}

func getPlacements(eventID string) Placement[] {

}

func getPlacementsPage(eventID string, page int) Placements[] {

    // HTTP endpoint
	posturl := "https://api.start.gg/gql/alpha"

    // JSON body
	body := []byte(`{
		"title": "Post title",
		"body": "Post description",
		"userId": 1
	}`)

    // Create a HTTP post request
	r, err := http.NewRequest("POST", posturl, bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}


}
