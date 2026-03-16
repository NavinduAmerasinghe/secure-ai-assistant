import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPasteSubmission, uploadSubmissionFile } from "../services/submissionService";

const SubmissionPage = () => {
  const navigate = useNavigate();

  const [pasteContent, setPasteContent] = useState("");
  const [pasteLanguage, setPasteLanguage] = useState("python");

  const [file, setFile] = useState(null);
  const [fileLanguage, setFileLanguage] = useState("python");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createPasteSubmission({
        content: pasteContent,
        language: pasteLanguage,
      });
      setMessage("Paste submission created successfully");
      setPasteContent("");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to submit code");
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      await uploadSubmissionFile(file, fileLanguage);
      setMessage("File uploaded successfully");
      setFile(null);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to upload file");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>New Submission</h2>

      <div style={{ marginBottom: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
        <h3>Paste Code</h3>
        <form onSubmit={handlePasteSubmit}>
          <div>
            <label>Language</label><br />
            <select value={pasteLanguage} onChange={(e) => setPasteLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Code</label><br />
            <textarea
              rows="12"
              cols="80"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>Submit Pasted Code</button>
        </form>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
        <h3>Upload File</h3>
        <form onSubmit={handleFileSubmit}>
          <div>
            <label>Language</label><br />
            <select value={fileLanguage} onChange={(e) => setFileLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>Upload File</button>
        </form>
      </div>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default SubmissionPage;