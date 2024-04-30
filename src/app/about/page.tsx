import RatingGraph from "../_components/ratingGraph";
import WinRateGraph from "./WinRateGraph";
import PlayerDistributionGraph from "./PlayerDistributionGraph";

export default async function About() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900 p-8 text-white">
      <div className="flex w-full flex-col items-center justify-center px-8 lg:px-96">
        <article className="prose prose-invert lg:w-3/5">
          <h1>FAQ</h1>
          <h2>What is this?</h2>
          <p>
            This site tracks the glicko2 rating of all players that have ever
            played in a UK event that is listed on start GG. This means that the
            first event that is included in the dataset is Kickstart 5 and for
            the first year or two of the data it is mostly just majors but later
            weeklies and monthlies are included as well.
          </p>
          <h2>When does it update?</h2>
          <p>
            The site updates on the first of every month to try and keep the
            data up to date with enough matches in each rating period to get a
            good rating for each player.
          </p>
          <h2>[Player] is not from the UK why are they on the list?</h2>
          <p>
            The inculdes all players that have played at least 35 sets in the UK
            in the past year. This is to try and include all players that are
            active in the UK scene and to avoid including players that are not
            active in the UK scene, however, this does mean that some players
            that are not from the UK are included.
          </p>
          <h2>Why inculde weeklies?</h2>
          <p>
            A large part of the reason that I made this tool is to try to track
            the improvement of players over time especially those that are not
            top players. As many players that I wish to track the progress of
            rarely attend majors most of the data on them comes from weeklies
            instead.
          </p>
          <h2>Why is [Player] above [Player]?</h2>
          <p>
            All ratings have 2 parts to them the rating itself and the rd or
            rating deviation which is a measure of how confident we are in the
            rating. When shown together on the chart below you can see that
            there is a lot of overlap between players' ratings and therefore
            either one of them could be the better player. However, it is still
            useful when looking at larger gaps in skill.
          </p>
          <div className="min-h-96">
            <RatingGraph />
          </div>
          <h2>What does x rating mean?</h2>
          <p>
            Below is a graph showing the expected win rate of a player with an
            average rating of 1335 against a player with a rating of x. This is
            based on the glicko2 formula and is not a perfect representation of
            the win rate but it is a good approximation.
          </p>
          <WinRateGraph />
          <h2>How are players distributed?</h2>
          <PlayerDistributionGraph />
          <h2>Why is Tony Bomboni on the list twice?</h2>
          <p>He is simply that powerful.</p>
          <p>
            The real answer is, from what I can tell Tony Bomboni lost his
            startGG account and had to make a new one, this is why he is on the
            list twice. It should resolve itself over time as the old account
            will be removed from the list once it has dropped below the activity
            threshold.
          </p>
          <h2>Other Questions</h2>
          <p>
            If you have any other questions feel free to ask me @WizardExMachina
            on Twitter or Discord
          </p>
          <h1>Future Goals</h1>
          <h2>Deeper integration with startGG</h2>
          <p>
            I wish to provide a tool for TOs in the UK to try and help with
            seeding players in pools. While I would expect that the top players
            may require manual seeding I think that in lower tiers of players,
            this tool could be very useful as they often go unseeded.
          </p>
          <p>
            I also would like the tool to avoid having players who have played a
            lot recently being in the same pool, such as players who attend the
            same weeklies.
          </p>
          <h2>H2H stats</h2>
          <p>
            I would also like to provide a tool to show the head-to-head stats
            between 2 players and the way they have been trending over time.
            These stats would include Game, BO3, and BO5 win rates their rating
            over time and a list of events that they faced each other at.
          </p>
        </article>
      </div>
    </main>
  );
}
