'use client';

import React, { useState, DragEvent } from 'react';

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('No file selected.');
      return;
    }
    console.log('Uploading:', file);
    setMessage('Upload successful!');
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={uploadContainerStyle}>
        <h2 style={headingStyle}>Upload Your Document</h2>
        <div style={stepContainerStyle}>
          <button style={{ ...stepButtonStyle, backgroundColor: '#b2c4cc' }}>Upload</button>
          <button style={stepButtonStyle}>Customise</button>
          <button style={stepButtonStyle}>Process</button>
        </div>
        <p style={descriptionStyle}>Upload your lecture slides or notes. We support PDF, PPTX and JPEG formats.</p>
        <div
          style={dropzoneStyle}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <div style={toiletStyle}>🪠</div>
          <p>Drag and drop to dump</p>
          <input type="file" id="fileInput" onChange={handleFileSelect} hidden />
          <label htmlFor="fileInput" style={selectButtonStyle}>Select File</label>
          {file && <p style={selectedFileStyle}>Selected: {file.name}</p>}
        </div>
        <div style={actionRowStyle}>
          <button style={cancelButtonStyle}>Cancel</button>
          <button style={uploadButtonStyle} onClick={handleUpload}>Upload</button>
        </div>
        {message && <p style={{ marginTop: '20px', color: '#CD5C5C', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
}

const pageWrapperStyle: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const uploadContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#d1d1d1',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const headingStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '2rem',
  marginBottom: '1.5rem',
};

const stepContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '1rem',
};

const stepButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#e0e0e0',
  cursor: 'pointer',
  fontFamily: 'JetBrains Mono, monospace',
};

const descriptionStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  marginBottom: '1rem',
};

const dropzoneStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  height: '200px',
  border: '2px dashed #999',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '1rem',
  textAlign: 'center',
};

const toiletStyle: React.CSSProperties = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
};

const selectButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  backgroundColor: '#efefef',
  cursor: 'pointer',
};

const selectedFileStyle: React.CSSProperties = {
  marginTop: '0.5rem',
  fontSize: '0.9rem',
  color: 'green',
};

const actionRowStyle: React.CSSProperties = {
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '400px',
};

const cancelButtonStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  padding: '0.5rem 1rem',
  backgroundColor: '#ccc',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

const uploadButtonStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  padding: '0.5rem 1rem',
  backgroundColor: '#a4b465',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};
