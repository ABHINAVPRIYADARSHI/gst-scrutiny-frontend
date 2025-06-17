// components/Header.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="blue.600" color="white" px={6} py={4} shadow="md">
      <Text fontSize="xl" fontWeight="bold">
        GST Scrutiny Tool
      </Text>
    </Box>
  );
};

export default Header;
