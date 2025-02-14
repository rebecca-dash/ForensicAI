import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import axios from "axios";
//    //"start": "react-scripts start",
    //"build": "react-scripts build",
    //"test": "react-scripts test",
    //"eject": "react-scripts eject"
//
  export default function ForensicUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [report, setReport] = useState(null);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
        const response = await axios.post("http://localhost:8000/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setReport(response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
  
    return (
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">Forensic Image Analyzer</h1>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Upload & Analyze
        </button>
        {report && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold">Forensic Report</h2>
            <pre className="mt-2 p-2 bg-white border rounded">{JSON.stringify(report, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
