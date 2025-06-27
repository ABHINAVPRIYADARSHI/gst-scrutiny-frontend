// components/Header.js
import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="blue.600" color="white" px={6} py={4} shadow="md">
      <Flex align="center" gap={4}>
        {/* <Image src="./logo.png" alt="Logo" boxSize="40px" /> */}
        <Text fontSize="xl" fontWeight="bold">
          GST Scrutiny Tool
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;
