function FileList({ files, selectedFile, onSelect, onDelete, onRun, running }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-list">
      <h3>📁 Uploaded Files ({files.length})</h3>
      {files.length === 0 ? (
        <p className="empty-message">No files uploaded yet</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li
              key={file.name}
              className={`file-item ${selectedFile?.name === file.name ? 'selected' : ''}`}
              onClick={() => onSelect(file)}
            >
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <div className="file-actions">
                <button
                  className="btn-run"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRun(file.name);
                  }}
                  disabled={running}
                  title="Run this executable"
                >
                  ▶
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this file?')) {
                      onDelete(file.name);
                    }
                  }}
                  title="Delete this file"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
