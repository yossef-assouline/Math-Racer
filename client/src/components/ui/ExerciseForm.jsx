import React from "react";
import { exercisesStore } from "../../state/store";
export default function ExerciseForm({ renderUi, currentIndex, checkAnswer, inputRef, correctAnswer, isHide }) {
    const {
        exercises,
      } = exercisesStore((state) => ({
        exercises: state.exercises,
      }));
    
    return(
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
    )
    
  


}



    
 