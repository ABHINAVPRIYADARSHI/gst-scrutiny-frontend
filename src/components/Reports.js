// components/Reports.js
import React, { useCallback, useEffect, useState } from "react";
import { Text, Spinner, Button, List, ListItem, useToast } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";

const Reports = ({ gstn, status }) => {
  const toast = useToast();
  const [reportFiles, setReportFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openingReports, setOpeningReports] = useState(false);
  const [error, setError] = useState("");

  const getStatusIcon = () => {
    if (!status) return <InfoIcon color="gray.400" />;
    if (status.includes("success")) return <CheckCircleIcon color="green.400" />;
    if (status.includes("error") || status.includes("fail")) return <WarningIcon color="red.400" />;
    if (status.includes("Generating") || status.includes("Uploading")) {
      return <Spinner color="blue.400" size="sm" />;
    }
    return <InfoIcon color="gray.500" />;
  };

  const fetchReports = useCallback(async () => {
    if (!gstn) {
      setReportFiles([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8000/reports/?gstn=${encodeURIComponent(gstn)}`);
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setReportFiles(data.reports || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setReportFiles([]);
      setError("Could not load reports. Check server connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [gstn]);

  const handleOpenReports = async () => {
    if (!gstn.trim()) {
      return;
    }

    setOpeningReports(true);

    try {
      const formData = new FormData();
      formData.append("gstn", gstn.trim());

      const res = await fetch("http://localhost:8000/open-reports-folder/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }

      toast({
        title: "Reports folder opened.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to open reports folder", err);
      toast({
        title: "Could not open reports folder.",
        description: "Check the backend endpoint and reports path, then try again.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setOpeningReports(false);
    }
  };

  useEffect(() => {
    if (!gstn) {
      setReportFiles([]);
      setError("");
      return;
    }

    if (!status || status.toLowerCase().includes("success")) {
      fetchReports();
    }
  }, [fetchReports, gstn, status]);

  return (
    <div className="reports-wrap">
      <div className="card">
        <div className="card-head">
          <div className="reports-head-meta">
            <span className="card-title">Generated reports</span>
            <span className="card-sub">{gstn ? `GSTIN: ${gstn}` : "GSTIN: -"}</span>
          </div>
          <div className="reports-head-actions">
            {gstn.trim() && !openingReports ? (
              <span className="reports-path-hint">
                The reports are available at /GST Mitra/{gstn}/reports/
              </span>
            ) : null}
            <button
              className="btn-primary reports-open-btn"
              type="button"
              onClick={handleOpenReports}
              disabled={openingReports || !gstn.trim()}
              title={gstn.trim() ? "Open reports folder for this GSTIN" : "Enter GSTIN first"}
            >
              {openingReports ? "Opening..." : "Open Reports"}
            </button>
          </div>
        </div>
        <div className="card-body">
          {gstn ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                {getStatusIcon()}
                <Text fontSize="xs" color="var(--text-3)">
                  {status || "No report status yet."}
                </Text>
              </div>

              {error ? (
                <div className="file-row" style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <Text fontSize="sm" fontWeight={600}>
                      Could not load reports
                    </Text>
                    <Text fontSize="xs" color="var(--text-3)">
                      {error}
                    </Text>
                    <Button mt={2} size="sm" variant="outline" onClick={fetchReports}>
                      Try again
                    </Button>
                  </div>
                </div>
              ) : loading && reportFiles.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Spinner size="sm" />
                  <Text fontSize="xs" color="var(--text-3)">
                    Loading reports...
                  </Text>
                </div>
              ) : reportFiles.length > 0 ? (
                <div className="reports-list-scroll" aria-label="Generated reports list">
                  <List spacing={2}>
                    {reportFiles.map((file, idx) => (
                      <ListItem key={`${file}-${idx}`}>
                        <div className="report-row">
                          <span className="fname" title={file}>
                            {file}
                          </span>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
              ) : (
                <Text fontSize="xs" color="var(--text-3)">
                  No reports available yet.
                </Text>
              )}
            </>
          ) : (
            <Text fontSize="xs" color="var(--text-3)">
              Enter a GSTIN to start generating reports.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
