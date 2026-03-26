// App.js
import React, { useState } from "react";
import Topbar from "./components/Topbar";
import Rail from "./components/Rail";
import IdentityStrip from "./components/IdentityStrip";
import UploadPanel from "./components/UploadPanel";
import UploadedFiles from "./components/UploadedFiles";
import GenerateReportsAction from "./components/GenerateReportsAction";
import Reports from "./components/Reports";
import Footer from "./components/Footer";

function App() {
  const [gstn, setGstn] = useState("");
  const [returnType, setReturnType] = useState("GSTR-1");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("intake");
  const [isDark, setIsDark] = useState(false);
  const [includeOptionalReport, setIncludeOptionalReport] = useState(true);

return (
  <>
    <a className="skip-link" href="#main">
      Skip to main content
    </a>
    <div className={`shell ${isDark ? "dark" : ""}`}>
      <Topbar gstn={gstn} status={status} />
      <div className="body">
        <Rail
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />

        <div className="content">
          <IdentityStrip gstn={gstn} setGstn={setGstn} returnType={returnType} setReturnType={setReturnType} />

          <main className="panels" id="main">
            <section
              className={`panel ${activeTab === "intake" ? "active" : ""}`}
              id="panel-intake"
              role="tabpanel"
              aria-label="Intake"
            >
              <div className="intake-split">
                <div className="intake-left">
                  <UploadPanel
                    gstn={gstn}
                    returnType={returnType}
                    files={files}
                    setFiles={setFiles}
                    setStatus={setStatus}
                    setUploadedFiles={setUploadedFiles}
                  />
                </div>

                <div className="intake-right">
                  <div className="stat-solo" aria-label="Uploaded file count">
                    <div className="stat-lbl">Files uploaded</div>
                    <div className="stat-val">{uploadedFiles.length}</div>
                    <div className="stat-sub">for {returnType}</div>
                  </div>

                  <UploadedFiles
                    gstn={gstn}
                    returnType={returnType}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                  />

                  <GenerateReportsAction
                    gstn={gstn}
                    includeOptionalReport={includeOptionalReport}
                    setIncludeOptionalReport={setIncludeOptionalReport}
                    setStatus={setStatus}
                    onGoToReports={() => setActiveTab("reports")}
                  />
                </div>
              </div>
            </section>

            <section
              className={`panel ${activeTab === "reports" ? "active" : ""}`}
              id="panel-reports"
              role="tabpanel"
              aria-label="Reports"
            >
              <Reports gstn={gstn} status={status} />
            </section>
          </main>
        </div>
      </div>
      <Footer isDark={isDark} />
    </div>
  </>
);
}
export default App;
