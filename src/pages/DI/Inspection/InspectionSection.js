import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../config/api";
import { toast } from "react-toastify";
import OpNumSelector from "./OpNumSelector";
import DnaNumDetails from "./DnaNumDetails";
import DnaDetailsHeader from "./DnaDetailsHeader";
import DynamicCommentGrid from "./DynamicCommentGrid";
import OutOfSpecModal from "./OutOfSpecModal";
import { useDynamicBoxes } from "./useDynamicBoxes";
import { useResolvedEntryMap } from "./useResolvedEntryMap";

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
  const [entryValues, setEntryValues] = useState({});
  const [payloadComment, setPayloadComment] = useState("");
  const [unresolvedCells, setUnresolvedCells] = useState([]);
  const [showOutOfSpecModal, setShowOutOfSpecModal] = useState(false);
  const [classificationInfo, setClassificationInfo] = useState(null);
  const [mafiaEntryTable, setMafiaEntryTable] = useState([]);

  // Build mafiaTables lookup
  const mafiaTables = useMemo(() => {
    const map = {};
    for (const item of fullData) {
      if (item.DNANum) {
        map[item.DNANum] = item;
      }
    }
    return map;
  }, [fullData]);

  // Load inspection table
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

  // Filter based on selected op
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

  // Hook: dynamic boxes
  const { entryCount, entryLabels, entryNames } = useDynamicBoxes({
    jobNum,
    waveNumber,
    seq,
    partNum,
    lotNum,
    revMajor,
    revMinor,
    selectedDna,
    mafiaTables,
  });

  // Hook: resolve prefilled & disabled fields
  const { values: prefillValues, disabledFields, highlightedFields } = useResolvedEntryMap({
    mafiaEntryTable,
    selectedDna,
    min: selectedDna?.Min,
    max: selectedDna?.Max,
  });

  // Pre-fill entry values when resolved
  useEffect(() => {
    setEntryValues(prefillValues);
  }, [prefillValues]);

  // DNA selection handler
  const handleDnaSelect = async (item) => {
    setSelectedDna(item);
    setEntryValues({});
    setPayloadComment("");

    try {
      const tableRes = await api.post("/Inspection/mafia-entry-table", {
        JobNum: jobNum,
        DnaNum: item.DNANum,
        RevMajor: revMajor,
        RevMinor: revMinor,
        WaveNumber: waveNumber,
        Seq: seq,
        PartNum: item.PartNum,
        LotNum: lotNum,
        JobQuan: quantity, // <-- ADD THIS!
      });

      setMafiaEntryTable(tableRes.data || []);

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
          {selectedDna && entryCount > 0 && (
            <DynamicCommentGrid
              count={entryCount}
              values={entryValues}
              onChange={(name, val) => setEntryValues((prev) => ({ ...prev, [name]: val }))}
              labels={entryLabels}
              names={entryNames}
              disabledFields={disabledFields}
              highlightedFields={highlightedFields}
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
            disabled={!selectedDna || entryCount === 0}
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
