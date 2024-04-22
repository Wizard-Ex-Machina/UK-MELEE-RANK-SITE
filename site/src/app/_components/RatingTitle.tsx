export function RatingTitle() {
  return (
    <div className="h8 flex w-full rounded-md bg-gradient-to-b from-amber-900 to-orange-900 p-1">
      <div className="w-16 items-center">
        <p className="text-center">Rank</p>
      </div>
      <div className="w-full items-center  px-1">
        <p className="text-left">Name</p>
      </div>
      <div className="w-32 items-center px-1">
        <p className="text-center">Rating</p>
      </div>
      <div className="w-32 items-center px-1 ">
        <p className="text-center ">Change</p>
      </div>
      <div className="w-32 items-center  px-1">
        <p className="text-center">RD</p>
      </div>
    </div>
  );
}
