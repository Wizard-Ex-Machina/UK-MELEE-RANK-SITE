import { Suspense } from "react";
import RatingTable from "./_components/ratingTable";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900 p-8 text-white">
      <Suspense>
        <RatingTable />
      </Suspense>
    </main>
  );
}
