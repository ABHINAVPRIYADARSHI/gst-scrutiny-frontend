import React, { useRef, useState } from "react";
import {
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

const GenerateReportsAction = ({
  gstn,
  includeOptionalReport,
  setIncludeOptionalReport,
  setStatus,
  onGoToReports,
}) => {
  const toast = useToast();
  const [checkingOpenFiles, setCheckingOpenFiles] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const isValidGSTIN = (value) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(value);
  };

  const runReportGeneration = async () => {
    setStatus("Generating reports...");
    const formData = new FormData();
    formData.append("gstn", gstn.trim());
    formData.append("include_ASMT_10_report", includeOptionalReport ? "true" : "false");

    try {
      const res = await fetch("http://localhost:8000/generate_reports/", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }
      await res.json();
      setStatus("Reports generated successfully.");
      toast({ title: "Reports generated.", status: "success", duration: 3000 });
      onGoToReports?.();
    } catch (err) {
      console.error("Generation error:", err);
      setStatus("Error generating reports.");
      toast({ title: "Failed to generate reports.", status: "error", duration: 3000 });
    }
  };

  const handleGenerateReport = async () => {
    if (!gstn.trim()) {
      toast({ title: "Enter GSTIN to generate reports.", status: "warning", duration: 3000 });
      return;
    }

    setCheckingOpenFiles(true);
    try {
      const res = await fetch(`http://localhost:8000/check-open-reports/?gstn=${gstn.trim()}`);
      const data = await res.json();

      if (data.open) {
        onOpen();
      } else {
        await runReportGeneration();
      }
    } catch (err) {
      console.error("Check failed:", err);
      toast({
        title: "Failed to check for open files.",
        description: "Proceeding with report generation.",
        status: "warning",
        duration: 3000,
      });
      await runReportGeneration();
    } finally {
      setCheckingOpenFiles(false);
    }
  };

  return (
    <>
      <div className="card reports-generate-card">
        <div className="tog-row">
          <span className="tog-label">Whether you want ASMT-10 report?</span>
          <button
            type="button"
            id="includeASMT10"
            role="switch"
            aria-checked={includeOptionalReport}
            className={`tog ${includeOptionalReport ? "on" : "off"}`}
            onClick={() => setIncludeOptionalReport((value) => !value)}
            aria-label="Generate ASMT-10 report"
          />
        </div>

        <div className="card-body">
          <div className="action-btns-wrap reports-generate-wrap">
            <div className="action-btns">
              <button
                className="btn-primary"
                type="button"
                onClick={handleGenerateReport}
                disabled={!isValidGSTIN(gstn) || checkingOpenFiles}
                title={gstn.trim() ? "Generate reports for this GSTIN" : "Enter GSTIN first"}
              >
                {checkingOpenFiles ? "Checking..." : "Generate Reports"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Open Files
            </AlertDialogHeader>

            <AlertDialogBody>
              Some report files appear to be open in Excel. Please close them before generating new
              reports to avoid "Permission Denied" errors.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={async () => {
                  onClose();
                  await runReportGeneration();
                }}
                ml={3}
              >
                Proceed Anyway
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default GenerateReportsAction;
