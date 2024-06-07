import React from "react";

const RaceResult = ({ raceResults, handleRestartGame }) => (
  <div className="w-full h-96 p-4 flex flex-col items-center rounded-2xl shadow-2xl bg-blue-800/20">
    <h1 className="text-5xl mb-6 bg-gradient-to-r from-amber-200 to-yellow-300 inline-block text-transparent bg-clip-text">
      Race Finished
    </h1>
    <button
      className="gap-2 font-semibold text-lg text-black border-lg rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
      onClick={handleRestartGame}
    >
      Play again ?
    </button>
    <h2 className="text-3xl text-white mt-4">Leaderboard</h2>
    <ol className="text-2xl text-white">
      {raceResults.map((playerId, index) => (
        <li key={playerId}>{`${index + 1} : Player ${playerId}`}</li>
      ))}
    </ol>
  </div>
);

export default RaceResult;
