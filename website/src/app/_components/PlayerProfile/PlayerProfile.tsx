"use client";
import { useEffect, useState } from "react";
import LineGraph from "../../about/LineGraph";
import type { PlayerForLeaderboard } from "../../../server/queries/leaderboard";
import DistGraph from "./DistGraph";

type Props = {
  player: PlayerForLeaderboard;
  players: PlayerForLeaderboard[];
};

export function PlayerProfile(props: Props) {
  const { id, rating } = props.player;
  const [matches, setMatches] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [content, setContent] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`api/?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setRatings(data.data.ratings);
        setMatches(data.data.matches);
        setLoading(false);
      })
      .catch((err) => {
        // Log or display the error message
        console.error("Error fetching data:", err.message);
        setContent([`Error fetching data: ${err.message}`]);
      });
  }, [id]);

  if (isLoading) return;
  // Since `data` is defined below, we use `ratings` to check for profile data existence
  if (!ratings.length) return;

  // your graph data processing and rendering logic here

  const ratingHistory = {
    labels: ratings.map((rating) => {
      return new Date(rating.period)
        .toLocaleDateString()
        .split("/")
        .slice(1, 3)
        .join("/");
    }),
    datasets: [
      {
        label: "Rating Upper Bound",
        data: ratings.map(
          (rating) => Math.round(rating.rating) + Math.round(rating.rd),
        ),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: 1,
        backgroundColor: "#4ade80",
        borderColor: "#4ade80",
        tension: 0.1,
      },
      {
        label: "Rating",
        data: ratings.map((rating) => rating.rating),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: 1,
        backgroundColor: "#f43f5e",

        tension: 0.1,
      },

      {
        label: "Rating Lower Bound",
        data: ratings.map(
          (rating) => Math.round(rating.rating) - Math.round(rating.rd),
        ),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: 1,
        backgroundColor: "#f43f5e",
        borderColor: "#f43f5e",
        tension: 0.1,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Rating History",
      },
    },
  };
  const options2 = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Win Rate History",
      },
    },
  };

  const data = {
    labels: ratings.map((rating) => {
      return new Date(rating.period)
        .toLocaleDateString()
        .split("/")
        .slice(1, 3)
        .join("/");
    }),
    datasets: [
      {
        label: "Win Rate",
        data: ratings.slice(1).map((rating, index) => {
          let total = 0,
            wins = 0;

          matches
            .filter((match) => match.end_at < rating.period)
            .map((match) => {
              if (match.player_1_score === -1 || match.player_2_score === -1)
                return;
              if (match.player_1_id === id) {
                wins = wins + match.player_1_score;
              }
              if (match.player_2_id === id) {
                wins = wins + match.player_2_score;
              }
              total = total + match.player_1_score + match.player_2_score;
            });
          if (total === 0) {
            return;
          }
          return (wins / total) * 100;
        }),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: true,
        backgroundColor: "#4ade80",
        borderColor: "#4ade80",
        tension: 0.1,
      },
    ],
  };
  return (
    <div className="h32 flex w-full rounded-md bg-zinc-200 p-1">
      <div className="gap 4 grid w-full grid-cols-1 lg:grid-cols-3">
        <LineGraph data={ratingHistory} options={options} />
        <LineGraph data={data} options={options2} />
        <DistGraph rating={Math.round(rating)} players={props.players} />
      </div>
    </div>
  );
}
