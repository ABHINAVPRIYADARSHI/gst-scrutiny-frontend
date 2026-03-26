import { extendTheme } from "@chakra-ui/react";

const semantic = {
  bg: "var(--gst-bg)",
  paper: "var(--gst-paper)",
  paper2: "var(--gst-paper-2)",
  ink: "var(--gst-ink)",
  muted: "var(--gst-muted)",
  line: "var(--gst-line)",
  accent: "var(--gst-accent)",
  warn: "var(--gst-warn)",
  danger: "var(--gst-danger)",
  focus: "var(--gst-focus)",
};

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: `"Fraunces", ui-serif, Georgia, serif`,
    body: `"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`,
    mono: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
  styles: {
    global: {
      "html, body": {
        bg: semantic.bg,
        color: semantic.ink,
      },
      "*:focus-visible": {
        outline: "none",
        boxShadow: `0 0 0 4px ${semantic.focus}`,
        borderRadius: "10px",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "14px",
        fontWeight: 600,
      },
      variants: {
        solid: {
          bg: semantic.accent,
          color: "#ffffff",
          _hover: { filter: "brightness(0.96)" },
          _active: { transform: "translateY(0.5px)" },
        },
        ghost: {
          color: semantic.ink,
          _hover: { bg: "var(--accent-bg)" },
        },
        outline: {
          borderColor: semantic.line,
          color: semantic.ink,
          _hover: { bg: "var(--accent-bg)" },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "var(--gst-paper)",
            borderColor: semantic.line,
            _hover: { borderColor: "var(--accent-border)" },
            _focusVisible: { borderColor: semantic.accent },
            _placeholder: { color: semantic.muted },
          },
        },
      },
      defaultProps: { variant: "outline" },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: semantic.paper,
          border: `1px solid ${semantic.line}`,
          borderRadius: "18px",
        },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            borderColor: semantic.line,
            _selected: {
              bg: "var(--accent-bg)",
              borderColor: "var(--accent-border)",
              color: "var(--accent-text)",
            },
          },
          tablist: {
            borderColor: semantic.line,
          },
        },
      },
    },
  },
});
