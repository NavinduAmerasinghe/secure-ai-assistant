import api from './api';

export const listKnowledgeBaseFiles = async () => {
  const response = await api.get('/knowledge-base/list');
  return response.data;
};

export const getKnowledgeBaseFile = async (path) => {
  const response = await api.get(`/knowledge-base/file/${encodeURIComponent(path)}`);
  return response.data;
};
