import React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="items-center flex flex-col p-32 bg-blue-800/30 h-screen">
      <div className=" border-black flex flex-col  pl-16 pr-16 pb-8 pt-8 rounded-xl mb-20 ">
        <h1 className="text-cyan-950 font-extrabold text-center text-6xl">
          Math<span className="text-yellow-400">Racer</span>
        </h1>
        <h2 className="text-cyan-950 font-semibold text-center text-4xl mt-8">
          The Global <span className="text-yellow-400">Math</span>{" "}
          Competition
        </h2>
      </div>      
      <Link
        className="gap-2 font-semibold text-lg text-black border-lg w-48 rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-4 pr-4 pt-4 pb-4 hover:outline-none hover:ring-2 hover:ring-black ring-offset"
        href="/play/multiplayer"
      >
        Play with friends
      </Link>
      
      
      <Link
        className="gap-2 mt-8 font-semibold text-lg text-black border-lg  rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-4 pr-4 pt-4 pb-4 hover:outline-none hover:ring-2 hover:ring-black ring-offset"
        href="/play/single-player"
      >
        Play alone
      </Link>
    </div>
  );
}
