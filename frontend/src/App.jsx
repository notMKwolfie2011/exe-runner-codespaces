import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Viewer from './components/Viewer';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');

  // Use relative API URL to work with any hostname
  const API_URL = '/api';

  // Load files on mount
  useEffect(() => {
    loadFiles();
    const interval = setInterval(loadFiles, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files - backend server may not be running');
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError(null);
      loadFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (filename) => {
    setRunning(true);
    setOutput('Running...');
    try {
      const response = await axios.post(`${API_URL}/run/${filename}`);
      setOutput(response.data.output || 'Process completed');
      setError(null);
    } catch (err) {
      setOutput(err.response?.data?.details || 'Execution failed');
      setError('Failed to run executable');
    } finally {
      setRunning(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_URL}/files/${filename}`);
      setError(null);
      loadFiles();
      if (selectedFile?.name === filename) setSelectedFile(null);
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎮 EXE Runner - Codespaces Edition</h1>
        <p>Upload and run .exe files in your browser</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="main-content">
        <aside className="sidebar">
          <FileUpload onUpload={handleUpload} loading={loading} />
          <FileList
            files={files}
            selectedFile={selectedFile}
            onSelect={setSelectedFile}
            onDelete={handleDelete}
            onRun={handleRun}
            running={running}
          />
        </aside>

        <main className="viewer-section">
          {selectedFile ? (
            <Viewer
              file={selectedFile}
              onRun={handleRun}
              output={output}
              running={running}
            />
          ) : (
            <div className="placeholder">
              <h2>Select a file to view details</h2>
              <p>or upload a new executable to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
