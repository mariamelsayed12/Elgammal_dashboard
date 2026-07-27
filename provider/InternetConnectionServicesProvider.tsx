"use client";

import { networkModeAction } from "@/redux/feature/NetworkSlice";
import {  ReactNode, useEffect, useRef } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface Iprops{
    children:ReactNode
}

const InternetConnectionProvider = ({children}:Iprops) => {
    
    const toastIdRef = useRef<string | undefined>(undefined);
    const dispatch=useDispatch()

    
    function close() {
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
        }    
    }

    function addToast(){
        toastIdRef.current = toast.error(
            "You are offline. Please make sure you have internet connection",
            {
                duration: Infinity,
                icon: "⚠️",
            }
        );
    }

    const setOnline=()=>{

        dispatch(networkModeAction(true))
        close()
    }

    const setOffline=()=>{
        dispatch(networkModeAction(false))
        addToast()

    }

    useEffect(() => {
        //online
        window.addEventListener('online',setOnline)
        //offline
        window.addEventListener('offline',setOffline)

        return ()=>{
            // Cleanup
            window.removeEventListener('online',setOnline)
            window.removeEventListener('offline',setOffline)


        }
    }, []);



    return children
}

export default InternetConnectionProvider