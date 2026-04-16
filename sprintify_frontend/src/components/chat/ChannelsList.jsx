import React, { useState } from "react";
import { Plus, ChevronDown, Hash } from "lucide-react";
import "./ChannelsList.css";

const ChannelsList = ({
  channels,
  selectedChannel,
  onSelectChannel,
  onCreateChannel,
  projectId,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  const handleCreateChannel = () => {
    if (channelName.trim() === "") return;
    
    onCreateChannel({
      name: channelName,
      description: channelDescription,
      projectId,
      isDirectMessage: false,
    });

    setChannelName("");
    setChannelDescription("");
    setShowCreateModal(false);
  };

  const regularChannels = channels.filter((c) => !c.isDirectMessage);
  const directMessages = channels.filter((c) => c.isDirectMessage);

  return (
    <div className="channels-list">
      <div className="channels-header">
        <h3>Channels</h3>
        <button
          className="create-channel-btn"
          onClick={() => setShowCreateModal(true)}
          title="Create new channel"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Regular Channels */}
      {regularChannels.length > 0 && (
        <div className="channel-group">
          <div className="group-label">Public Channels</div>
          {regularChannels.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${
                selectedChannel?.id === channel.id ? "active" : ""
              }`}
              onClick={() => onSelectChannel(channel)}
            >
              <Hash size={16} />
              <span className="channel-name">{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Direct Messages */}
      {directMessages.length > 0 && (
        <div className="channel-group">
          <div className="group-label">Direct Messages</div>
          {directMessages.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${
                selectedChannel?.id === channel.id ? "active" : ""
              }`}
              onClick={() => onSelectChannel(channel)}
            >
              <span className="dm-indicator">●</span>
              <span className="channel-name">{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {channels.length === 0 && (
        <div className="empty-channels">
          <p>No channels yet</p>
          <button onClick={() => setShowCreateModal(true)}>
            Create one
          </button>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Channel</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateChannel(); }}>
              <div className="form-group">
                <label>Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="general"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="What's this channel about?"
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={channelName.trim() === ""}
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsList;
