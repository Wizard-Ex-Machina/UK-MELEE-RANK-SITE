CREATE TABLE IF NOT EXISTS tournaments (
  tournament_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  postcode VARCHAR(8),
  end_at DATE NOT NULL,
  country_code CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_gg_id BIGINT NOT NULL UNIQUE,
  tournament_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS players (
  player_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  first_appearance DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS placements (
  event_id INT NOT NULL,
  player_id INT NOT NULL,
  placement INT NOT NULL CHECK (placement > 0),
  PRIMARY KEY (event_id, player_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
  match_id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_slot (
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  score INT NOT NULL CHECK (score >= 0),
  win BOOLEAN NOT NULL,
  r NUMERIC NOT NULL,
  rd NUMERIC NOT NULL,
  sigma NUMERIC NOT NULL,
  delta NUMERIC NOT NULL,
  PRIMARY KEY (match_id, player_id),
  FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_characters (
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  game_number INT NOT NULL CHECK (game_number > 0),
  win BOOLEAN NOT NULL,
  pre_rating NUMERIC,
  character_id INT NOT NULL,
  PRIMARY KEY (match_id, player_id, game_number),
  FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
  -- Consider adding FOREIGN KEY (character_id) REFERENCES characters(character_id)
);

CREATE TABLE IF NOT EXISTS player_aliases (
  player_id INT NOT NULL,
  start_gg_id BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (player_id, start_gg_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);
