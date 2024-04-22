import {
  pgTable,
  integer,
  text,
  date,
  foreignKey,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const players = pgTable("players", {
  id: integer("id").primaryKey().notNull(),
  name: text("name"),
  startGgId: integer("start_gg_id"),
  firstAppears: date("first_appears"),
});

export const matches = pgTable("matches", {
  id: integer("id").primaryKey().notNull(),
  eventId: integer("event_id").references(() => events.meleeId, {
    onDelete: "cascade",
  }),
  player1Id: integer("player_1_id").references(() => players.id, {
    onDelete: "cascade",
  }),
  player2Id: integer("player_2_id").references(() => players.id, {
    onDelete: "cascade",
  }),
  player1Score: integer("player_1_score"),
  player2Score: integer("player_2_score"),
  startGgId: text("start_gg_id"),
});

export const playerRatings = pgTable("player_ratings", {
  id: integer("id").primaryKey().notNull(),
  rating: numeric("rating"),
  rd: numeric("rd"),
  vol: numeric("vol"),
  period: date("period"),
  player: integer("player").references(() => players.id),
});

export const events = pgTable("events", {
  id: integer("id").primaryKey().notNull(),
  startGgId: integer("start_gg_id"),
  name: text("name"),
  meleeId: integer("melee_id"),
  endAt: date("end_at"),
  postalCode: text("postal_code"),
});
