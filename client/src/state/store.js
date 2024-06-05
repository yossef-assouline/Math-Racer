import {create} from "zustand"

export const exercisesStore = create((set) => ({
    exercises:[],
    addExercises: (newExercises) =>
        set(() => ({
          exercises: newExercises
    })),
    correctAnswer:false,
    setCorrectAnswer: (value) => set({ correctAnswer: value }),
    currentIndex:0,
    incIndex: () =>
        set((state) => ({
          currentIndex : state.currentIndex + 1
    })),
    renderUi:false,
    setRenderUi: (value) => set({ renderUi: value }),

    isHide:true,
    setIsHide: (value) => set({ isHide: value }),
    correctAnswers:0,
    setCorrectAnswers: (value) => set({ correctAnswers: value }),
    raceFinished:false,
    count:0,
    roomId:"",
    playersProgress:{},
    socket:null,
    socketId:"",
    leaderboard:[],
    finished:false,
    timeLeft:60
}))

// export const correctAnswerrStore = create((set) => ({
//   correctAnswerr:false,
//   setCorrectAnswerr: (value) => set({ correctAnswerr: value }), 
// }))
