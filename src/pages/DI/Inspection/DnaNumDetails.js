import React from "react";

const DnaNumDetails = ({ data, selectedDna, onSelectDna }) => {
  return (
    <div style={{ padding: "12px", backgroundColor: "#f1f1f1", overflowY: "auto", height: "100%" }}>
      <h5 style={{ marginBottom: "10px", textAlign: "center" }}>DNANums</h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {data.map((item, idx) => (
          <li
            key={idx}
            onClick={() => onSelectDna(item)}
            style={{
              padding: "8px",
              marginBottom: "6px",
              borderRadius: "4px",
              backgroundColor: selectedDna?.DNANum === item.DNANum ? "#007bff" : "#fff",
              color: selectedDna?.DNANum === item.DNANum ? "#fff" : "#000",
              border: "1px solid #007bff",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {item.DNANum}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DnaNumDetails;
