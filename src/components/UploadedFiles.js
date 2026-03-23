// components/UploadedFiles.js
import React, { useEffect } from "react";
import {
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const UploadedFiles = ({ gstn, returnType, uploadedFiles, setUploadedFiles }) => {
  const toast = useToast();

  useEffect(() => {
    if (!gstn.trim()) {
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
  }, [gstn, returnType, setUploadedFiles]);

  const handleDelete = async (fileName) => {
    const confirmed = window.confirm(`Delete ${fileName}?`);
    if (!confirmed) return;

    try {
      await fetch(
        `http://localhost:8000/delete/?gstn=${gstn.trim()}&return_type=${returnType}&filename=${encodeURIComponent(fileName)}`,
        { method: "DELETE" }
      );
      setUploadedFiles(uploadedFiles.filter((f) => f !== fileName));
      toast({
        title: "File deleted.",
        status: "info",
        duration: 3000,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Failed to delete file.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Uploaded files</span>
        <span className="card-sub">
          GSTIN: {gstn || "—"} · {returnType || "—"}
        </span>
      </div>
      <div className="card-body">
        {uploadedFiles.length === 0 ? (
          <Text fontSize="xs" color="var(--text-3)">
            No files uploaded yet.
          </Text>
        ) : (
          <div className="uploaded-files-scroll" aria-label="Uploaded files list">
            {uploadedFiles.map((fileName, index) => (
              <div className="file-row" key={index}>
                <span className="fname" title={fileName}>
                  {fileName}
                </span>
                <div className="file-actions">
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(fileName)}
                    aria-label={`Delete ${fileName}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};  

export default UploadedFiles;
