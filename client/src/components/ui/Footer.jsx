import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <div className=" bg-cyan-950 h-36 w-full flex flex-col items-center justify-center">
        <hr className="border border-black" />
        <h1 className="text-center text-xl text-white mb-4">
          © 2024 MathRacer
        </h1>
        <div className="text-center gap-4 text-white w-48 flex justify-evenly text-xl font-semibold">
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}
