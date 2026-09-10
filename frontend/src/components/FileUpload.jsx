import { useState } from 'react';

function FileUpload({ onUpload, loading }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      className={`upload-box ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <div className="upload-icon">📤</div>
        <h3>Upload Executable</h3>
        <p>Drag and drop or click to select</p>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          accept=".exe,.msi,.bat,.cmd,.com"
          className="file-input"
        />
        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
}

export default FileUpload;
