"use client"
import { useState,useEffect } from "react";

import { getSession } from 'next-auth/react';

import { Nav } from "../components/ui/Nav";
import { Hero } from "../components/ui/Hero";
import { Footer } from "../components/ui/Footer";
export default function Home() {
  const [user, setUser] = useState(null);
  const [loading , setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  return (
    <>
      <Nav  user={user} isLoggedIn={isLoggedIn}/>
      <Hero />
      <Footer />
    </>
  );
}
