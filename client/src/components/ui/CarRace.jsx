"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRef } from "react";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function CarRace() {
  const inputRef = useRef();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [renderUi, setRenderUi] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const correctAnswers = useRef(1);
  const [carPosition, setCarPosition] = useState(0);
  const [raceFinished, setRaceFinish] = useState(false);
  const [count, setCount] = useState(0);
  const [startCountdown, setStartCountdown] = useState(false);

  useEffect(() => {
    if (startCountdown) {
      const timer = setInterval(() => {
        if (count > 0) {
          setCount(prevCount => prevCount - 1);
        } else {
          clearInterval(timer); // Stop the countdown when count reaches 0
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startCountdown, count]);

  const handleCountDown = () => {
    setStartCountdown(true);
    setCount(3);
  };

  const initGame = () => {
    // Array to hold the generated exercises
    let newExercises = [];
    
    for (let i = 0; i < 10; i++) {
      // Generate random numbers and action
      const num1 = getRandomInt(1, 50);
      const num2 = getRandomInt(1, 10);
      const actions = ["/", "*", "+", "-"];
      const randAction = actions[Math.floor(Math.random() * actions.length)];

      let result;

      // Calculate result based on the action
      switch (randAction) {
        case "*":
          result = num1 * num2;
          break;
        case "/":
          if (num1 % num2 !== 0) {
            // If division has remainder, regenerate exercise
            i--; // Decrease loop counter to repeat this iteration
            continue; // Restart the loop
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

      // Create the exercise object
      const exerciseObj = {
        exercise: `${num1} ${randAction} ${num2}`,
        result: result,
        correct: false, 
      };

    
      newExercises.push(exerciseObj);
    }

    setExercises(newExercises);
    correctAnswers.current = 1;
  };

  
  const handleProgress = () => {
    if (correctAnswers.current === 10) {
      setRaceFinish(true)
    } else if (exercises[currentIndex].correct === true) {
      correctAnswers.current++;
    }
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    inputRef.current.focus();
    
    const userAnswer = Number(inputRef.current.value);

    if (userAnswer === exercises[currentIndex].result) {
      exercises[currentIndex].correct = true;
      setCorrectAnswer(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % exercises.length);
      setCarPosition(carPosition < 100 ? carPosition + 10 : 0);
      handleProgress();

      setTimeout(() => setIsHide(false));
    }
    if (
      userAnswer !== exercises[currentIndex].result &&
      inputRef.current.value !== ""
    ) {
      setCorrectAnswer(false);
      setTimeout(() => setIsHide(false));
    }

    inputRef.current.value = "";
    setTimeout(() => setIsHide(true), 2000);
  };

  return (
    <div className="items-center justify-center flex border border-black pb-96 pt-48 bg-blue-800/30">
      <div className="w-2/3 h-90 p-4 flex flex-col items-center rounded-2xl shadow-2xl bg-blue-800/20">
        {raceFinished ? (
          <>
            <h1 className="text-5xl text-green-600">Race Finished</h1>
            <button
              className="gap-2 font-semibold text-lg text-black border-lg   rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
              onClick={() => {
                setRaceFinish(false);
                setRenderUi(false);
                setCarPosition(0);
                setCurrentIndex(0);
                setStartCountdown(false)
                
              }}
            >
              Play again ?
            </button>
          </>
        ) : (
          <>
            {startCountdown && (
              <h1 className="text-3xl text-white">{count > 0 ? count : "Go!"}</h1>
            )}
            <div className="border-t-2 border-white w-10/12 mt-24 justify-start ">
              <Image
                className={`relative bottom-11 transition-transform  duration-500`}
                style={{
                  left:
                    carPosition === 0
                      ? 0
                      : `calc(${carPosition}% - ${
                          carPosition >= 90 ? "30px" : "0px"
                        })`,
                }}
                src="/car.png"
                alt="img"
                width={60}
                height={60}
              ></Image>
            </div>
            <div className="bg-blue-800/10 border-4 text-center p-8 shadow-2xl rounded-2xl mb-8">
              {!renderUi ? (
                <>
                  {" "}
                  {!startCountdown ? (
                    <>
                      <h1 className="text-white shadow-2xl text-2xl">Start Game?</h1>
                      <button
                        onClick={
                          !renderUi
                            ? () => {
                                handleCountDown();
                                setTimeout(() => {
                                  setRenderUi(true);
                                  initGame();
                                }, 3000);
                              }
                            : ""
                        }
                        className="gap-2 font-semibold text-lg text-black border-lg  rounded-md bg-gradient-to-r from-amber-200 to-yellow-300 pl-3 pr-3 pt-1 pb-1 mt-4 hover:outline-none hover:ring-2 hover:ring-white ring-offset"
                      >
                        Start
                      </button>
                    </>
                  ) : (
                    <h1 className="bg-gradient-to-r font-bold from-amber-200 to-yellow-300 inline-block text-transparent bg-clip-text text-2xl">Get ready</h1>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-5xl text-white font-bold">
                    {exercises[currentIndex].exercise}
                  </h1>
                  <span className="text-white text-3xl" >=</span>
                  <form
                    onSubmit={checkAnswer}
                    action=""
                    className="flex flex-col items-center"
                  >
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
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}