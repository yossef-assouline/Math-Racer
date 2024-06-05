import React from "react";
import { Footer } from "../../../components/ui/Footer";
import { Nav } from "../../../components/ui/Nav";
import { CarRaceMulti } from "../../../components/ui/CarRaceMulti";
export default function playMulti() {
  return (
    <>
      <Nav></Nav>
      <CarRaceMulti />
      <Footer />
    </>
  );
}
