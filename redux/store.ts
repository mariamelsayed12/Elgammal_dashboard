import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from "react-redux";
import netwokSlice from './feature/NetworkSlice';



// ...



export const store = configureStore({
    //root reducer
    reducer: {
      netwok:netwokSlice


    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store
