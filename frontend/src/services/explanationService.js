import api from "./api";

export const generateExplanation = async (vulnerabilityId) => {
  const response = await api.post(`/explanations/generate/${vulnerabilityId}`);
  return response.data;
};

export const getExplanation = async (vulnerabilityId) => {
  const response = await api.get(`/explanations/vulnerability/${vulnerabilityId}`);
  return response.data;
};