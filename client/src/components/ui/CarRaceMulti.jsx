"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import io from "socket.io-client";
import {getRandomInt} from "../../lib/utils"
import {  IndexStore , correctAnswerrStore,exercisesStore } from "../../state/store";
const cars = [
  {
    img: "/car.png",
  },
  {
    img: "/car1.png",
  },
  {
    img: "/car2.png",
  },
  {
    img: "/car3.png",
  },
  {
    img: "/car4.png",
  },
];

export function CarRaceMulti() {
  const { exercises ,correctAnswer ,correctAnswers,isHide,setIsHide, currentIndex , incIndex , renderUi,addExercises,setCorrectAnswer,setRenderUi,setCorrectAnswers} = exercisesStore((state)=>({
    exercises:state.exercises,
    addExercises:state.addExercises,
    currentIndex:state.currentIndex,
    incIndex:state.incIndex,
    correctAnswer:state.correctAnswer,
    setCorrectAnswer:state.setCorrectAnswer,
    renderUi:state.renderUi,
    setRenderUi:state.setRenderUi,
    isHide:state.isHide,
    setIsHide:state.setIsHide,
    correctAnswers:state.correctAnswers,
    setCorrectAnswers:state.setCorrectAnswers
  }))
  const inputRef = useRef()


  useEffect(()=>{console.log(exercises ,correctAnswer , currentIndex , incIndex , renderUi,addExercises,setCorrectAnswer,setRenderUi , correctAnswers,setCorrectAnswers)},[renderUi])

  
  // const correctAnswers = useRef(0);
  const [raceFinished, setRaceFinish] = useState(false);
  const [count, setCount] = useState(0);
  const [startCountdown, setStartCountdown] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [playersProgress, setPlayersProgress] = useState({});
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const finished = useRef(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // handeling sockets 
  useEffect(() => {
    // connecting socketIo to server 
    const socketIo = io("http://localhost:3001");
    setSocket(socketIo);

    socketIo.on("connect", () => {
      setSocketId(socketIo.id);
    });
    // when button clicked trigger game_started which will set all the relevent states
    socketIo.on("game_started", () => {
      setRenderUi(true);
      initGame();
      setStartCountdown(true);
      setCount(3);
      setTimeout(() => {
        setTimeLeft(60)
      }, 3000);
    });
    // update progress by spreading prev state and merging with updated correctAnswers count 
    socketIo.on("update_progress", ({ socketId, correctAnswers }) => {
      setPlayersProgress((prev) => ({
        ...prev,
        [socketId]: correctAnswers,
      }));
    });
    // setting the room id from the server on a state in the client side
    socketIo.on("room_created", (roomId) => {
      setRoomId(roomId);
      setPlayersProgress({ [socketIo.id]: correctAnswers });
    });

    socketIo.on("room_joined", (roomId, players) => {
      setRoomId(roomId);
      if (Array.isArray(players)) {
        const newPlayersProgress = players.reduce((acc, playerId) => {
          acc[playerId] = correctAnswers
          return acc;
        }, {});
        console.log(newPlayersProgress)
        setPlayersProgress(newPlayersProgress);
      }
    });

    socketIo.on("player_joined", (socketId) => {
      setPlayersProgress((prev) => ({
        ...prev,
        [socketId]: correctAnswers
      }));
    });

    socketIo.on("update_leaderboard", (leaderboard) => {
      setLeaderboard(leaderboard);
    });

    socketIo.on("player_left", (socketId) => {
      setPlayersProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[socketId];
        return newProgress;
      });
    });

    // Listen for the restart_game event
    socketIo.on("restart_game", () => {
      resetGameState();
    });

    return () => socketIo.disconnect();
  }, []);

  useEffect(() => {
    if (startCountdown) {
      const timer = setInterval(() => {
        if (count > 0) {
          setCount((prevCount) => prevCount - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startCountdown, count]);

  useEffect(() => {
    if (renderUi && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !raceFinished) {
      setRaceFinish(true);
      finished.current = true;
      socket.emit("finish_race", roomId);
    }
  }, [timeLeft, renderUi, raceFinished, socket, roomId]);

  const initGame = () => {
    let newExercises = [];
    for (let i = 0; i < 10; i++) {
      const num1 = getRandomInt(1, 50);
      const num2 = getRandomInt(1, 10);
      const actions = ["/", "*", "+", "-"];
      const randAction = actions[Math.floor(Math.random() * actions.length)];

      let result;
      switch (randAction) {
        case "*":
          result = num1 * num2;
          break;
        case "/":
          if (num1 % num2 !== 0) {
            i--;
            continue;
          }
          result = num1 / num2;
          break;
        case "-":
          result = num1 - num2;
          break;
        case "+":
          result = num1 + num2;
          break;
        default:
          break;
      }

      const exerciseObj = {
        exercise: `${num1} ${randAction} ${num2}`,
        result: result,
        correct: false,
      };

      newExercises.push(exerciseObj);
    }
    addExercises(newExercises)
    // setExercises(newExercises);
    setCorrectAnswers(0)
  };

  const handleProgress = () => {
    exercises.forEach((xercise) => {
      if (correctAnswers.current === 10 && !finished.current) {
        setRaceFinish(true);
        finished.current = true;
        socket.emit("finish_race", roomId);
      }
      const correctCount = exercises.filter((xercise) => xercise.correct === true).length;
      setCorrectAnswers(correctCount)
    });
    console.log(exercises)
    socket.emit("answer_submitted", {
      roomId,
      correctAnswers: correctAnswers
    });
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    inputRef.current.focus();

    const userAnswer = Number(inputRef.current.value);

    if (userAnswer === exercises[currentIndex].result) {
      exercises[currentIndex].correct = true;
      setCorrectAnswer(true);
      incIndex((prevIndex) => (prevIndex + 1) % exercises.length);
      handleProgress();
      setIsHide(false)
    }
    if (userAnswer !== exercises[currentIndex].result && inputRef.current.value !== "") {
      setCorrectAnswer(false);
      setIsHide(false)
    }

    inputRef.current.value = "";
    setTimeout(() => setIsHide(true), 2000);
  };

  const resetGameState = () => {
    setRaceFinish(false);
    setRenderUi(false);
    setRoomId("");
    setPlayersProgress({});
    addExercises([])
    incIndex(0);
    setStartCountdown(false);
    setLeaderboard([]);
    setTimeLeft(60); // Reset the timer
    finished.current = false;
    correctAnswers.current = 0;
  };

  const handleRestartGame = () => {
    socket.emit("restart_game", roomId);
    resetGameState();
  };

  return (
    <div className="items-center justify-center flex border flex-col border-black pb-96 pt-48 bg-blue-800/30">
      <div className="w-2/3 min-h-90 p-4 flex flex-col items-center rounded-2xl shadow-2xl bg-blue-800/20">
        {raceFinished ? (
          <>
            <div className="w-full h-96 p-4 flex flex-col items-center rounded-2xl shadow-2xl bg-blue-800/20">
            <h1 className="text-5xl mb-6 bg-gradient-to-r from-amber-200 to-yellow-300 inline-block text-transparent bg-clip-text">Race Finished</h1>
            <button
              className="gap-2 font-semibold text-lg text-black border-lg rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
              onClick={handleRestartGame}
            >
              Play again ?
            </button>
            <h2 className="text-3xl text-white mt-4">Leaderboard</h2>
            <ol className="text-2xl text-white">
              {leaderboard.map((playerId, index) => (
                <li key={playerId}>{`${index + 1} : Player ${playerId}`}</li>
              ))}
            </ol>
            </div>
          </>
        ) : (
          <>
            {startCountdown && (
              <h1 className="text-3xl text-white">
                {count > 0 ? count : "Go!"}
              </h1>
            )}
            {startCountdown && count === 0 &&(
              <div className="mt-4">
                <p className="text-5xl font-medium text-white">{timeLeft}</p>
              </div>
            )}
            {Object.keys(playersProgress).map((id, i) => (
              <div
                key={id}
                className="border-t-2 border-white w-10/12 mt-24 justify-start relative"
              >
                <Image
                  className={`relative bottom-11 transition-transform duration-500`}
                  style={{
                    left:
                      playersProgress[id] === 0
                        ? 0
                        : `calc(${
                            (playersProgress[id]) * 10
                          }% - ${
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
                ></Image>
              </div>
            ))}
            <form onSubmit={checkAnswer} className="flex flex-col items-center">
              {renderUi && (
            <div className="bg-blue-800/10 border-4 text-center p-8 shadow-2xl rounded-2xl mb-8">
                <div className="flex flex-col items-center mt-1 2">
                  <h1 className="text-5xl text-white font-bold">
                    {exercises[currentIndex].exercise}
                  </h1>
                  <span className="text-white text-3xl">=</span>

                  {!isHide ? (
                    <label
                      htmlFor=""
                      className={`text-xl font-bold ${
                        correctAnswer ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {correctAnswer ? "Correct answer" : "Wrong answer"}
                    </label>
                  ) : (
                    ""
                  )}

                  <input
                    type="number"
                    ref={inputRef}
                    className="border border-black w-2/3 h-12 mt-4 text-center text-xl"
                  />
                  <button className="gap-2 font-semibold text-lg text-black border-lg  rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 mt-8 hover:outline-none hover:ring-2 hover:ring-black ring-offset">
                    Submit
                  </button>
                </div>
              </div>
              )}
            </form>
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
        )}
      </div>
      <div className="mt-8">
        <h1 className="text-center">LeaderBoard</h1>
        <ol>
          {leaderboard.map((player, i) => {
            return <li>{`${i + 1} : Player ${player}`}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}
