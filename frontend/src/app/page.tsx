'use client'

import { RetroGrid } from "@/components/magicui/retro-grid";
import { useUserById } from "./providers/queries/users";

export default function Home() {

  const { data: user, isLoading } = useUserById("2b60325f-5eb0-48df-9a66-b961492a3ee5");

  if (isLoading) return <div>Loading...</div>;

  console.log(user);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Skibidi Notes...
      </span>

      <RetroGrid />
    </div>
  );
}
