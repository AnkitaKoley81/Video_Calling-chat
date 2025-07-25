import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hook/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  //GET
  const { data: token, isSuccess } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //THIS WILL RUN ONLY AUTH USER IS AVAILABLE
  });

  useEffect(() => {
    const initChat = async () => {
      if (!token || !authUser) return;
      try {
        console.log("✅ Stream token:", token);
        console.log("📡 STREAM_API_KEY:", STREAM_API_KEY); // this should print the actual key
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token // ✅ Ensure this is a string, not an object
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const members = [authUser._id, targetUserId];
        const uniqueMembers = [...new Set(members)];
        const currChannel = client.channel("messaging", channelId, {
          members: uniqueMembers,
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [token, authUser, targetUserId]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I have started a video call . Join me here : ${callUrl}`,
      });
      toast.success("Video call link successfully");
    }
  };

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
