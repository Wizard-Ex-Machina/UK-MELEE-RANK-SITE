import { pgTable, foreignKey, serial, integer, timestamp, unique, check, text, varchar, date, char, bigint, primaryKey, boolean, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const matches = pgTable("matches", {
	matchId: serial("match_id").primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.eventId],
			name: "matches_event_id_fkey"
		}).onDelete("cascade"),
]);

export const tournaments = pgTable("tournaments", {
	tournamentId: serial("tournament_id").primaryKey().notNull(),
	name: text().notNull(),
	postcode: varchar({ length: 8 }),
	endAt: date("end_at").notNull(),
	countryCode: char("country_code", { length: 2 }).notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("tournaments_slug_key").on(table.slug),
	check("tournaments_country_code_check", sql`country_code ~ '^[A-Z]{2}$'::text`),
]);

export const events = pgTable("events", {
	eventId: serial("event_id").primaryKey().notNull(),
	name: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startGgId: bigint("start_gg_id", { mode: "number" }).notNull(),
	tournamentId: integer("tournament_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.tournamentId],
			foreignColumns: [tournaments.tournamentId],
			name: "events_tournament_id_fkey"
		}).onDelete("cascade"),
	unique("events_start_gg_id_key").on(table.startGgId),
]);

export const players = pgTable("players", {
	playerId: serial("player_id").primaryKey().notNull(),
	name: text().notNull(),
	firstAppearance: date("first_appearance").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const playerAliases = pgTable("player_aliases", {
	playerId: integer("player_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startGgId: bigint("start_gg_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.playerId],
			name: "player_aliases_player_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.playerId, table.startGgId], name: "player_aliases_pkey"}),
	unique("player_aliases_start_gg_id_key").on(table.startGgId),
]);

export const placements = pgTable("placements", {
	eventId: integer("event_id").notNull(),
	playerId: integer("player_id").notNull(),
	placement: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.eventId],
			name: "placements_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.playerId],
			name: "placements_player_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.eventId, table.playerId], name: "placements_pkey"}),
	check("placements_placement_check", sql`placement > 0`),
]);

export const matchCharacters = pgTable("match_characters", {
	matchId: integer("match_id").notNull(),
	playerId: integer("player_id").notNull(),
	gameNumber: integer("game_number").notNull(),
	win: boolean().notNull(),
	preRating: numeric("pre_rating"),
	characterId: integer("character_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.matchId],
			name: "match_characters_match_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.playerId],
			name: "match_characters_player_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.matchId, table.playerId, table.gameNumber], name: "match_characters_pkey"}),
	check("match_characters_game_number_check", sql`game_number > 0`),
]);

export const matchSlot = pgTable("match_slot", {
	matchId: integer("match_id").notNull(),
	playerId: integer("player_id").notNull(),
	score: integer().notNull(),
	win: boolean().notNull(),
	r: numeric().notNull(),
	rd: numeric().notNull(),
	sigma: numeric().notNull(),
	delta: numeric().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.matchId],
			name: "match_slot_match_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.playerId],
			name: "match_slot_player_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.matchId, table.playerId], name: "match_slot_pkey"}),
	check("match_slot_score_check", sql`score >= 0`),
]);
