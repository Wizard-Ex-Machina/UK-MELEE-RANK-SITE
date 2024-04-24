import Link from "next/link";

export default function Title() {
  return (
    <main className="items-left flex min-h-[36rem] flex-col justify-end bg-gradient-to-b from-amber-600 to-orange-700 p-4 text-white">
      <h1 className="text-9xl font-black">UK</h1>
      <h1 className="text-9xl font-black">MELEE RANKED</h1>
      <div className="items justify-left flex pt-2">
        <Link href="/" legacyBehavior>
          <a className="rounded-sm p-1 px-2 text-2xl font-semibold hover:underline">
            Leaderboard
          </a>
        </Link>
        <Link href="/about" legacyBehavior>
          <a className="rounded-md p-1 px-2 text-2xl font-semibold hover:underline">
            About
          </a>
        </Link>
      </div>
    </main>
  );
}
