// components/Header.js
import React from "react";
import { Badge, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

const Header = ({ gstn, returnType, status }) => {
  const hasGstin = Boolean(gstn && gstn.trim());
  const statusTone = (() => {
    const s = (status || "").toLowerCase();
    if (!s) return { label: "Idle", color: "rgba(232, 238, 252, 0.72)", dot: "rgba(232, 238, 252, 0.35)" };
    if (s.includes("success")) return { label: "Ready", color: "var(--gst-accent)", dot: "var(--gst-accent)" };
    if (s.includes("error") || s.includes("fail")) return { label: "Attention", color: "var(--gst-danger)", dot: "var(--gst-danger)" };
    if (s.includes("generating") || s.includes("uploading"))
      return { label: "Working", color: "var(--gst-warn)", dot: "var(--gst-warn)" };
    return { label: "Info", color: "rgba(232, 238, 252, 0.72)", dot: "rgba(232, 238, 252, 0.35)" };
  })();

  return (
    <Box
      as="header"
      px={{ base: 4, md: 8 }}
      py={{ base: 4, md: 5 }}
      borderBottom="1px solid"
      borderColor="var(--gst-line)"
      bg="rgba(11, 18, 32, 0.62)"
      backdropFilter="blur(10px)"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center" justify="space-between" gap={4} wrap="wrap">
        <VStack align="start" spacing={0.5}>
          <Text fontFamily="heading" letterSpacing="-0.02em" fontSize={{ base: "xl", md: "2xl" }}>
            GST Scrutiny Tool
          </Text>
          <Text fontSize="sm" color="var(--gst-muted)">
            Intake → Processing → Reports, built for disciplined scrutiny
          </Text>
        </VStack>

        <HStack spacing={3} align="center">
          <Badge
            px={3}
            py={1.5}
            borderRadius="999px"
            bg="rgba(15, 26, 46, 0.72)"
            border="1px solid"
            borderColor="var(--gst-line)"
            color="var(--gst-ink)"
            fontWeight="600"
          >
            Return: {returnType}
          </Badge>

          <Badge
            px={3}
            py={1.5}
            borderRadius="999px"
            bg="rgba(15, 26, 46, 0.72)"
            border="1px solid"
            borderColor="var(--gst-line)"
            color={hasGstin ? "var(--gst-ink)" : "var(--gst-muted)"}
            fontWeight="600"
            fontFamily="mono"
            title={hasGstin ? gstn : "No GSTIN yet"}
          >
            GSTIN: {hasGstin ? gstn : "—"}
          </Badge>

          <Badge
            px={3}
            py={1.5}
            borderRadius="999px"
            bg="rgba(15, 26, 46, 0.72)"
            border="1px solid"
            borderColor="var(--gst-line)"
            color={statusTone.color}
            fontWeight="600"
          >
            <Box as="span" display="inline-block" w="8px" h="8px" borderRadius="999px" bg={statusTone.dot} mr={2} />
            {statusTone.label}
          </Badge>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
