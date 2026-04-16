import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import io from "socket.io-client";
import { getChatChannels, createChatChannel, sendChatMessage } from "../../api/chat";
import useAuthStore from "../../store/authstore";
import "./ChatSidebar.css";

const ChatSidebar = ({ projectId }) => {
  const { user } = useAuthStore();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [socket, setSocket] = useState(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [channelName, setChannelName] = useState("");

  // Initialize Socket.IO
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !projectId) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("Chat sidebar connected");
    });

    newSocket.on("message-received", (data) => {
      if (data.channelId !== selectedChannel?.id) {
        setNewMessageCount((prev) => prev + 1);
      }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [projectId, selectedChannel?.id]);

  // Fetch channels
  useEffect(() => {
    if (!projectId) return;

    const fetchChannels = async () => {
      try {
        const response = await getChatChannels(projectId);
        setChannels(response.data);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    fetchChannels();
  }, [projectId]);

  const handleCreateChannel = async () => {
    if (channelName.trim() === "") return;

    try {
      const response = await createChatChannel({
        name: channelName,
        projectId,
        isDirectMessage: false,
      });
      setChannels((prev) => [...prev, response.data]);
      setChannelName("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  };

  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    setNewMessageCount(0);
  };

  const publicChannels = channels.filter((c) => !c.isDirectMessage);

  return (
    <div className="chat-sidebar-container">
      <div className="chat-sidebar-header" onClick={() => setIsExpanded(!isExpanded)}>
        <MessageCircle size={18} />
        <span className="chat-title">Chat</span>
        {newMessageCount > 0 && (
          <span className="message-badge">{newMessageCount}</span>
        )}
      </div>

      {isExpanded && (
        <div className="chat-sidebar-content">
          <div className="chat-channels-header">
            <button
              className="create-channel-icon-btn"
              onClick={() => setShowCreateModal(true)}
              title="Create channel"
            >
              +
            </button>
          </div>

          <div className="chat-channels-list">
            {publicChannels.length === 0 ? (
              <div className="no-channels">
                <p>No channels</p>
              </div>
            ) : (
              publicChannels.map((channel) => (
                <button
                  key={channel.id}
                  className={`chat-channel-item ${
                    selectedChannel?.id === channel.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectChannel(channel)}
                >
                  <span className="channel-hash">#</span>
                  <span className="channel-name">{channel.name}</span>
                </button>
              ))
            )}
          </div>

          {selectedChannel && (
            <ChatQuickPreview
              channel={selectedChannel}
              onSendMessage={(content) => {
                socket?.emit("send-message", {
                  channelId: selectedChannel.id,
                  content,
                });
              }}
            />
          )}
        </div>
      )}

      {showCreateModal && (
        <div
          className="modal-overlay-chat"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content-chat"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>New Channel</h3>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateChannel();
              }}
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={handleCreateChannel}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatQuickPreview = ({ channel, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    if (messageInput.trim() === "") return;
    onSendMessage(messageInput);
    setMessageInput("");
  };

  return (
    <div className="chat-quick-preview">
      <div className="quick-preview-header">{channel.name}</div>
      <div className="quick-message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend} disabled={messageInput.trim() === ""}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
