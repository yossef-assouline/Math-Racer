"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getSession , signOut} from 'next-auth/react';
import { useState , useEffect } from "react";

export function Nav() {
  const [user, setUser] = useState(null);
  const [loading , setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  return (
    <>
      <div className="w-full min-h-20 flex items-center justify-between bg-cyan-950 text-white ">
        <div className="flex items-center gap-x-5 flex ml-5">
          <Image src="/logo.png"  width={100} height={100}></Image>
          <Link
            className="gap-2 font-semibold text-xl"
            href={
              pathname === "play/single-player" || "play/multiplayer"
                ? "/"
                : "/play"
            }
          >
            {pathname.includes("/play") ? "Home" : ""}
          </Link>
        </div>
        <div className="gap-x-5 flex mr-5 items-center">
          
          {isLoggedIn ? (
            
            <>
            <h1 className="font-bold text-xl">{user?.name}</h1>
            <img className="w-16 rounded-full" src={user?.image}></img>
            <button className="gap-2 font-semibold text-lg text-white border-lg  rounded-md bg-gradient-to-r from-red-600 to-red-400 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset" onClick={handleLogout}>Logout</button>
            </>
            
          ) : (
            <Link
              className="gap-2 font-semibold text-lg text-black border-lg  rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
              href="/auth/signin"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <hr className="border-black" />
    </>
  );
}
