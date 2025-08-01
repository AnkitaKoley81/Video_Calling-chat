import { axiosInstance } from "./axios";

export const signup = async(signupData) =>{
    const response = await axiosInstance.post("/auth/signup",signupData);
    localStorage.setItem("jwt",response.data.jwt)
    console.log("response", response)
    return response.data;
}
////////////////////////////////////////////////////////////////////////////////////
export const getAuthUser = async() =>{
    try {
        const res=await axiosInstance.get("/auth/me");
    return res.data
    } catch (error) {
        console.log("Error in getAuthUser",error);
        return null;
    }
}
////////////////////////////////////////////////////////////////////////////////////
export  const completeOnboarding = async(userData)=>{
   const response = await axiosInstance.post("/auth/onboarding",userData) 
   return response.data;
}
//////////////////////////////////////////////////////////////////////////////////////
export const login = async(loginData) =>{


    const response = await axiosInstance.post("/auth/login",loginData);
    localStorage.setItem("jwt",response.data.token);
    return response.data;
}
///////////////////////////////////////////////////////////////////////////////////////

export const logout = async () => {
    localStorage.removeItem("jwt");
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
///////////////////////////////////////////////////////////////////////////////////////
export  async function getUserFriends(){
 const response = await axiosInstance.get("/users/friends");
 return response.data;
}
///////////////////////////////////////////////////////////////////////////////////////
export  async function getRecommendedUsers(){
   const response = await axiosInstance.get("/users");
 return response.data; 
}
///////////////////////////////////////////////////////////////////////////////////////
export async function getoutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-request");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export const rejectFriendRequest = async (requestId) => {
  const res = await axiosInstance.delete(`/users/friend-request/${requestId}/reject`);
  return res.data;
};

export async function getStreamToken() {
  console.log("📡 Calling /chat/token endpoint..."); // ✅ This should show

  try {
    const res = await axiosInstance.get("/chat/token");
    return res.data.token;
  } catch (error) {
    console.error("❌ Failed to fetch Stream token:", error);
    throw new Error("Could not get Stream token");
  }
}





