import React from "react";

const Footer = ({ isDark = false }) => {
  return (
    <div className={`app-footer-shell ${isDark ? "dark" : ""}`}>
      <div className="app-footer-trigger" />
      <footer className="app-footer">
        <span className="app-footer-copy">&copy; All rights reserved. Designed &amp; Developed by CGST &amp; CX, Bhilai.</span>
        <span className="app-footer-version">v3.0.0</span>
      </footer>
    </div>
  );
};

export default Footer;
