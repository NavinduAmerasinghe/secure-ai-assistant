import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScanResult } from "../services/scanService";
import VulnerabilityCard from "../components/VulnerabilityCard";

const ScanResultPage = () => {
  const { scanId } = useParams();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScanResult = async () => {
      try {
        const data = await getScanResult(scanId);
        setScanResult(data);
      } catch (error) {
        console.error("Failed to load scan result", error);
      } finally {
        setLoading(false);
      }
    };

    loadScanResult();
  }, [scanId]);

  if (loading) {
    return <p>Loading scan result...</p>;
  }

  if (!scanResult) {
    return <p>Scan result not found.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Scan Result #{scanResult.id}</h2>
      <p><strong>Submission ID:</strong> {scanResult.submission_id}</p>
      <p><strong>Status:</strong> {scanResult.status}</p>
      <p><strong>Summary:</strong> {scanResult.summary}</p>

      <h3>Vulnerabilities</h3>
      {scanResult.vulnerabilities?.length ? (
        scanResult.vulnerabilities.map((vuln) => (
          <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
        ))
      ) : (
        <p>No vulnerabilities found.</p>
      )}
    </div>
  );
};

export default ScanResultPage;