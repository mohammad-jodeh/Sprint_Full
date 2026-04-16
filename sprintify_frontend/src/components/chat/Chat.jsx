import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatWindow from "./ChatWindow";
import ChannelsList from "./ChannelsList";
import useAuthStore from "../../store/authstore";
import {
  createChatChannel,
  getChatChannels,
  getChatMessages,
  sendChatMessage,
} from "../../api/chat";
import "./Chat.css";

const Chat = ({ projectId }) => {
  const { user } = useAuthStore();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("Chat connected:", newSocket.id);
    });

    newSocket.on("message-received", (data) => {
      if (data.channelId === selectedChannel?.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random(),
            ...data,
            createdAt: new Date(),
            author: user,
          },
        ]);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChannel?.id, user]);

  // Fetch channels
  useEffect(() => {
    if (!projectId) return;

    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const response = await getChatChannels(projectId);
        const channelList = response.data;
        setChannels(channelList);

        // Auto-select first channel
        if (channelList.length > 0 && !selectedChannel) {
          setSelectedChannel(channelList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [projectId]);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getChatMessages(selectedChannel.id);
        setMessages(response.data);

        // Join channel in Socket.IO
        socket?.emit("join-channel", selectedChannel.id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Leave previous channel
    return () => {
      // socket?.emit("leave-channel", selectedChannel.id);
    };
  }, [selectedChannel, socket]);

  const handleCreateChannel = async (channelData) => {
    try {
      const response = await createChatChannel(channelData);
      const newChannel = response.data;
      setChannels((prev) => [...prev, newChannel]);
      setSelectedChannel(newChannel);
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChannel) return;

    try {
      const response = await sendChatMessage(selectedChannel.id, { content });
      const newMessage = response.data;

      setMessages((prev) => [...prev, newMessage]);

      // Emit through Socket.IO for real-time
      socket?.emit("send-message", {
        channelId: selectedChannel.id,
        content,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-container">
      <ChannelsList
        channels={channels}
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
        onCreateChannel={handleCreateChannel}
        projectId={projectId}
      />
      <ChatWindow
        channel={selectedChannel}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        currentUser={user}
      />
    </div>
  );
};

export default Chat;
