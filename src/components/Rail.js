import React from "react";

const Rail = ({ activeTab, onTabChange, isDark, onToggleTheme }) => {
  return (
    <div className="rail" aria-label="Primary navigation">
      <div className="rail-top" role="tablist" aria-orientation="vertical">
        <button
          type="button"
          className={`tab-btn ${activeTab === "intake" ? "active" : ""}`}
          onClick={() => onTabChange("intake")}
          role="tab"
          aria-selected={activeTab === "intake"}
          aria-controls="panel-intake"
          title="Upload"
        >
          <div className="tab-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M8 2v8M5 7l3 3 3-3" />
              <rect x="2" y="11" width="12" height="3" rx="1" />
            </svg>
          </div>
          <span className="tab-label">Upload</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => onTabChange("reports")}
          role="tab"
          aria-selected={activeTab === "reports"}
          aria-controls="panel-reports"
          title="Reports"
        >
          <div className="tab-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <path d="M5 10l2-3 2 2 2-4" />
            </svg>
          </div>
          <span className="tab-label">Reports</span>
        </button>
      </div>

      <div className="rail-bottom">
        <div className="rail-div" aria-hidden="true" />

        <button
          type="button"
          className="icon-btn"
          title="Documents"
          onClick={() => window.open("https://drive.google.com/drive/folders/1nACEu0pQbEPzH2GzErrmqumzOXMDX3Ud", "_blank")}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M5 5h6M5 8h6M5 11h4" />
          </svg>
          <span className="sr-only">Open calculation sheet</span>
        </button>

        <button type="button" className="icon-btn" title="Toggle dark / light mode" onClick={onToggleTheme}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            {isDark ? (
              <>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" />
                <circle cx="8" cy="8" r="3" />
              </>
            ) : (
              <path d="M11 1.73a5.5 5.5 0 0 0 5.27 7.27 5.5 5.5 0 1 1-5.27-7.27z" />
            )}
          </svg>
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    </div>
  );
};

export default Rail;

