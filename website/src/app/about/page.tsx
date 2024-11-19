import Titlebar from "../_components/Titlebar";
import AboutItem from "../_components/AboutItem";

export default function Home() {
  const randomMessages = [
    "If you are reading this, congratz fuckass you're not illiterate",
    "I kinda doubt anyone checks this page out, but thanks if you do",
    "Send any questions to @WizardExMachina on most platforms",
    "If you wanna complain about this on Twitter, my handle is @WizardExMachina",
  ];
  const randomMessage =
    randomMessages[Math.floor(Math.random() * randomMessages.length)];
  return (
    <>
      <Titlebar
        title="Answers To Your Questions And Nothing Interesting."
        subtitle={randomMessage}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 p-2 xl:p-8">
        <div className="grid grid-cols-1 gap-2">
          <AboutItem
            title="What is this?"
            description="This site tracks the glicko2 rating of all players that have ever played in a UK event that is listed on start GG. This means that the first event that is included in the dataset is Kickstart 5 and for the first year or two of the data it is mostly just majors but later weeklies and monthlies are included as well."
            colorTailwind="bg-gradient-to-r from-emerald-500/25 to-emerald-700/25 border-emerald-500"
          />
          <AboutItem
            title="When Does This Update?"
            description="Unlike the pervious version of this site which I had to run the updates manually and broke after a few months, this site is updates daily at midnight"
            colorTailwind="bg-gradient-to-r from-red-500/25 to-red-700/25 border-red-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <AboutItem
            title="Someone on the list is not from the UK"
            description="This is not a list of people only from the uk, this is a list of people that play in the uk. I have chosen the thershold of 30 sets in the past year as this exculdes most non uk players but includes newer and less active players"
            colorTailwind="bg-gradient-to-r from-teal-500/25 to-teal-700/25 border-teal-500"
          />
          <AboutItem
            title="Why do you inculde weeklies instead of just PR events?"
            description="Most melee takes place at weeklies. If I had chosen to only include PR events then the data would be very sparse."
            colorTailwind="bg-gradient-to-r from-purple-500/25 to-purple-700/25 border-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <AboutItem
            title="Who made this?"
            description="This site was made by @WizardExMachina. If you have any questions or suggestions feel free to message me on bluesky, twitter or discord"
            colorTailwind="bg-gradient-to-r from-sky-500/25 to-sky-700/25 border-sky-500"
          />
          <div></div>
        </div>
      </div>
    </>
  );
}
