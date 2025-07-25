import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthUser from '../hook/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import PageLoader from "../components/PageLoader";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const {id:callId} = useParams();
  const [client,setClient] = useState(null);
  const [call,setCall] = useState(null);
  const [isConnecting,setIsConnecting] = useState(true)

  const {authUser,isLoading} = useAuthUser();

  //GET
  const {data:tokendata} = useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser,
  })
  useEffect(()=>{
    const initCall = async () =>{
     
    console.log("📡 STREAM_API_KEY:", STREAM_API_KEY);
      if (!tokendata || !authUser || !callId) {
        console.warn("⛔ Required data missing, skipping call init");
        return;
      }

      try {
        console.log("Initializing Stream Video Client...");
        console.log("📡 STREAM_API_KEY:", STREAM_API_KEY);

        const user={
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic,
        }
         console.log("🧑‍💻 Stream Video user info:", user);
        const videoClient = new StreamVideoClient({      
          apiKey:STREAM_API_KEY,
          user,
          token:tokendata,
        })
  
        const callInstance = videoClient.call("default",callId)
        await callInstance.join({create:true})
        console.log("Joined call successfully")
        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      }
      finally{
        setIsConnecting(false)
      }
    }

    initCall()
  },[tokendata,authUser,callId])

  if(isLoading || isConnecting) return <PageLoader/>
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
       {
        client && call ?(
         <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ):(
          <div className="flex items-center justify-center h-full">
          <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )
       }

      </div>    
    </div>
  )
}

const CallContent = () =>{
  
    const {useCallCallingState} = useCallStateHooks()
     const callingState = useCallCallingState();
    const navigate = useNavigate()

    if (callingState === CallingState.LEFT) return navigate("/");
    return (
      <StreamTheme>
        <SpeakerLayout/>
        <CallControls/> 
      </StreamTheme>
  )
}
export default CallPage
