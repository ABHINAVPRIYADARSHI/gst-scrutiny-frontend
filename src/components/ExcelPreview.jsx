// components/ExcelPreview.jsx
import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box
} from "@chakra-ui/react";

const ExcelPreview = ({ workbookData }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!workbookData || workbookData.length === 0) {
    return <Box>No preview data available.</Box>;
  }

  return (
    <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} isLazy>
      <TabList overflowX="auto" whiteSpace="nowrap">
        {workbookData.map((sheet, idx) => (
          <Tab key={idx}>{sheet.name}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {workbookData.map((sheet, idx) => (
          <TabPanel key={idx} p={2} overflow="auto">
            <Box overflow="auto" maxHeight="70vh">
              <Table size="sm" variant="striped">
                <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
                  <Tr>
                    {sheet.data[0]?.map((col, colIdx) => (
                      <Th key={colIdx} whiteSpace="pre-wrap" maxW="200px">
                        {col}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {sheet.data.slice(1).map((row, rowIdx) => (
                    <Tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <Td key={cellIdx} whiteSpace="pre-wrap" maxW="200px">
                          {cell}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ExcelPreview;
