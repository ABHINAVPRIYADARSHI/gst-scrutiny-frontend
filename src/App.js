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

        <Flex flex="1" p={4} gap={6}>
          {/* Left Section (2/3): Upload + Uploaded Files */}
          <Flex flex="2" direction="column" gap={6}>
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

            <UploadedFiles
              gstn={gstn}
              returnType={returnType}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
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
