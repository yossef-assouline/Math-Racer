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

    raceFinished:false,
    setRaceFinished: (value) => set({ raceFinished: value }),

    count:0,
    setCount: (value) => set({ count: value }),

    startCountdown:false,
    setStartCountdown: (value) => set({ startCountdown: value }),
    
    roomId:"",
    setRoomId:(value) => set({ roomId: value }),

    socket:null,
    setSocket:(value) => set({socket:value}),

    socketId:"",
    setSocketId:(value) => set({socketId:value}),

    raceResults:[],
    setRaceResults:(value) => set({raceResults:value}),
    
    timeLeft:60,
    setTimeLeft:(value) => set({ timeLeft: value }),
}))

