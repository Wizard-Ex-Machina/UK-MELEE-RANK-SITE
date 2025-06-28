-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "players" (
	"player_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"first_appearance" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_gg_id" integer NOT NULL,
	"tournament_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"match_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"tournament_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"postcode" varchar(8),
	"end_at" date NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "tournaments_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "player_aliases" (
	"player_id" integer NOT NULL,
	"start_gg_id" integer NOT NULL,
	CONSTRAINT "player_aliases_pkey" PRIMARY KEY("player_id","start_gg_id"),
	CONSTRAINT "player_aliases_start_gg_id_key" UNIQUE("start_gg_id")
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"event_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"placement" integer NOT NULL,
	CONSTRAINT "placements_pkey" PRIMARY KEY("event_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"player_id" integer NOT NULL,
	"rating" double precision NOT NULL,
	"rd" double precision NOT NULL,
	"sigma" double precision NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "ratings_pkey" PRIMARY KEY("player_id","date")
);
--> statement-breakpoint
CREATE TABLE "match_slot" (
	"match_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"score" integer NOT NULL,
	"win" boolean NOT NULL,
	"r" numeric NOT NULL,
	"rd" numeric NOT NULL,
	"sigma" numeric NOT NULL,
	"delta" numeric NOT NULL,
	CONSTRAINT "match_slot_pkey" PRIMARY KEY("match_id","player_id")
);
--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_aliases" ADD CONSTRAINT "player_aliases_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_slot" ADD CONSTRAINT "match_slot_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("match_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_slot" ADD CONSTRAINT "match_slot_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE no action ON UPDATE no action;
*/