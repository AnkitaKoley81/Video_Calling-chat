// import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import NotificationPage from "./pages/NotificationPage";
import OnboardingPage from "./pages/OnboardingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import { Toaster } from "react-hot-toast";
// import { useQuery } from '@tanstack/react-query'
// import axios from "axios";
// import { axiosInstance } from './lib/axios'
import PageLoader from "./components/PageLoader";
// import { getAuthUser } from './lib/api'
import useAuthUser from "./hook/useAuthUser";
import Layout from "./components/Layout";
// import { useState } from 'react'

import { useThemeStore } from "./store/useThemeStore";
import FriendsPage from "./pages/FriendsPage";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();


  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-200" data-theme={theme}>
      {/* <button onClick={()=>setTheme("night")}>update to night</button> */}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
////////////////////////////////////////////////////////////////////////////////////////
// console.log("authUser:", authUser);
// console.log("isAuthenticated:", isAuthenticated);
// console.log("isOnboarded:", isOnboarded);

// const { data:authData, isLoading } = useQuery({
//   queryKey: ["authUser"],
//   queryFn: getAuthUser,
//   retry: false,//auth check  "If the request fails, do NOT retry it."
// });

// const authUser = authData?.user

// if(isLoading) return <PageLoader/>

/////////////////////////////////////////////////////////////////////////////////////////

{
  /* <Route path="/" element={isAuthenticated?<HomePage/>:<Navigate to="/login"/>}/>
      <Route path="/signup" element={!isAuthenticated?<SignUpPage/>:<Navigate to="/"/>}/>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
      <Route path="/notifications" element={isAuthenticated?<NotificationPage/>:<Navigate to="/login"/>}/>
      <Route path="/call" element={isAuthenticated?<CallPage/>:<Navigate to="/login"/>}/>
      <Route path="/chat" element={isAuthenticated?<ChatPage/>:<Navigate to="/login"/>}/>
      <Route path="/onboarding" element={isAuthenticated?<OnboardingPage/>:<Navigate to="/login"/>}/> */
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

//  console.log(isLoading)
//  console.log(error)
//tanstack query CRASH COURSE
//delete=>post,put,delete
//get
// const {data,isLoading,error} = useQuery({
//   queryKey:"todos",
//   queryFn: async () =>{
//     const res = await fetch("https://jsonplaceholder.typicode.com/todos");
//     const data = await res.json();
//     return data;
//   },
// })
// console.log(data)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//{data,isLoading,error}=useQuery("") --IMP

//{/* //axios
//react query tanstack query */}
// const [data,setData] = useState([]);
// const [isLoading,setIsLoading] = useState(false);
// const [error,setError] = useState(null);

//   useEffect(()=>{
//   const getData = async ()=>{
//     setIsLoading(true)
//    try {
//     const data = await fetch("https://jsonplaceholder.typicode.com/todos")
//     const json = await data.json();
//     setData(json);
//    } catch (error) {
//     setError(error)
//    }
//    finally{
//       setIsLoading(false)
//    }
//   }

//   getData();
// },[]);

// console.log(data)
//////////////////////////////////////////////////////////////////////////////////////////////////////
