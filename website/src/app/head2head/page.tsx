import { playfair_dislpay, bebas_neue } from "../fonts";
import Titlebar from "../_components/Titlebar";

export default function Home() {
  const messages = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful ",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return (
    <Titlebar
      title="Consulting the orb on the subject of does [blank] win vs [blank]?"
      subtitle={randomMessage}
    />
  );
}
