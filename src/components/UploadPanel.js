 // components/UploadPanel.js
 import React, { useRef, useEffect } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

const UploadPanel = ({
  gstn,
  returnType,
  files,
  setFiles,
  setStatus,
  setUploadedFiles,
}) => {
  const toast = useToast();
  const fileInputRef = useRef();

  useEffect(() => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input visually
    }
  }, [returnType, setFiles]);

  const isValidGSTIN = (gstn) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstn);
  };

  const validateAndSetFiles = (selectedFiles) => {
    // Dropped files may come with missing/incorrect MIME types; rely primarily on extension.
    const isPdf = (file) =>
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isXlsx = (file) =>
      file.name.toLowerCase().endsWith(".xlsx") &&
      (!file.type || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    const isXls = (file) => file.name.toLowerCase().endsWith(".xls");

    const pdfOnlyTypes = ["GSTR-3B", "GSTR-9", "GSTR-9C"];
    const excelOnlyTypes = ["GSTR-1", "GSTR-2A", "GSTR-2B", "BO comparison summary"];
    const xlsAllowedTypes = ["EWB-IN", "EWB-OUT"];
    const allPdfs = selectedFiles.every(isPdf);
    const allExcels = selectedFiles.every((file) =>
        isXlsx(file) || (xlsAllowedTypes.includes(returnType) && isXls(file))
    );

    const hasInvalidFormat = selectedFiles.some((file) => {
      if (xlsAllowedTypes.includes(returnType)) {
        return !isPdf(file) && !isXlsx(file) && !isXls(file);
      } else {
        return !isPdf(file) && !isXlsx(file);
      }
    });

    if (hasInvalidFormat) {
      toast({
        title: "Invalid file format.",
        description: xlsAllowedTypes.includes(returnType)
          ? "Only Excel files (.xls) are allowed for EWB-IN and EWB-OUT."
          : "Only .xlsx and .pdf files are supported. .xls and other formats are not allowed.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setFiles([]);
      return;
    }

    
  if (pdfOnlyTypes.includes(returnType)) {
    if (!allPdfs) {
      toast({
        title: `Only PDF files are allowed for ${returnType}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setFiles([]);
      return;
    }
  } 
  else if (excelOnlyTypes.includes(returnType)) {
    if (!allExcels) {
      toast({
        title: `Only Excel files (${
          xlsAllowedTypes.includes(returnType) ? ".xls" : ".xlsx"
        }) are allowed for ${returnType}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setFiles([]);
      return;
    }
  }
    setFiles(selectedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    validateAndSetFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length === 0) return;
    validateAndSetFiles(droppedFiles);
  };

  const handleUpload = async () => {
    if (!gstn.trim()) {
      toast({ title: "Enter GSTIN before uploading.", status: "warning", duration: 3000 });
      return;
    }
    if (files.length === 0) {
      toast({ title: "Select at least one file to upload.", status: "warning", duration: 3000 });
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
      if (!res.ok) {
        // Server responded with 404 or 500
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }
      await res.json();
      setStatus("Upload complete. Ready to process.");

      const res2 = await fetch(
        `http://localhost:8000/files/?gstn=${gstn.trim()}&return_type=${returnType}`
      );
      const data2 = await res2.json();
      setUploadedFiles(data2.files || []);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast({ title: "Files uploaded successfully.", status: "success", duration: 3000 });
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Upload failed.");
      toast({ title: "Upload failed.", status: "error", duration: 3000 });
    }
  };

  return (
    <div className="upload-panel">
      <div className="card upload-panel-card">
        <div className="card-head">
          <span className="card-title">Upload Panel</span>
          <span className="card-sub">{getAcceptedFileTypes(returnType)} format</span>
        </div>
        <div className="card-body upload-panel-body">
          <div
            className="upload-zone"
            role="button"
            tabIndex={0}
            aria-label="Upload files. Drag and drop supported."
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="up-circle" aria-hidden="true">
              <svg viewBox="0 0 18 18">
                <path d="M9 3v9M6 6l3-3 3 3" />
                <path d="M3 14h12" />
              </svg>
            </span>
            <p>Drag &amp; drop files here</p>
            <small>or click to browse — {getAcceptedFileTypes(returnType)} format</small>

            <Input
              id="file-upload"
              type="file"
              multiple
              ref={fileInputRef}
              accept={getAcceptedFileTypes(returnType)}
              onChange={handleFileChange}
              display="none"
            />
          </div>

          <div className="selected-files" aria-label="Selected files list">
            {files.length > 0 ? (
              <>
                <Text fontSize="xs" color="var(--text-3)" mb={2}>
                  Selected: {files.length}
                </Text>
                {files.map((file, idx) => (
                  <div className="file-row" key={idx}>
                    <span className="fname" title={file.name}>
                      {file.name}
                    </span>
                    <div className="file-actions">
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        className="file-del-btn"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => {
                          const updated = files.filter((_, i) => i !== idx);
                          setFiles(updated);
                          if (updated.length === 0 && fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <Text fontSize="xs" color="var(--text-3)">
                No files selected
              </Text>
            )}
          </div>
        </div>
      </div>

      {(() => {
        const hasValidGstin = isValidGSTIN(gstn);
        const uploadDisabled = !hasValidGstin || files.length === 0;
        const title = !gstn.trim()
          ? "Enter GSTIN to enable upload."
          : !hasValidGstin
            ? "Enter a valid GSTIN (15 chars) to enable upload."
            : files.length === 0
              ? "Select files first."
              : "Upload files";

        const hint = !gstn.trim()
          ? "Enter GSTIN to enable upload."
          : !hasValidGstin
            ? "GSTIN format is invalid. Use 15 chars like 22ABCDE1234F1Z5."
            : files.length === 0
              ? `No valid ${getAcceptedFileTypes(returnType)} files selected for ${returnType}.`
              : "";
        const isGstinHint = !gstn.trim() || !hasValidGstin;

        return (
          <div className="card upload-action-card">
            {hint ? (
              <div className="tog-row upload-action-head">
                <span
                  className={`upload-hint${isGstinHint ? " upload-hint-danger" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {hint}
                </span>
              </div>
            ) : null}

            <div className="card-body">
              <div className="action-btns-wrap upload-panel-actions">
                <div className="action-btns">
                  <button
                    className={uploadDisabled ? "btn-outline" : "btn-primary"}
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadDisabled}
                    title={title}
                  >
                    Upload files
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const getAcceptedFileTypes = (returnType) => {
  if (["GSTR-3B", "GSTR-9", "GSTR-9C"].includes(returnType)) return ".pdf";
  if (["EWB-IN", "EWB-OUT"].includes(returnType)) return ".xls";
  return ".xlsx";
};

export default UploadPanel;
