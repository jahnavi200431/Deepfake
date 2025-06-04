import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import userIcon from './download.png';

function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      alert('Please upload an image or video file.');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setDetectionResult(null); // Reset result on new upload
  };

  const handleDetect = () => {
    if (!file) {
      alert('Please upload an image or video first!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const isDeepfake = Math.random() > 0.5 ? 'Yes' : 'No';
      setDetectionResult(isDeepfake);
      setLoading(false);

      const activity = {
        fileName: file.name,
        result: isDeepfake,
        timestamp: new Date().toLocaleString(),
      };
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history.push(activity);
      localStorage.setItem('history', JSON.stringify(history));
    }, 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Main container */}
      <div className="home-container" ref={containerRef}>
        <div className="dashboard-icon" onClick={() => navigate('/dashboard')}>
          <img src={userIcon} alt="Dashboard" />
        </div>

        <div className="home-card preview-layout">
          <div className="left-section">
            <h2>Deepfake Detection</h2>
            <div className="upload-container">
              <input type="file" id="fileUpload" onChange={handleFileChange} />
              <label htmlFor="fileUpload" className="upload-label">
                Choose File
              </label>
              <button className="detect-btn" onClick={handleDetect} disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Detect Deepfake'}
              </button>
            </div>

            {detectionResult && (
              <div className={`result ${detectionResult === 'Yes' ? 'result-yes' : 'result-no'}`}>
                <h3>Detection Result: {detectionResult}</h3>
              </div>
            )}
          </div>

          <div className="right-section">{/* Optional: you can keep it blank */}</div>
        </div>
      </div>

      {/* Preview Box - Floated Outside */}
      {previewUrl && (
        <div className="external-preview-box">
          {file.type.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" className="preview-media" />
          ) : (
            <video controls src={previewUrl} className="preview-media" />
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
