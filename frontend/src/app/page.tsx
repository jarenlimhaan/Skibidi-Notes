'use client'

import { RetroGrid } from "@/components/magicui/retro-grid";
import { useUserById } from "./providers/queries/users";

export default function Home() {

  const { data: user, isLoading } = useUserById(1);

  if (isLoading) return <div>Loading...</div>;

  console.log(user?.name);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Skibidi Notes...
      </span>

      <RetroGrid />
    </div>
  );
}
