// components/Footer.js
import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="var(--gst-line)"
      bg="rgba(11, 18, 32, 0.45)"
      color="var(--gst-muted)"
      py={4}
      textAlign="center"
      mt="auto"
    >
      <HStack justify="center" spacing={2} flexWrap="wrap">
        <Text fontSize="sm">© 2025.</Text>
        <Text fontSize="sm">Designed and developed by CGST & Central Excise, Bhilai</Text>
        <Text fontSize="sm" fontFamily="mono" color="rgba(232, 238, 252, 0.62)">
          v2.0.2
        </Text>
      </HStack>
    </Box>
  );
};

export default Footer;
