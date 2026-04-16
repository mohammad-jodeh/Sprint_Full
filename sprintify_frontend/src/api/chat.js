import { protectedApi } from "./config";

export const createChatChannel = async (channelData) => {
  const response = await protectedApi.post(`/chat/channels`, channelData);
  return response.data;
};

export const getChatChannels = async (projectId) => {
  const response = await protectedApi.get(`/chat/channels/${projectId}`);
  return response.data;
};

export const getChatMessages = async (channelId, limit = 50, offset = 0) => {
  const response = await protectedApi.get(
    `/chat/${channelId}/messages?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const sendChatMessage = async (channelId, messageData) => {
  const response = await protectedApi.post(`/chat/${channelId}/messages`, messageData);
  return response.data;
};

export const editChatMessage = async (messageId, content) => {
  const response = await protectedApi.patch(`/chat/messages/${messageId}`, { content });
  return response.data;
};

export const deleteChatMessage = async (messageId) => {
  const response = await protectedApi.delete(`/chat/messages/${messageId}`);
  return response.data;
};

export const addChannelMember = async (channelId, memberId) => {
  const response = await protectedApi.post(`/chat/${channelId}/members`, { memberId });
  return response.data;
};

export const removeChannelMember = async (channelId, memberId) => {
  const response = await protectedApi.delete(`/chat/${channelId}/members`, { memberId });
  return response.data;
};
