// components/UploadPanel.js
import React, { useState, useRef, useEffect } from "react";
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
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
  FormErrorMessage, FormControl
} from "@chakra-ui/react";

const RETURN_TYPES = ["GSTR-1", "GSTR-2A", "GSTR-3B", "GSTR-9", "EWB-IN", "EWB-OUT", "BO comparison summary"];

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

  useEffect(() => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input visually
    }
  }, [returnType, setFiles]);

  const toast = useToast();
  const fileInputRef = useRef();
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
    const excelOnlyTypes = ["GSTR-1", "GSTR-2A", "BO comparison summary"];
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
      const data = await res.json();
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

  const isValidGSTIN = (gstn) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstn);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="sm" bg="white">
      <VStack align="start" spacing={4}>
      <FormControl isInvalid={gstn && !isValidGSTIN(gstn)}>
        <Box w="100%">
          <Text fontWeight="bold" mb={1}>
            GSTIN
          </Text>
          <Input
            placeholder="Enter GSTIN"
            value={gstn}
            onChange={(e) => setGstn(e.target.value.toUpperCase())}
            maxW="300px"
          />
            {gstn && !isValidGSTIN(gstn) && (
              <FormErrorMessage>
                Invalid GSTIN format. It must be 15 characters, like 22ABCDE1234F1Z5.
              </FormErrorMessage>
            )}
        </Box>
        </FormControl>
      
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

        <Box w="100%">
          <Text mb={1}>Upload Files</Text>
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            variant="outline"
            cursor="pointer"
          >
            Select Files
            <Input
              id="file-upload"
              type="file"
              multiple
              ref={fileInputRef}
              accept={getAcceptedFileTypes(returnType)}
              onChange={handleFileChange}
              display="none"
            />
          </Button>

          <Text fontSize="sm" color="gray.500" mt={2}>
            Accepted formats: {getAcceptedFileTypes(returnType).replaceAll(",", ", ")}
          </Text>


          {files.length > 0 ? (
            <Box mt={3}>
              <Text fontWeight="semibold" mb={1}>
                Selected Files : {files.length}
              </Text>

              <Box
                maxH="240px" // Adjust this based on item height (approx 7 items)
                overflowY="auto"
                pr={2} // For scrollbar space
              >
                <Wrap>
                  {files.map((file, idx) => (
                    <WrapItem key={idx}>
                      <HStack
                        px={3}
                        py={1}
                        bg="gray.100"
                        borderRadius="md"
                        fontSize="sm"
                        spacing={2}
                        maxW="240px"
                      >
                        <Text isTruncated title={file.name} maxW="180px">
                          {file.name}
                        </Text>
                        <IconButton
                          icon={<DeleteIcon />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          aria-label="Remove file"
                          onClick={() => {
                            const updated = files.filter((_, i) => i !== idx);
                            setFiles(updated);
                            if (updated.length === 0 && fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        />
                      </HStack>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </Box>
          ) : (
              <Text fontSize="sm" color="gray.400" mt={2}>
                No files selected
              </Text>
            )}

        </Box>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={handleUpload} isDisabled={!isValidGSTIN(gstn)}>
            Upload
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleGenerateReport}
            isLoading={checkingOpenFiles}
            isDisabled={!isValidGSTIN(gstn)}
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

const getAcceptedFileTypes = (returnType) => {
  if (["GSTR-3B", "GSTR-9"].includes(returnType)) return ".pdf";
  if (["EWB-IN", "EWB-OUT"].includes(returnType)) return ".xls";
  return ".xlsx";
};

export default UploadPanel;
