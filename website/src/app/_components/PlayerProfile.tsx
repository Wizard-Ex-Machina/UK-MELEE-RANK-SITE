import { Player } from "../page";
import RatingHistoryChart from "./_charts/RatingHistory";
import { space_mono } from "../fonts";
type PlayerProfileProps = {
  player: Player;
};
export default async function PlayerProfile(props: PlayerProfileProps) {
  return (
    <div className={`h-96 px-2 ${space_mono.className} `}>
      <RatingHistoryChart player={props.player} />
    </div>
  );
}
