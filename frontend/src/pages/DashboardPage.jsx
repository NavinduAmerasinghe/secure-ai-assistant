import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySubmissions } from "../services/submissionService";
import { getScansForSubmission, runScan } from "../services/scanService";

const DashboardPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scanMap, setScanMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const submissionData = await getMySubmissions();
      setSubmissions(submissionData);

      const scansBySubmission = {};
      for (const submission of submissionData) {
        const scans = await getScansForSubmission(submission.id);
        scansBySubmission[submission.id] = scans;
      }
      setScanMap(scansBySubmission);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async (submissionId) => {
    try {
      await runScan(submissionId);
      await loadData();
    } catch (error) {
      alert(error?.response?.data?.detail || "Scan failed");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Dashboard</h2>
      <p><Link to="/submit">Create a new submission</Link></p>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
            style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
          >
            <p><strong>ID:</strong> {submission.id}</p>
            <p><strong>Type:</strong> {submission.input_type}</p>
            <p><strong>Language:</strong> {submission.language || "Not specified"}</p>
            <p>
              <strong>Filename:</strong>{" "}
              {submission.original_filename || "Pasted content"}
            </p>

            <button onClick={() => handleRunScan(submission.id)} style={{ marginRight: "1rem" }}>
              Run Scan
            </button>

            <div style={{ marginTop: "1rem" }}>
              <strong>Scans:</strong>
              {scanMap[submission.id]?.length ? (
                <ul>
                  {scanMap[submission.id].map((scan) => (
                    <li key={scan.id}>
                      <Link to={`/scan/${scan.id}`}>
                        Scan #{scan.id} - {scan.summary}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No scans yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardPage;