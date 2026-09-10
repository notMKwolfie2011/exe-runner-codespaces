function Viewer({ file, onRun, output, running }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="viewer">
      <div className="file-details">
        <h2>📋 File Details</h2>
        <div className="detail-item">
          <span className="label">Filename:</span>
          <span className="value">{file.name}</span>
        </div>
        <div className="detail-item">
          <span className="label">Size:</span>
          <span className="value">{formatFileSize(file.size)}</span>
        </div>
        <div className="detail-item">
          <span className="label">Type:</span>
          <span className="value">Executable</span>
        </div>
        
        <button
          className={`btn-large ${running ? 'loading' : ''}`}
          onClick={() => onRun(file.name)}
          disabled={running}
        >
          {running ? '⏳ Running...' : '▶ Run Executable'}
        </button>
      </div>

      <div className="output-section">
        <h3>📺 Output</h3>
        <div className="output-box">
          <pre>{output || 'No output yet. Run the executable to see results.'}</pre>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
