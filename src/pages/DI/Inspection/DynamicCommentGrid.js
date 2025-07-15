import React from "react";

const DynamicCommentGrid = ({
  count,
  values,
  onChange,
  labels,
  names,
  disabledFields = [],
  highlightedFields = [],
}) => {
  const boxes = Array.from({ length: count }, (_, i) => i);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {boxes.map((i) => {
        const name = names?.[i] || `txtDynamic${i + 1}`;
        const label = labels?.[i] || `+${i + 1}`;
        const isDisabled = disabledFields.includes(name);
        const isHighlighted = highlightedFields.includes(name);

        return (
          <div key={name} style={{ display: "flex", flexDirection: "column", width: "80px", opacity: isDisabled ? 0.6 : 1 }}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type="text"
              value={values[name] || ""}
              onChange={(e) => onChange(name, e.target.value)}
              disabled={isDisabled}
              style={{
                width: "100%",
                padding: "4px",
                backgroundColor: isHighlighted ? "#ffe0e0" : "white",
                border: "1px solid #ccc",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DynamicCommentGrid;
