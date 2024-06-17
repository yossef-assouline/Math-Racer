"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import io from "socket.io-client";
import { getRandomInt } from "../../lib/utils";
import {exercisesStore,} from "../../state/store";
import RaceProgress from "../ui/RaceProgress"
import CountDown from "../ui/CountDown"
import ExerciseForm from "../ui/ExerciseForm"

export function CarRaceMulti() {
  const {
    resetIndex,
    timeLeft,
    setTimeLeft,
    raceResults,
    setRaceResults,
    socketId,
    setSocketId,
    setSocket,
    socket,
    roomId,
    setRoomId,
    startCountdown,
    setStartCountdown,
    count,
    setCount,
    raceFinished,
    setRaceFinished,
    exercises,
    correctAnswer,
    isHide,
    setIsHide,
    currentIndex,
    incIndex,
    renderUi,
    addExercises,
    setCorrectAnswer,
    setRenderUi,
  } = exercisesStore((state) => ({
    resetIndex:state.resetIndex,
    exercises: state.exercises,
    addExercises: state.addExercises,
    currentIndex: state.currentIndex,
    incIndex: state.incIndex,
    correctAnswer: state.correctAnswer,
    setCorrectAnswer: state.setCorrectAnswer,
    renderUi: state.renderUi,
    setRenderUi: state.setRenderUi,
    isHide: state.isHide,
    setIsHide: state.setIsHide,
    raceFinished: state.raceFinished,
    setRaceFinished: state.setRaceFinished,
    count: state.count,
    setCount: state.setCount,
    startCountdown: state.startCountdown,
    setStartCountdown: state.setStartCountdown,
    roomId: state.roomId,
    setRoomId: state.setRoomId,
    playersProgress: state.playersProgress,
    setSocket:state.setSocket,
    socket:state.socket,
    socketId:state.socketId,
    setSocketId:state.setSocketId,
    raceResults:state.raceResults,
    setRaceResults:state.setRaceResults,
    timeLeft:state.timeLeft,
    setTimeLeft:state.setTimeLeft,
  }));
  
  const [playersProgress, setPlayersProgress] = useState({});
  const inputRef = useRef();
  const correctAnswers = useRef(0);
  const finished = useRef(false);
  const [errMessage,setErrMessage] = useState()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (startCountdown) {
      const timer = setInterval(() => {
        if (count > 0) {
          setCount(count - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startCountdown, count]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (renderUi && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !raceFinished) {
      setRaceFinished(true);
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
    addExercises(newExercises);
    // setExercises(newExercises);
    correctAnswers.current = 0;

  };

  const handleProgress = () => {
    exercises.forEach((xercise) => {
      if (correctAnswers.current === 10 && !finished.current) {
        setRaceFinished(true);
        finished.current = true;
        socket.emit("finish_race", roomId);
      }
      const correctCount = exercises.filter(
        (xercise) => xercise.correct === true
      ).length;
      correctAnswers.current = correctCount;
    });
    console.log(correctAnswers);
    socket.emit("answer_submitted", {
      roomId,
      correctAnswers: correctAnswers.current,
    });
  };

  const checkAnswer = (e) => {
    console.log(exercises , currentIndex)
    e.preventDefault();
    inputRef.current.focus();

    const userAnswer = Number(inputRef.current.value);

    if (userAnswer === exercises[currentIndex].result) {
      exercises[currentIndex].correct = true;
      setCorrectAnswer(true);
      incIndex((prevIndex) => (prevIndex + 1) % exercises.length);
      handleProgress();
      setIsHide(false);
    }
    if (
      userAnswer !== exercises[currentIndex].result &&
      inputRef.current.value !== ""
    ) {
      setCorrectAnswer(false);
      setIsHide(false);
    }

    inputRef.current.value = "";
    setTimeout(() => setIsHide(true), 2000);
  };

  const resetGameState = () => {
    setRaceFinished(false);
    setRenderUi(false);
    setRoomId("");
    setPlayersProgress({})
    addExercises([]);
    resetIndex(0)
    setStartCountdown(false);
    setRaceResults([]);
    setTimeLeft(60); // Reset the timer
    finished.current = false;
    correctAnswers.current = 0;
  };

  const handleRestartGame = () => {
    socket.emit("restart_game", roomId);
    resetGameState();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // connecting socketIo to server
    const socketIo = io("https://math-racer-server.onrender.com");
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
        setTimeLeft(60);
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

        setPlayersProgress(newPlayersProgress);
      }
    });

    socketIo.on("player_joined", (socketId) => {
      setPlayersProgress((prev) => ({
        ...prev,
        [socketId]: correctAnswers
      }));
    });


    socketIo.on("update_Race_Results", (raceResults) => {
      setRaceResults(raceResults);
    });

    socketIo.on("player_left", (socketId) => {
      setPlayersProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[socketId];
        return newProgress;
      });
    });
    socketIo.on("game_in_progress", (message) => {
      setErrMessage(message)
    });
    // Listen for the restart_game event
    socketIo.on("restart_game", () => {
      resetGameState();
    });

    return () => socketIo.disconnect();
  }, []);

  return (
    <div className="items-center justify-center flex border flex-col border-black pb-96 pt-48 bg-blue-800/30">
      <div className="w-2/3 min-h-90 p-4 flex flex-col items-center rounded-2xl shadow-2xl bg-blue-800/20">
        {raceFinished ? (
          <>
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
              <h2 className="text-3xl text-white mt-4">Race Results</h2>
              <ol className="text-2xl text-white">
                {raceResults.map((playerId, index) => (
                  <li key={playerId}>{`${index + 1} : Player ${playerId}`}</li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <>
            <CountDown startCountdown={startCountdown} count={count} timeLeft={timeLeft} />
            <RaceProgress playersProgress={playersProgress} />
            <ExerciseForm renderUi={renderUi} exercises={exercises} currentIndex={currentIndex} checkAnswer={checkAnswer} inputRef={inputRef} correctAnswer={correctAnswer} isHide={isHide} />
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
                <div className="mt-8 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    className="p-1 rounded-md text-lg w-48 outline-none border-none text-black"
                  />
                  {errMessage ? <h1 className="text-red-500">{errMessage}</h1> : ""}
                  <button
                    onClick={() => socket.emit("join_room", roomId)}
                    className="ml-2 text-lg font-medium text-white bg-cyan-950 hover:bg-cyan-800 rounded-md p-1 mt-4"
                  >
                    Join Room
                  </button>
                  <button
                    onClick={() => socket.emit("create_room")}
                    className="ml-2 text-lg font-medium text-white bg-green-400 hover:bg-green-500 rounded-md p-1 mt-4"
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
      {!raceFinished && (
        <div className="mt-8">
        <h1 className="text-center">Race Results</h1>
        <ol>
          {raceResults.map((player, i) => {
            return <li key={player} >{`${i + 1} : Player ${player}`}</li>;
          })}
        </ol>
      </div>
      )}
      
    </div>
  );
}
