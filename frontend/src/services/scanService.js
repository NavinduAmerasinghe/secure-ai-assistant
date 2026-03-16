import api from "./api";

export const runScan = async (submissionId) => {
  const response = await api.post(`/scans/run/${submissionId}`);
  return response.data;
};

export const getScansForSubmission = async (submissionId) => {
  const response = await api.get(`/scans/submission/${submissionId}`);
  return response.data;
};

export const getScanResult = async (scanResultId) => {
  const response = await api.get(`/scans/${scanResultId}`);
  return response.data;
};