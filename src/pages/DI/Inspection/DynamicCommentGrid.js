import React from "react";

const DynamicCommentGrid = ({ count, values, onChange, labels }) => {
  const boxes = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {boxes.map((index) => {
        const name = `txtDynamic${index}`;
        const label = labels && labels[index - 1] ? labels[index - 1] : `+${index}`;
        return (
          <div key={index} style={{ display: "flex", flexDirection: "column", width: "80px" }}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type="text"
              value={values[name] || ""}
              onChange={(e) => onChange(name, e.target.value)}
              style={{ width: "100%", padding: "4px" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DynamicCommentGrid;
