import api from "./api";

export const createPasteSubmission = async (payload) => {
  const response = await api.post("/submissions/paste", payload);
  return response.data;
};

export const uploadSubmissionFile = async (file, language) => {
  const formData = new FormData();
  formData.append("file", file);
  if (language) {
    formData.append("language", language);
  }

  const response = await api.post("/submissions/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get("/submissions/");
  return response.data;
};

export const getSubmissionById = async (submissionId) => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data;
};