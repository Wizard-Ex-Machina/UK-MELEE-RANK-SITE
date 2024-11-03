import { Player } from "../page";
import RatingHistoryChart from "./_charts/RatingHistory";
import { space_mono } from "../fonts";
import Opponents from "./_profileSubComponents/Opponents";
import RecentMatches from "./_profileSubComponents/MatchHistory";
type PlayerProfileProps = {
  player: Player;
};
export default function PlayerProfile(props: PlayerProfileProps) {
  return (
    <div className={`px-2 pb-2 ${space_mono.className} `}>
      <div className="h-64">
        <RatingHistoryChart player={props.player} />
      </div>
      <div className="grid grid-cols-3 gap-2 ">
        <Opponents player={props.player} />
        <div className="flex flex-col">
          <div className="text-lg font-bold">Recent Events</div>
          <div className="h-36 overflow-y-scroll">
            <div
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 bg-gray-500/25 border-gray-500 `}
            >
              <div className="col-span-4 truncate">
                Bristol's Basement: The Old Hunters
              </div>
              <div className="col-span-1 text-right">1st</div>
            </div>
            <div
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 bg-gray-500/25 border-gray-500 `}
            >
              <div className="col-span-4 truncate">
                Den of Dragons: The Beast's Conquest
              </div>
              <div className="col-span-1 text-right">1st</div>
            </div>
            <div
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 bg-gray-500/25 border-gray-500 `}
            >
              <div className="col-span-4 truncate">
                Bristol's Basement: Global Offensive
              </div>
              <div className="col-span-1 text-right">1st</div>
            </div>
            <div
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 bg-gray-500/25 border-gray-500 `}
            >
              <div className="col-span-4 truncate">Let's Eat The Grass</div>
              <div className="col-span-1 text-right">1st</div>
            </div>
            <div
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 bg-gray-500/25 border-gray-500 `}
            >
              <div className="col-span-4 truncate">Regen 2024</div>
              <div className="col-span-1 text-right">1st</div>
            </div>
          </div>
        </div>

        <RecentMatches player={props.player} />
      </div>
    </div>
  );
}
