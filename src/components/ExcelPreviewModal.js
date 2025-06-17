import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";

const ExcelPreviewModal = ({ isOpen, onClose, file }) => {
  const [sheetData, setSheetData] = React.useState([]);

  React.useEffect(() => {
    const fetchAndParseExcel = async () => {
      if (!file) return;
      try {
        const res = await fetch(`http://localhost:8000/reports/${file}`);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setSheetData(jsonData);
      } catch (err) {
        console.error("Failed to load Excel file:", err);
      }
    };

    if (isOpen) {
      fetchAndParseExcel();
    }
  }, [file, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Preview Report: {file}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto" p={4} bg="gray.50">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {sheetData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        fontSize: "14px",
                        background: rowIndex === 0 ? "#f0f0f0" : "white",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExcelPreviewModal;

