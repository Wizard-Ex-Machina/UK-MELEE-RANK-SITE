CREATE TABLE IF NOT EXISTS tournaments (
  tournament_id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  postcode varchar(8),
  end_at date NOT NULL,
  country_code varchar(2) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  start_gg_id int NOT NULL,
  tournament_id int NOT NULL,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
);

CREATE TABLE IF NOT EXISTS players (
  player_id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  first_appearance date NOT NULL
);

CREATE TABLE IF NOT EXISTS placements (
  event_id int NOT NULL,
  player_id int NOT NULL,
  placement int NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  PRIMARY KEY (event_id, player_id)
);

CREATE TABLE IF NOT EXISTS matches (
  match_id SERIAL PRIMARY KEY,
  event_id int NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS match_slot (
  match_id int NOT NULL,
  player_id int NOT NULL,
  score int NOT NULL,
  win BOOLEAN NOT NULL,
  r NUMERIC NOT NULL,
  rd NUMERIC NOT NULL,
  sigma NUMERIC NOT NULL,
  delta NUMERIC NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(match_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  PRIMARY KEY (match_id, player_id)
);

CREATE TABLE IF NOT EXISTS match_characters (
  match_id int NOT NULL,
  player_id int NOT NULL,
  game_number int NOT NULL,
  win BOOLEAN NOT NULL,
  pre_rating NUMERIC,
  character_id int NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(match_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  PRIMARY KEY (match_id, player_id, game_number)
);

CREATE TABLE IF NOT EXISTS player_aliases (
  player_id int NOT NULL,
  start_gg_id int NOT NULL UNIQUE,
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  PRIMARY KEY (player_id, start_gg_id)
);

CREATE TABLE IF NOT EXISTS ratings (
  player_id int NOT NULL,
  rating double precision NOT NULL,
  rd double precision NOT NULL,
  sigma double precision NOT NULL,
  date date NOT NULL,
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  PRIMARY KEY (player_id, date)
);
