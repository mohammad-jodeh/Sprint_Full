import { APIClient } from "../../utils/api";

const API = new APIClient();

export const createChatChannel = async (channelData) => {
  return API.post("/chat/channels", channelData);
};

export const getChatChannels = async (projectId) => {
  return API.get(`/chat/channels/${projectId}`);
};

export const getChatMessages = async (channelId, limit = 50, offset = 0) => {
  return API.get(
    `/chat/${channelId}/messages?limit=${limit}&offset=${offset}`
  );
};

export const sendChatMessage = async (channelId, messageData) => {
  return API.post(`/chat/${channelId}/messages`, messageData);
};

export const editChatMessage = async (messageId, content) => {
  return API.patch(`/chat/messages/${messageId}`, { content });
};

export const deleteChatMessage = async (messageId) => {
  return API.delete(`/chat/messages/${messageId}`);
};

export const addChannelMember = async (channelId, memberId) => {
  return API.post(`/chat/${channelId}/members`, { memberId });
};

export const removeChannelMember = async (channelId, memberId) => {
  return API.delete(`/chat/${channelId}/members`, { memberId });
};
