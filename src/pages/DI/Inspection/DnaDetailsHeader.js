import React from "react";

// Utility to safely format any value
const formatValue = (val) => {
  if (val === null || val === undefined) return "N/A";
  if (typeof val === "object") {
    return Object.keys(val).length > 0 ? JSON.stringify(val) : "N/A";
  }
  return val;
};

const DnaDetailsHeader = ({ selectedDna }) => {
  return (
    <div
      style={{
        height: "15%",
        borderBottom: "1px solid #ccc",
        padding: "12px 24px",
      }}
    >
      <h4 style={{ marginBottom: "10px" }}>Selected DNANum Details</h4>
      {selectedDna ? (
        <>
          {/* Header Labels */}
          <div style={{ display: "flex", fontWeight: "bold", gap: "20px" }}>
            <div>Diameter</div>
            <div>Nominal</div>
            <div>Min</div>
            <div>Max</div>
            <div>Gage To Use</div>
            <div>Tolerance Class</div>
            <div>Method of Recording</div>
            <div>WI/ATP Number</div>
          </div>
          {/* Data Values */}
          <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
            <div>{formatValue(selectedDna.DimType)}</div>
            <div>{formatValue(selectedDna.Nominal)}</div>
            <div>{formatValue(selectedDna.Min)}</div>
            <div>{formatValue(selectedDna.Max)}</div>
            <div>{formatValue(selectedDna.SpecialGages)}</div>
            <div>{formatValue(selectedDna.ToleranceClass)}</div>
            <div>{formatValue(selectedDna.MethodOfRecording)}</div>
            <div>{formatValue(selectedDna.WIATPNum)}</div>
          </div>
        </>
      ) : (
        <div style={{ fontStyle: "italic", color: "#888" }}>
          Select a DNANum to view its details.
        </div>
      )}
    </div>
  );
};

export default DnaDetailsHeader;
