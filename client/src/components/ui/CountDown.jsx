import React from "react";



const CountDown = ({ startCountdown , count ,timeLeft}) => (
  <>
    {startCountdown && (
              <h1 className="text-3xl text-white">
                {count > 0 ? count : "Go!"}
              </h1>
            )}
            {startCountdown && count === 0 && (
              <div className="mt-4">
                <p className="text-5xl font-medium text-white">{timeLeft}</p>
              </div>
            )}
  </>
);

export default CountDown;
