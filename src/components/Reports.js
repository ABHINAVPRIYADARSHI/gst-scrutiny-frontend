// components/Reports.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  HStack,
  Button,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
import { read, utils } from "xlsx";
import { FixedSizeList as VirtualList } from "react-window";

const Reports = ({ gstn, status }) => {
  const [reportFiles, setReportFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workbookData, setWorkbookData] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getStatusIcon = () => {
    if (!status) return <InfoIcon color="gray.400" />;
    if (status.includes("success")) return <CheckCircleIcon color="green.400" />;
    if (status.includes("error") || status.includes("fail")) return <WarningIcon color="red.400" />;
    if (status.includes("Generating") || status.includes("Uploading"))
      return <Spinner color="blue.400" size="sm" />;
    return <InfoIcon color="gray.500" />;
  };

  useEffect(() => {
    if (!gstn) {
      setReportFiles([]);
      return;
    }
  
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/reports/?gstn=${gstn}`);
        const data = await res.json();
        setReportFiles(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setReportFiles([]);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch if GSTIN changes or status includes success
    if (!status || status.toLowerCase().includes("success")) {
      fetchReports();
    }
  }, [gstn, status]);
  

  const handlePreview = async (filename) => {
    try {
      const res = await fetch(`http://localhost:8000/reports/download/?gstn=${gstn}&filename=${filename}`);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = read(arrayBuffer, { type: "array" });
      const data = {};
      workbook.SheetNames.forEach((name) => {
        const ws = workbook.Sheets[name];
        data[name] = utils.sheet_to_json(ws, { header: 1 });
      });
      setWorkbookData(data);
      setModalTitle(filename);
      onOpen();
    } catch (err) {
      console.error("Error loading Excel file", err);
    }
  };

  const renderRow = (rowData) => ({ index, style }) => {
    const row = rowData[index] || [];
    return (
      <HStack
        key={index}
        spacing={4}
        px={4}
        py={2}
        borderBottom="1px solid #eee"
        style={style}
        bg={index % 2 === 0 ? "gray.50" : "white"}
      >
        {row.map((cell, i) => (
          <Text key={i} fontSize="sm" minW="120px" noOfLines={1}>
            {cell}
          </Text>
        ))}
      </HStack>
    );
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
      <Text fontSize="lg" fontWeight="bold" mb={3}>Reports</Text>
      
      <VStack align="start" spacing={4}>
        {gstn ? (
          <>
            <Box>
              <Text fontSize="sm" fontWeight="semibold">
                GSTIN: <Text as="span" color="blue.600">{gstn}</Text>
              </Text>
              <HStack mt={2} spacing={2}>
                {getStatusIcon()}
                <Text fontSize="sm" color="gray.700">{status || "No report status yet."}</Text>
              </HStack>
            </Box>

            {loading ? (
              <Spinner size="sm" />
            ) : reportFiles.length > 0 ? (
              <Box>
                <Text fontSize="sm" mt={4} mb={2} fontWeight="semibold">Generated Reports:</Text>
                <Box maxHeight="200px" overflowY="auto" pr={2}>
                <List spacing={2}>
                  {reportFiles.map((file, idx) => (
                    <ListItem key={idx}>
                      <Button
                        size="sm"
                        variant="link"
                        colorScheme="blue"
                        // onClick={() => handlePreview(file)}
                      >
                       📄 {file}
                      </Button>
                    </ListItem>
                  ))}
                </List>
                </Box>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    The reports are available at:
                    <br />
                    <Text as="span" fontFamily="mono" color="gray.600">
                      /.exe directory/reports/{gstn}
                    </Text>
                  </Text>

              </Box>
            ) : (
              <Text fontSize="sm" color="gray.500">No reports available for this GSTIN yet.</Text>
            )}
          </>
        ) : (
          <Text fontSize="sm" color="gray.500">
            Enter a GSTIN to start generating reports.
          </Text>
        )}
      </VStack>

      {/* Fullscreen Modal with Tabbed Sheets */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent maxW="100vw" maxH="100vh">
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Tabs variant="enclosed" isFitted height="full">
              <TabList overflowX="auto">
                {Object.keys(workbookData).map((sheetName, i) => (
                  <Tab key={i}> {sheetName}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {Object.entries(workbookData).map(([sheetName, data], i) => (
                  <TabPanel key={i} p={0}>
                    <Box overflow="auto" h="calc(100vh - 150px)">
                      <VirtualList
                        height={window.innerHeight - 150}
                        itemCount={data.length}
                        itemSize={40}
                        width="100%"
                      >
                        {renderRow(data)}
                      </VirtualList>
                    </Box>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Reports;
