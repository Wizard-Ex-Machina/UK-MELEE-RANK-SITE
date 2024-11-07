import { Player } from "../page";
import RatingHistoryChart from "./_charts/RatingHistory";
import { space_mono } from "../fonts";
import Opponents from "./_profileSubComponents/Opponents";
import RecentMatches from "./_profileSubComponents/MatchHistory";
import RecentResults from "./_profileSubComponents/RecentResults";
type PlayerProfileProps = {
  player: Player;
};
export default function PlayerProfile(props: PlayerProfileProps) {
  return (
    <div className={`px-2 pb-2 ${space_mono.className} `}>
      <div className="h-64">
        <RatingHistoryChart player={props.player} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 ">
        <RecentMatches player={props.player} />
        <RecentResults player={props.player} />
        <Opponents player={props.player} />
      </div>
    </div>
  );
}
