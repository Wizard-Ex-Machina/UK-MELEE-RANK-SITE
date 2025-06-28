import { relations } from "drizzle-orm/relations";
import { events, matches, tournaments, players, playerAliases, placements, matchCharacters, matchSlot } from "./schema";

export const matchesRelations = relations(matches, ({one, many}) => ({
	event: one(events, {
		fields: [matches.eventId],
		references: [events.eventId]
	}),
	matchCharacters: many(matchCharacters),
	matchSlots: many(matchSlot),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	matches: many(matches),
	tournament: one(tournaments, {
		fields: [events.tournamentId],
		references: [tournaments.tournamentId]
	}),
	placements: many(placements),
}));

export const tournamentsRelations = relations(tournaments, ({many}) => ({
	events: many(events),
}));

export const playerAliasesRelations = relations(playerAliases, ({one}) => ({
	player: one(players, {
		fields: [playerAliases.playerId],
		references: [players.playerId]
	}),
}));

export const playersRelations = relations(players, ({many}) => ({
	playerAliases: many(playerAliases),
	placements: many(placements),
	matchCharacters: many(matchCharacters),
	matchSlots: many(matchSlot),
}));

export const placementsRelations = relations(placements, ({one}) => ({
	event: one(events, {
		fields: [placements.eventId],
		references: [events.eventId]
	}),
	player: one(players, {
		fields: [placements.playerId],
		references: [players.playerId]
	}),
}));

export const matchCharactersRelations = relations(matchCharacters, ({one}) => ({
	match: one(matches, {
		fields: [matchCharacters.matchId],
		references: [matches.matchId]
	}),
	player: one(players, {
		fields: [matchCharacters.playerId],
		references: [players.playerId]
	}),
}));

export const matchSlotRelations = relations(matchSlot, ({one}) => ({
	match: one(matches, {
		fields: [matchSlot.matchId],
		references: [matches.matchId]
	}),
	player: one(players, {
		fields: [matchSlot.playerId],
		references: [players.playerId]
	}),
}));