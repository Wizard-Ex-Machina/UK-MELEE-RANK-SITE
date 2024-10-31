import Image from "next/image";
import Link from "next/link";
import { playfair_dislpay, bebas_neue, space_mono } from "../fonts";

type TitlebarProps = {
  title: string;
  subtitle?: string;
};
export default function Titlebar(props: TitlebarProps) {
  return (
    <div className=" items-center justify-items-center">
      <div className="text-left px-8 pt-48 bg-gradient-to-b from-teal-600 to-cyan-900">
        <h1 className={`text-8xl font-bold ${bebas_neue.className}`}>
          Wizard Ex Machina Presents…
        </h1>
        <h1 className={`text-7xl font-bold ${playfair_dislpay.className}`}>
          {props.title}
        </h1>
        {props.subtitle ? (
          <h5 className={`text-4xl pt-3 font-semibold ${bebas_neue.className}`}>
            {props.subtitle}
          </h5>
        ) : null}

        <div className={`items justify-left flex pt-1 ${bebas_neue.className}`}>
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
          <Link href="/head2head" legacyBehavior>
            <a className="rounded-md mr-2 my-2 text-2xl font-semibold hover:underline">
              H2H
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
