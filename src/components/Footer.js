// components/Footer.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="gray.200"
      color="gray.700"
      py={3}
      textAlign="center"
      mt="auto"
    >
      <Text fontSize="sm">
        © 2025. All rights reserved. Designed and developed by CGST & Central Excise, Bhilai
      </Text>
    </Box>
  );
};

export default Footer;
