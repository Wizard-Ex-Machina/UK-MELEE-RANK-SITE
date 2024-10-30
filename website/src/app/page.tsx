import Image from "next/image";
import Link from "next/link";
import { playfair_dislpay, bebas_neue } from "./fonts";

export default function Home() {
  return (
    <div className=" items-center justify-items-center min-h-screen ">
      <div className="text-left px-8 pt-32 bg-gradient-to-b from-teal-600 to-cyan-900">
        <h1 className="text-8xl font-bold">Wizard Ex Machina Presents…</h1>
        <h1 className={`text-7xl font-bold ${playfair_dislpay.className}`}>
          A Glicko2 Ranking Of People That Sometimes Play Melee In The UK
        </h1>
        <div className="items justify-left flex pt-2">
          <Link href="/" legacyBehavior>
            <a className="rounded-sm mr-2 my-2 text-2xl font-semibold hover:underline">
              Leaderboard
            </a>
          </Link>
          <Link href="/stats" legacyBehavior>
            <a className="rounded-md mr-2 my-2 text-2xl font-semibold hover:underline">
              Stats
            </a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="rounded-md mr-2 my-2  text-2xl font-semibold hover:underline">
              About
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
