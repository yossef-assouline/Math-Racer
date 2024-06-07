import React from "react";
import Image from "next/image";

const cars = [
  { img: "/car.png" },
  { img: "/car1.png" },
  { img: "/car2.png" },
  { img: "/car3.png" },
  { img: "/car4.png" },
];

const RaceProgress = ({ playersProgress }) => (
  <>
    {Object.keys(playersProgress).map((id, i) => (
      <div key={id} className="border-t-2 border-white w-10/12 mt-24 justify-start relative">
        <Image
          className={`relative bottom-11 transition-transform duration-500`}
          style={{
            left:
              playersProgress[id] === 0
                ? 0
                : `calc(${playersProgress[id] * 10}% - ${
                    playersProgress[id] >= 10
                      ? "60px"
                      : playersProgress[id] >= 5
                      ? "30px"
                      : "0px"
                  })`,
          }}
          src={cars[i].img}
          alt="img"
          width={60}
          height={60}
        />
      </div>
    ))}
  </>
);

export default RaceProgress;
