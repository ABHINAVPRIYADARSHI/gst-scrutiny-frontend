import React from "react";

function statusChipClass(status) {
  const s = (status || "").toLowerCase();
  if (!s) return "chip ok";
  if (s.includes("success")) return "chip ok";
  if (s.includes("error") || s.includes("fail")) return "chip err";
  if (s.includes("generating") || s.includes("uploading")) return "chip warn";
  return "chip";
}

function statusChipLabel(status) {
  const s = (status || "").toLowerCase();
  if (!s) return "● Idle";
  if (s.includes("success")) return "● Ready";
  if (s.includes("error") || s.includes("fail")) return "● Attention";
  if (s.includes("generating") || s.includes("uploading")) return "● Working";
  return "● Info";
}

const Topbar = ({ gstn, status }) => {
  const gstinLabel = gstn && gstn.trim() ? `GSTIN: ${gstn.trim()}` : "GSTIN: —";
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-dot" aria-hidden="true">
          G
        </div>
        <span className="brand-name">GST Mitra</span>
      </div>
      <div className="topbar-chips" aria-label="Current context">
        <span className="chip acc" title={gstinLabel}>
          {gstinLabel}
        </span>
        <span className={statusChipClass(status)}>{statusChipLabel(status)}</span>
      </div>
    </div>
  );
};

export default Topbar;

