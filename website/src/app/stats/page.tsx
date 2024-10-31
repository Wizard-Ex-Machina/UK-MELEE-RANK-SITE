import Titlebar from "../_components/Titlebar";

export default function Home() {
  const randomMessages = [
    "Send your chart ideas to @WizardExMachina",
    "I bet you like charts, you filthy perv",
    "The line went down this is the worst day of my life",
    "“Here we have a nerd” ~ David Attenborough upon seeing you looking at this page.",
  ];
  const randomMessage =
    randomMessages[Math.floor(Math.random() * randomMessages.length)];
  return (
    <Titlebar
      title="A Collection Of Charts And Stats About The UK Scene As A Whole"
      subtitle={randomMessage}
    />
  );
}
