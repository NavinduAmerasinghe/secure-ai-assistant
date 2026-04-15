import React, { useEffect, useState } from 'react';
import { listKnowledgeBaseFiles, getKnowledgeBaseFile } from '../services/knowledgeBaseService';

const KnowledgeBasePage = () => {
  const [files, setFiles] = useState({});
  const [selectedPath, setSelectedPath] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listKnowledgeBaseFiles().then(setFiles);
  }, []);

  const handleSelect = async (path) => {
    setSelectedPath(path);
    setLoading(true);
    try {
      const response = await fetch(`/api/knowledge-base/file/${encodeURIComponent(path)}`);
      if (response.ok) {
        const text = await response.text();
        setFileContent(text);
      } else {
        setFileContent('Failed to load file.');
      }
    } catch {
      setFileContent('Error loading file.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ minWidth: 300 }}>
        <h2>Knowledge Base Files</h2>
        <ul>
          {Object.keys(files).map((key) => (
            <li key={key}>
              <button onClick={() => handleSelect(files[key])} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textAlign: 'left' }}>
                {key}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h2>File Content</h2>
        {loading ? <p>Loading...</p> : <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>{fileContent}</pre>}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
