// components/UploadedFiles.js
import React, { useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Divider,
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
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="sm" bg="white" minW="300px">
      <Text fontWeight="bold" mb={3}>
        Uploaded files for GSTIN: {gstn || "N/A"} | Return Type: {returnType || "N/A"}
      </Text>
  
      {uploadedFiles.length === 0 ? (
        <Text color="gray.500">No files uploaded yet.</Text>
      ) : (
        <Box maxHeight="300px" overflowY="auto">
          <VStack align="start" spacing={3}>
            {uploadedFiles.map((fileName, index) => (
              <Box
                key={index}
                w="100%"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={3}
                _hover={{ bg: "gray.50" }}
              >
                <HStack justify="space-between">
                  <Text fontSize="sm" isTruncated maxW="80%" title={fileName}>
                    📄 {fileName}
                  </Text>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(fileName)}
                    aria-label="Delete file"
                  />
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
  
};  

export default UploadedFiles;
