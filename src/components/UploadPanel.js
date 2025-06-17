// components/UploadPanel.js
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Wrap,
  WrapItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

const RETURN_TYPES = ["GSTR-1", "GSTR-2A", "GSTR-3B", "GSTR-9", "EWB-IN", "EWB-OUT"];

const UploadPanel = ({
  gstn,
  setGstn,
  returnType,
  setReturnType,
  files,
  setFiles,
  setStatus,
  setUploadedFiles,
}) => {
  const toast = useToast();
  const [checkingOpenFiles, setCheckingOpenFiles] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const isPdf = (file) => file.type === "application/pdf";
    const isXlsx = (file) =>
      file.name.endsWith(".xlsx") &&
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const isXls = (file) => file.name.toLowerCase().endsWith(".xls");

    const pdfOnlyTypes = ["GSTR-3B", "GSTR-9"];
    const excelOnlyTypes = ["GSTR-1", "GSTR-2A", "EWB-IN", "EWB-OUT"];
    const xlsAllowedTypes = ["EWB-IN", "EWB-OUT"];
    const allPdfs = selectedFiles.every(isPdf);
    const allExcels = selectedFiles.every(isXlsx);

    const hasInvalidFormat = selectedFiles.some((file) => !isPdf(file) && !isXlsx(file));
    if (hasInvalidFormat) {
      toast({
        title: "Only .xlsx and .pdf files are supported.",
        description: ".xls and other formats are not allowed.",
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
    } else if (excelOnlyTypes.includes(returnType)) {
      if (!allExcels) {
        toast({
          title: `Only Excel (.xlsx) files are allowed for ${returnType}`,
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
      const data = await res.json();
      setStatus("Upload complete. Ready to process.");

      const res2 = await fetch(
        `http://localhost:8000/files/?gstn=${gstn.trim()}&return_type=${returnType}`
      );
      const data2 = await res2.json();
      setUploadedFiles(data2.files || []);

      toast({ title: "Files uploaded successfully.", status: "success", duration: 3000 });
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Upload failed.");
      toast({ title: "Upload failed.", status: "error", duration: 3000 });
    }
  };

  const runReportGeneration = async () => {
    setStatus("Generating reports...");
    const formData = new FormData();
    formData.append("gstn", gstn.trim());

    try {
      const res = await fetch("http://localhost:8000/generate_master/", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        // Server responded with 404 or 500
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }
      await res.json();
      setStatus("Reports generated successfully.");
      toast({ title: "Reports generated.", status: "success", duration: 3000 });
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
        onOpen(); // Show warning dialog
      } else {
        runReportGeneration(); // Safe to proceed
      }
    } catch (err) {
      console.error("Check failed:", err);
      toast({
        title: "Failed to check for open files.",
        description: "Proceeding with report generation.",
        status: "warning",
        duration: 3000,
      });
      runReportGeneration();
    } finally {
      setCheckingOpenFiles(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="sm" bg="white">
      <VStack align="start" spacing={4}>
        <Box w="100%">
          <Text fontWeight="bold" mb={1}>
            Enter GSTIN
          </Text>
          <Input
            placeholder="Enter GSTIN"
            value={gstn}
            onChange={(e) => setGstn(e.target.value.toUpperCase())}
            maxW="300px"
          />
        </Box>

        <Box>
          <Text mb={1}>Select GST Return Type</Text>
          <Wrap spacing={2}>
            {RETURN_TYPES.map((type) => (
              <WrapItem key={type}>
                <Button
                  size="sm"
                  colorScheme={returnType === type ? "blue" : "gray"}
                  onClick={() => setReturnType(type)}
                >
                  {type}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <Box>
          <Input
            type="file"
            multiple
            accept={["GSTR-3B", "GSTR-9"].includes(returnType) ? ".pdf" : ".xlsx"}
            onChange={handleFileChange}
          />
        </Box>

        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={handleUpload}>
            Upload
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleGenerateReport}
            isLoading={checkingOpenFiles}
          >
            Generate Reports
          </Button>
        </HStack>
      </VStack>

      {/* AlertDialog for open files */}
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
                onClick={() => {
                  onClose();
                  runReportGeneration(); // proceed anyway
                }}
                ml={3}
              >
                Proceed Anyway
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UploadPanel;
