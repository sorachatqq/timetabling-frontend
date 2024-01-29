'use client';

import React, { useState } from 'react';
import { Button } from '@tremor/react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      uploadFile(file).then(() => {
        alert('File uploaded successfully');
      }).catch((error) => {
        alert('File upload failed: ' + error.message);
      });
    } else {
      alert('Please select a file first.');
    }
  };

  // Correctly typed style object
  const centerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',   
    justifyContent: 'center', 
    height: '50vh'
  };
  
  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px'
  };
  
  const textStyle: React.CSSProperties = {
    marginTop: '10px',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    marginLeft: '10px'
  };


  return (
    <div style={centerStyle}>
      <div style={buttonContainerStyle}>
        <input type="file" onChange={handleFileChange} />
        <Button style={{ marginLeft: '10px' }} onClick={handleFileUpload}>Upload</Button>
      </div>
      <div style={textStyle}>
        {file && <p>File ready to upload: {file.name}</p>}
      </div>
    </div>
  );
}

function uploadFile(file: File) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (file.name) {
        resolve();
      } else {
        reject(new Error('Failed to upload file'));
      }
    }, 1000);
  });
}

export const config = {
  runtime: 'client',
};
