import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js"
export async function getRecommendedUsers(req, res) {
  try{
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
        $and:[
            {_id:{$ne:currentUserId}},//exclude current user
            {_id:{$nin:currentUser.friends}}, //excliude current user's friends
            {isOnboarded:true}
        ]
    })
    res.status(200).json(recommendedUsers)
  }
  catch(error){
   console.log("Error in getRecommendedUsers controller",error.message);
   res.status(500).json({message:"Internal Server Error"})
  }

}
/////////////////////////////////////////////////////////////////////////////////////
export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");//when you want to grab the data not only the ids

        res.status(200).json(user.friends);

    } catch (error) {
        console.error("Error in getMyFriends controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }


}

////////////////////////////////////////////////////////////////////////////////////////////

export async function sendFriendRequest(req,res){
    try {
      const myId = req.user.id;
      const {id:recipientId} = req.params
      const friendId = req.params;

      //PREVENT SENDING REQ TO YOURSELF
      if(myId===recipientId){
        return res.status(400).json({message:"You can't send friend request to yourself"});
      }
         // check if user is already friends
      const recipient = await User.findById(recipientId);
      if(!recipient){
        return res.status(404).json({message:"User not found"});
      }
      //CHECK USER IS ALREADY FRIEND
      if(recipient.friends.includes(myId)){
        return res.status(400).json({message:"You are already friends with this user"});
      }

      //CHECK IF A REQUEST IS ALREADY EXISTS
      const existingRequest = await FriendRequest.findOne({
        $or:[
            {sender:myId,recipient:recipientId},
            {sender: recipientId, recipient: myId}
        ]
      });
      if (existingRequest) {
      return res.status(400).json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
        sender:myId,
        recipient:recipientId
    })

    res.status(201).json(friendRequest);

    } catch (error) {
       console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });  
    }
}

//////////////////////////////////////////////////////////////////////


export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

     //Verify that the current req is thre recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save(); // ✅ await lagao
   
    //Sender ke friends array me recipient ko add kiya.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
////////////////////////////////////////////////////////////////////////////////////////
export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Make sure the logged-in user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    // Remove the friend request (you could also update status to "rejected" if you want to keep history)
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error in rejectFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

///////////////////////////////////////////////////////////////////////////////////////
export async function getFriendRequest(req,res){
    try {
        const incomingReqs = await FriendRequest.find({
          recipient:req.user.id, // Tum ho recipient   
          status:"pending" ,  //abhi tk accept nhi hua hai
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        const acceptedReqs = await FriendRequest.find({
            sender:req.user.id, // Tumne bheji thi
            status:"accepted",  // Samne wale ne accept kar li
        }).populate("recipient","fullName profilePic")

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}




export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({ outgoingFriendReqs: outgoingRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

