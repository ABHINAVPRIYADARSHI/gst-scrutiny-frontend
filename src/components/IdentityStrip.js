import React, { useMemo } from "react";

const RETURN_TYPES = [
  "GSTR-1",
  "GSTR-2A",
  "GSTR-2B",
  "GSTR-3B",
  "GSTR-9",
  "GSTR-9C",
  "EWB-IN",
  "EWB-OUT",
  "BO comparison summary",
];

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const IdentityStrip = ({ gstn, setGstn, returnType, setReturnType }) => {
  const isValid = useMemo(() => (gstn ? gstinRegex.test(gstn) : true), [gstn]);

  return (
    <div className="id-strip" aria-label="Identity and return type">
      <div className="gstin-wrap">
        <label className="gstin-lbl" htmlFor="gstinInput">
          GSTIN
        </label>
        <input
          className="gstin-input"
          id="gstinInput"
          type="text"
          placeholder="Enter GSTIN"
          maxLength={15}
          value={gstn}
          onChange={(e) => setGstn(e.target.value.toUpperCase())}
          aria-invalid={!isValid}
        />
      </div>

      <div className="strip-gap" />

      <div className="ret-pills" aria-label="Return type">
        {RETURN_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={`rpill ${returnType === t ? "sel" : ""}`}
            onClick={() => setReturnType(t)}
            aria-pressed={returnType === t}
          >
            {t === "BO comparison summary" ? "BO summary" : t}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IdentityStrip;

