import AttendiesPerEvent from "../_components/_charts/AttendeesPerEvent";
import RatingDifferenceChart from "../_components/_charts/RatingDiffEffect";
import RatingDistribution from "../_components/_charts/ratingDistribution";
import StatsItem from "../_components/StatsItem";
import Titlebar from "../_components/Titlebar";

export const dynamic = "force-dynamic";

export default function Home() {
  const randomMessages = [
    "Send your chart ideas to @WizardExMachina",
    "I bet you like these charts, you filthy perv",
    "The line went down this is the worst day of my life",
    "“Here we have a nerd” ~ David Attenborough upon seeing you looking at this page.",
    "We taught rocks to think, and this is what you use them for?",
  ];

  const randomMessage =
    randomMessages[Math.floor(Math.random() * randomMessages.length)];

  return (
    <>
      <Titlebar
        title="A Collection Of Charts And Stats About The UK Scene As A Whole"
        subtitle={randomMessage}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-2 xl:p-8">
        <StatsItem
          title="Win Rate By Rating Difference"
          colorTailwind="bg-gradient-to-r from-emerald-500/25 to-emerald-700/25 border-emerald-500"
          description="This chart shows the win rate of players based on the rating difference between them and their opponent. This effect remains constistent across all rating brackets."
        >
          <RatingDifferenceChart color="#10b981" />
        </StatsItem>
        <StatsItem
          title="Rating Distribution"
          colorTailwind="bg-gradient-to-r from-violet-500/25 to-violet-700/25 border-violet-500"
          description="This chart shows the distribution of ratings for all players in the UK scene."
        >
          <RatingDistribution color="#8b5cf6" />
        </StatsItem>
        <StatsItem
          title="Attendees Per Event"
          colorTailwind="bg-gradient-to-r from-teal-500/25 to-teal-700/25 border-teal-500"
          description="This chart shows the number of attendees per event over time. It is shown in a logarithmic scale as there are a lot of small events and much fewer large ones."
        >
          <AttendiesPerEvent color="#14b8a6" />
        </StatsItem>
      </div>
    </>
  );
}
