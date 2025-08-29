import api from "./config";

export const createIssueLink = async (sourceId, targetId) =>
  (await api.post("/issue_links", { sourceId, targetId })).data;
export const deleteIssueLink = async (id) =>
  (await api.delete(`/issue_links/${id}`)).data;
export const fetchIssueLinks = async (issueId) =>
  (await api.get(`/issue_links?sourceId=${issueId}`)).data;