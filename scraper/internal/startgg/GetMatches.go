package startgg

import (
	"github.com/machinebox/graphql"
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

func GetMatches(client *graphql.Client, eventID int, token string) ([]Match, error) {
	return nil, nil
}

func getMatchesPage(client *graphql.Client, eventID int, page int, token string) ([]Match, error) {
	req := graphql.NewRequest(`
		query {
			event(id: $eventID) {
				sets(page: $page, perPage: 50, sort: "CALL_ORDER") {
					nodes {
						games {
							winnerId
							orderNum
							selections {
								entrant {
									id
									participants{
										user{
											id
										}
									}
								}
								character {
									id
								}
							}
						}
						slots {
							entrant {
								participants {
									user {
										id
										player {
											gamerTag
										}

									}
								}
							}
							standing {
								stats {
									score {
										value
									}
								}
							}
						}
					}
				}
			}
		}
	`)
	req.Var("eventID", eventID)
	req.Var("page", page)
	req.Header.Set("Authorization", "Bearer "+token)

	return nil, nil

}
