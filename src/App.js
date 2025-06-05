import React, { useState, useEffect } from "react";
import "./App.css";

const RETURN_TYPES = ["GSTR-1", "GSTR-2A", "GSTR-3B", "GSTR-9", "EWB-IN", "EWB-OUT"];

function App() {
  const [gstn, setGstn] = useState("");
  const [returnType, setReturnType] = useState("GSTR-1");
  const [files, setFiles] = useState([]);
  const [uploadPaths, setUploadPaths] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch uploaded files when GSTIN or returnType changes
  useEffect(() => {
    if (gstn.trim() === "") {
      setUploadedFiles([]);
      return;
    }

    const fetchUploadedFiles = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/files/?gstn=${gstn.trim()}&return_type=${returnType}`
        );
        const data = await res.json();
        setUploadedFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        setUploadedFiles([]);
      }
    };

    fetchUploadedFiles();
  }, [gstn, returnType]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setUploadPaths([]);
    setDownloadLink("");
  };

  const handleUpload = async () => {
    if (gstn.trim() === "") {
      alert("Please enter GSTIN before uploading.");
      return;
    }
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("gstn", gstn.trim());
    formData.append("return_type", returnType);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadPaths(data.file_paths);
      setStatus("Upload complete. Ready to process.");

      // Refresh the uploaded files list after upload
      const res2 = await fetch(
        `http://localhost:8000/files/?gstn=${gstn.trim()}&return_type=${returnType}`
      );
      const data2 = await res2.json();
      setUploadedFiles(data2.files || []);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Upload failed.");
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      await fetch(
        `http://localhost:8000/delete/?gstn=${gstn.trim()}&return_type=${returnType}&filename=${encodeURIComponent(fileName)}`,
        { method: "DELETE" }
      );
      setUploadedFiles(uploadedFiles.filter(f => f !== fileName));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the file.");
    }
  };


  const handleGenerateMaster = async () => {
    setStatus("Generating master sheets...");
    const formData = new FormData();
    formData.append("gstn", gstn.trim());
  
    try {
      const res = await fetch("http://localhost:8000/generate_master/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Reports:", data.reports);
      setStatus("Master sheets generated successfully.");
    } catch (err) {
      console.error("Error generating master sheets", err);
      setStatus("Error generating master sheets.");
    }
  };
  

  return (
    <>
      <div className="ribbon">
        <span className="ribbon-title">GST Scrutiny Tool</span>
        <div className="search-container">
          <input type="text" placeholder="Enter GSTIN to search" />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="App">
        <label htmlFor="gstnInput" style={{ fontWeight: "bold" }}>
          Enter GSTIN:
        </label>
        <input
          id="gstnInput"
          type="text"
          placeholder="Enter GSTIN here"
          value={gstn}
          onChange={(e) => setGstn(e.target.value.toUpperCase())}
          style={{
            margin: "0.5rem 0 1.5rem",
            padding: "0.6rem",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            textTransform: "uppercase",
          }}
        />

        <p>Select GST Return Type:</p>
        <div className="button-group">
          {RETURN_TYPES.map((type) => (
            <button
              key={type}
              className={returnType === type ? "active" : ""}
              onClick={() => setReturnType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <input type="file" multiple onChange={handleFileChange} />

        <div className="actions">
          <button onClick={handleUpload}>Upload</button>
          <button onClick={handleGenerateMaster} disabled={!gstn}>
            Generate Master Sheets
          </button>
        </div>

        <p className="status">{status}</p>

        {downloadLink && (
          <a href={downloadLink} download>
            <button className="download">⬇ Download Report</button>
          </a>
        )}

        <hr style={{ margin: "2rem 0" }} />

        <h3>Uploaded files for GSTIN: {gstn || "(none)"} | Return Type: {returnType}</h3>
        {uploadedFiles.length > 0 && (
          <div className="file-list">
            {uploadedFiles.map((fileName, index) => (
              <div key={index} className="file-item">
                📄 {fileName}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(fileName)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}


      </div>
    </>
  );
}

export default App;
