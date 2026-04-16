import React, { useState, useEffect, useRef } from "react";
import { Send, Plus, X } from "lucide-react";
import "./ChatWindow.css";

const ChatWindow = ({
  channel,
  messages,
  onSendMessage,
  onLoadMore,
  isLoading,
  currentUser,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    onSendMessage(messageInput);
    setMessageInput("");
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Emit typing event
    setIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout for stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!channel) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <p>Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{channel.name}</h3>
        {channel.description && (
          <p className="chat-description">{channel.description}</p>
        )}
      </div>

      <div className="messages-container">
        {isLoading && (
          <div className="loading-indicator">
            <span>Loading messages...</span>
          </div>
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className="empty-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.authorId === currentUser?.id ? "own" : "other"
            }`}
          >
            {message.authorId !== currentUser?.id && (
              <img
                src={message.author?.image || "https://via.placeholder.com/32"}
                alt={message.author?.fullName}
                className="avatar"
              />
            )}
            
            <div className="message-content">
              {message.authorId !== currentUser?.id && (
                <p className="sender-name">{message.author?.fullName}</p>
              )}
              <div className="message-bubble">
                <p>{message.content}</p>
                {message.isEdited && (
                  <span className="edited-badge">(edited)</span>
                )}
              </div>
              <p className="message-time">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-area">
        <textarea
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows="2"
          className="message-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={messageInput.trim() === ""}
          className="send-button"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
