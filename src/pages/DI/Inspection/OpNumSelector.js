import React, { useEffect, useState } from "react";

const OpNumSelector = ({ data, selectedOpNum, onSelect }) => {
  const [opNumList, setOpNumList] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const opNumberSet = new Set();
    let hasUncategorized = false;

    data.forEach((row) => {
      const op = row.MOMOperationNum;

      if (op === null || op === undefined) {
        hasUncategorized = true;
      } else {
        opNumberSet.add(Number(op));
      }
    });

    const sortedOps = Array.from(opNumberSet).sort((a, b) => a - b);

    if (hasUncategorized) sortedOps.push("Uncategorized");
    if (sortedOps.length > 0) sortedOps.push("All");

    setOpNumList(sortedOps);
  }, [data]);

  return (
    <div style={{ width: "100%", padding: "12px" }}>
      <h5 style={{ marginBottom: "10px" }}>OpNums</h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {opNumList.map((num, i) => (
          <li
            key={i}
            onClick={() => onSelect(num)}
            style={{
              padding: "8px",
              marginBottom: "6px",
              borderRadius: "4px",
              backgroundColor: num === selectedOpNum ? "#007bff" : "#fff",
              color: num === selectedOpNum ? "#fff" : "#000",
              border: "1px solid #007bff",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {num}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpNumSelector;