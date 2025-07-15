// src/pages/Inspection/InspectionSection.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../config/api";
import { toast } from "react-toastify";
import OpNumSelector from "./OpNumSelector";
import DnaNumDetails from "./DnaNumDetails";
import DnaDetailsHeader from "./DnaDetailsHeader";
import DynamicCommentGrid from "./DynamicCommentGrid";
import OutOfSpecModal from "./OutOfSpecModal";

const InspectionSection = () => {
  const { state: JOB_CONTEXT } = useLocation();
  const {
    jobNum,
    waveNumber,
    revMajor,
    revMinor,
    seq,
    lotNum,
    enteredBy,
    partNum,
  } = JOB_CONTEXT || {};

  const [fullData, setFullData] = useState([]);
  const [selectedOpNum, setSelectedOpNum] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDna, setSelectedDna] = useState(null);
  const [entryBoxCount, setEntryBoxCount] = useState(0);
  const [entryValues, setEntryValues] = useState({});
  const [jobQuantity, setJobQuantity] = useState(0);
  const [payloadComment, setPayloadComment] = useState("");
  const [unresolvedCells, setUnresolvedCells] = useState([]);
  const [showOutOfSpecModal, setShowOutOfSpecModal] = useState(false);
  const [classificationInfo, setClassificationInfo] = useState(null);

  useEffect(() => {
    const getInspectionData = async () => {
      try {
        const res = await api.post("/Inspection/mafiatable", {
          partnumber: partNum,
          major: revMajor,
          minor: revMinor,
        });
        setFullData(res.data);
      } catch {
        toast.error("Failed to load inspection data.");
      }
    };
    getInspectionData();
  }, [partNum, revMajor, revMinor]);

  useEffect(() => {
    if (selectedOpNum === null) return;
    const result =
      selectedOpNum === "All"
        ? fullData
        : selectedOpNum === "Uncategorized"
        ? fullData.filter((d) => !d.MOMOperationNum)
        : fullData.filter((d) => d.MOMOperationNum === selectedOpNum);
    setFilteredData(result);
    setSelectedDna(null);
  }, [selectedOpNum, fullData]);

  const handleDnaSelect = async (item) => {
    setSelectedDna(item);
    setEntryBoxCount(0);
    setEntryValues({});
    setPayloadComment("");

    try {
      const qtyRes = await api.post("/Inspection/original-quantity", {
        jobNum,
        waveNumber,
        seq,
        partNum: item.PartNum,
        lot: lotNum,
      });

      const quantity = qtyRes.data;
      setJobQuantity(quantity);

      const multiplierRes = await api.post("/Inspection/determine-multiplier", {
        dimType: item.DimType,
        toleranceClass: item.ToleranceClass,
        jobQuan: quantity,
      });

      const count = calculateNumberToCheck(
        multiplierRes.data,
        quantity,
        item.ToleranceClass,
        item.DimType
      );

      setEntryBoxCount(count);

      const commentRes = await api.post("/Inspection/comment", {
        jobNum,
        dnaNum: item.DNANum,
        revMajor,
        revMinor,
        waveNumber,
        seq,
        partNum: item.PartNum,
        lotNum,
      });

      setPayloadComment(commentRes.data === "NULL" ? "" : commentRes.data);
    } catch {
      toast.error("Failed to load inspection detail.");
    }
  };

  const calculateNumberToCheck = (multiplier, quantity, tolClass, dimType) => {
    const dim = dimType.toLowerCase();
    const tolerance = tolClass.toLowerCase();
    if (dim.includes("pass/fail")) return 3;
    if (tolerance.includes("first piece")) return 1;
    if (tolerance.includes("100%")) return quantity;
    const base = Math.ceil(quantity * multiplier);
    return multiplier === 1 ? base : base + 2;
  };

  const getUnresolvedNonconformities = () => {
    if (!selectedDna) return [];
    const spec = filteredData.find((d) => d.DNANum === selectedDna.DNANum);
    if (!spec) return [];

    const min = parseFloat(spec.Min);
    const max = parseFloat(spec.Max);
    const outOfSpecCells = [];

    for (const [name, val] of Object.entries(entryValues)) {
      const cellNum = parseInt(name.replace("txtDynamic", ""));
      const num = parseFloat(val);
      if (isNaN(num) || num < min || num > max) {
        outOfSpecCells.push(cellNum);
      }
    }

    return outOfSpecCells;
  };

  const proceedToSave = async (nonConformities = null) => {
    if (!selectedDna) return toast.error("No DNA selected.");

    const entries = Object.entries(entryValues)
      .filter(([_, val]) => val.trim() !== "")
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v.trim() }), {});

    const payload = {
      jobNum,
      waveNumber,
      revMajor,
      revMinor,
      dnaNum: selectedDna.DNANum,
      tool: selectedDna.Tool || "",
      assemblySeq: seq,
      partNum: selectedDna.PartNum,
      lotNum,
      enteredBy,
      entries,
      comment: payloadComment,
      nonConformities,
    };

    try {
      const res = await api.post("/Inspection/save-inspection", payload);
      if (res.status === 200) {
        toast.success("Entries saved successfully.");
        setUnresolvedCells([]);
        setClassificationInfo(null);
      } else {
        toast.error("Failed to save entries.");
      }
    } catch {
      toast.error("Server error during save.");
    }
  };

  const handleSave = () => {
    const unresolved = getUnresolvedNonconformities();
    if (unresolved.length > 0) {
      setUnresolvedCells(unresolved);
      setShowOutOfSpecModal(true);
    } else {
      proceedToSave();
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", marginTop: "60px" }}>
      <div style={{ width: "20%", display: "flex", flexDirection: "row", borderRight: "1px solid #ccc" }}>
        <div style={{ width: "50%" }}>
          <OpNumSelector data={fullData} selectedOpNum={selectedOpNum} onSelect={setSelectedOpNum} />
        </div>
        <div style={{ width: "50%" }}>
          <DnaNumDetails data={filteredData} selectedDna={selectedDna} onSelectDna={handleDnaSelect} />
        </div>
      </div>
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <DnaDetailsHeader selectedDna={selectedDna} />
        <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
          {selectedDna && entryBoxCount > 0 && (
            <DynamicCommentGrid
              count={entryBoxCount}
              values={entryValues}
              onChange={(name, value) => setEntryValues((prev) => ({ ...prev, [name]: value }))}
              labels={
                selectedDna?.DimType?.toLowerCase().includes("pass/fail")
                  ? ["Pass", "Fail", "Total"]
                  : undefined
              }
            />
          )}
        </div>
        <div style={{ borderTop: "1px solid #ccc", padding: "12px 24px", display: "flex", gap: "12px" }}>
          <textarea
            placeholder="Enter comments here..."
            value={payloadComment}
            onChange={(e) => setPayloadComment(e.target.value)}
            style={{ flexGrow: 1, height: "60px" }}
          />
          <button
            onClick={handleSave}
            disabled={!selectedDna || entryBoxCount === 0}
            style={{
              padding: "0 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Save Entries
          </button>
        </div>
      </div>

      {showOutOfSpecModal && (
        <OutOfSpecModal
          onClose={() => setShowOutOfSpecModal(false)}
          onConfirm={(info) => {
            setClassificationInfo(info);
            setShowOutOfSpecModal(false);
            proceedToSave({ cellNums: unresolvedCells, ...info });
          }}
        />
      )}
    </div>
  );
};

export default InspectionSection;
