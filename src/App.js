// App.js
import React, { useState } from "react";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadPanel from "./components/UploadPanel";
import UploadedFiles from "./components/UploadedFiles";
import Reports from "./components/Reports";

function App() {
  const [gstn, setGstn] = useState("");
  const [returnType, setReturnType] = useState("GSTR-1");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

return (
  <ChakraProvider>
    <Flex direction="column" minHeight="100vh">
      <Header />

      <Flex flex="1" p={4} gap={6} align="flex-start">
        {/* Left Section (2/3): Upload + Uploaded Files side-by-side */}
        <Flex flex="2" direction={{ base: "column", md: "row" }} gap={6}>
          <Box w={{ base: "100%", md: "60%" }}>
            <UploadPanel
              gstn={gstn}
              setGstn={setGstn}
              returnType={returnType}
              setReturnType={setReturnType}
              files={files}
              setFiles={setFiles}
              setStatus={setStatus}
              setUploadedFiles={setUploadedFiles}
            />
          </Box>

          <Box w={{ base: "100%", md: "40%" }}>
            <UploadedFiles
              gstn={gstn}
              returnType={returnType}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          </Box>
        </Flex>

        {/* Right Section (1/3): Reports */}
        <Box flex="1">
          <Reports gstn={gstn} returnType={returnType} status={status} />
        </Box>
      </Flex>

      <Footer />
    </Flex>
  </ChakraProvider>
);
}
export default App;