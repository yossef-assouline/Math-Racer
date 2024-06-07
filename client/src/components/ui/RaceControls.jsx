import React from "react";

const RaceControls = ({ renderUi, socket, roomId, setRoomId }) => (
  <>
    {!renderUi ? (
      <>
        <button
          onClick={() => {
            socket.emit("start_game", roomId);
          }}
          className="gap-2 font-semibold text-lg text-black border-lg rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
        >
          Start Game
        </button>
        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoomId(e.target.value)}
            className="p-1 rounded-md text-lg w-48 outline-none border-none text-black"
          />
          <button
            onClick={() => socket.emit("join_room", roomId)}
            className="ml-2 text-lg font-medium text-white bg-yellow-400 hover:bg-yellow-500 rounded-md p-1"
          >
            Join Room
          </button>
          <button
            onClick={() => socket.emit("create_room")}
            className="ml-2 text-lg font-medium text-white bg-green-400 hover:bg-green-500 rounded-md p-1"
          >
            Create Room
          </button>
        </div>
      </>
    ) : (
      ""
    )}

    {roomId && (
      <div className="mt-4">
        <p className="text-lg font-medium text-white">
          Room ID: {roomId}
        </p>
        <p className="text-sm text-center text-white">
          Share this ID with a friend to join the same room
        </p>
      </div>
    )}
  </>
);

export default RaceControls;
