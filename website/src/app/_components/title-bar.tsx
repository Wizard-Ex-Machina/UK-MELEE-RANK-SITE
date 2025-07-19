"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

export default function Titlebar({ pageTitle }: { pageTitle: string }) {
  return (
    <ViewTransition>
      <div className="p-4 pb-8 flex justify-center items-center pt-36 bg-gradient-to-b from-surface-400 to-surface-50 dark:from-darkwave-100 dark:to-darkwave-50 w-screen transition-all">
        <div className="w-full lg:w-3/5 text-wrap">
          <div className="tracking-widest font-[family-name:var(--font-cinzel)] font-black text-5xl lg:text-8xl xl:text-9xl">
            <span className="bg-gradient-to-br from-green-400 to-teal-600 bg-clip-text text-transparent">
              Wizard{" "}
            </span>
            <span className="bg-gradient-to-br from-red-500 to-rose-700 bg-clip-text text-transparent">
              Ex{" "}
            </span>
            <span className="bg-gradient-to-br from-violet-700 to-fuchsia-800 bg-clip-text text-transparent">
              Machina's
            </span>
          </div>
          <div className="font-[family-name:var(--font-cinzel)] font-bold text-xl lg:text-4xl dark:text-white xl:text-7xl">
            {pageTitle}
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
