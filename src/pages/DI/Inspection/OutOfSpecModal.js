import React, { useState } from "react";

const OutOfSpecModal = ({ onClose, onConfirm }) => {
  const [classification, setClassification] = useState("Minor");
  const [action, setAction] = useState("scrap");

  const handleConfirm = () => {
    const payload = {
      classification,
      scrap: action === "scrap",
      leave: action === "leave",
      dmr: action === "dmr",
    };
    onConfirm(payload);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Nonconformity Detected</h2>
        <p style={styles.subtext}>Please classify the issue and select an action to proceed.</p>

        <div style={styles.section}>
          <label style={styles.label}>Severity:</label>
          <select
            style={styles.select}
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
          >
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Action:</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="action"
                value="scrap"
                checked={action === "scrap"}
                onChange={() => setAction("scrap")}
              />
              Scrap
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="action"
                value="leave"
                checked={action === "leave"}
                onChange={() => setAction("leave")}
              />
              Leave as is
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="action"
                value="dmr"
                checked={action === "dmr"}
                onChange={() => setAction("dmr")}
              />
              File DMR
            </label>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancel}>
            Cancel
          </button>
          <button onClick={handleConfirm} style={styles.confirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "10px",
    padding: "24px",
    width: "400px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
    color: "#333",
  },
  subtext: {
    fontSize: "14px",
    color: "#666",
    marginTop: "-8px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  radioLabel: {
    fontSize: "14px",
    color: "#333",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "12px",
  },
  confirm: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancel: {
    padding: "8px 16px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default OutOfSpecModal;
