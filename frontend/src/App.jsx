import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setOriginalImage(reader.result);
    reader.readAsDataURL(file);

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/remove-bg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProcessedImage(response.data.image);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',  
    multiple: false,    
  });

  return (
    <div className="app">
      <h1>Background Remover</h1>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select a file</p>
        )}
      </div>
      {originalImage && (
        <div className="image-container">
          <h2>Original Image</h2>
          <img src={originalImage} alt="Original" className="image" />
        </div>
      )}
      {loading && <p>Processing...</p>}
      {processedImage && (
        <div className="image-container">
          <h2>Background Removed</h2>
          <img src={processedImage} alt="Processed" className="image" />
          <a href={processedImage} download="background-removed.png">
            <button>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;