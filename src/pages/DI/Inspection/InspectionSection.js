import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast } from "react-toastify";
import OpNumSelector from "./OpNumSelector";
import DnaNumDetails from "./DnaNumDetails";
import DnaDetailsHeader from "./DnaDetailsHeader";
import DynamicCommentGrid from "./DynamicCommentGrid";
import OutOfSpecModal from "./OutOfSpecModal";

const InspectionSection = () => {
  const [fullData, setFullData] = useState([]);
  const [selectedOpNum, setSelectedOpNum] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDna, setSelectedDna] = useState(null);
  const [entryBoxCount, setEntryBoxCount] = useState(0);
  const [entryValues, setEntryValues] = useState({});
  const [jobQuantity, setJobQuantity] = useState(0);
  const [payloadComment, setPayloadComment] = useState("");

  // Nonconformity
  const [unresolvedCells, setUnresolvedCells] = useState([]);
  const [showOutOfSpecModal, setShowOutOfSpecModal] = useState(false);
  const [classificationInfo, setClassificationInfo] = useState(null);

  const JOB_CONTEXT = {
    jobNum: "0093831",
    waveNumber: 2,
    revMajor: 1,
    revMinor: 4,
    seq: 0,
    lotNum: 0,
    enteredBy: 1776,
  };

  const getInspectionData = async () => {
    try {
      const response = await api.post("/Inspection/mafiatable", {
        partnumber: "FC170M1",
        major: JOB_CONTEXT.revMajor,
        minor: JOB_CONTEXT.revMinor,
      });

      if (response.status === 200 || response.status === 201) {
        setFullData(response.data);
      } else {
        toast.error("Failed to load inspection data.");
      }
    } catch {
      toast.error("Server error: unable to fetch inspection data.");
    }
  };

  const fetchExistingComment = async (item) => {
    try {
      const response = await api.post("/Inspection/comment", {
        jobNum: JOB_CONTEXT.jobNum,
        dnaNum: item.DNANum,
        revMajor: JOB_CONTEXT.revMajor,
        revMinor: JOB_CONTEXT.revMinor,
        waveNumber: JOB_CONTEXT.waveNumber,
        seq: JOB_CONTEXT.seq,
        partNum: item.PartNum,
        lotNum: JOB_CONTEXT.lotNum,
      });

      if (response.status === 200) {
        setPayloadComment(response.data === "NULL" ? "" : response.data);
      } else {
        setPayloadComment("");
      }
    } catch (err) {
      console.error("Failed to fetch comment:", err);
      setPayloadComment("");
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

  const handleDnaSelect = async (item) => {
    setSelectedDna(item);
    setEntryBoxCount(0);
    setEntryValues({});
    setPayloadComment("");

    try {
      const qtyRes = await api.post("/Inspection/original-quantity", {
        jobNum: JOB_CONTEXT.jobNum,
        waveNumber: JOB_CONTEXT.waveNumber,
        seq: JOB_CONTEXT.seq,
        partNum: item.PartNum,
        lot: JOB_CONTEXT.lotNum,
      });

      const quantity = qtyRes.data;
      setJobQuantity(quantity);

      const multiplierRes = await api.post("/Inspection/determine-multiplier", {
        dimType: item.DimType,
        toleranceClass: item.ToleranceClass,
        jobQuan: quantity,
      });

      const multiplier = multiplierRes.data;
      const count = calculateNumberToCheck(multiplier, quantity, item.ToleranceClass, item.DimType);

      setEntryBoxCount(count);
      await fetchExistingComment(item);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inspection info.");
    }
  };

  const getUnresolvedNonconformities = () => {
    if (!selectedDna) return [];

    const dna = selectedDna.DNANum?.replace("!", "").trim();
    const spec = filteredData.find((d) => d.DNANum === dna);
    if (!spec) return [];

    const min = parseFloat(spec.Min);
    const max = parseFloat(spec.Max);
    const method = spec.MethodOfRecording?.toLowerCase() || "";
    const dimType = spec.DimType?.toLowerCase() || "";

    const outOfSpecCells = [];

    for (const [name, val] of Object.entries(entryValues)) {
      if (!val || val.trim() === "") continue;

      const cellNum = parseInt(name.replace("txtDynamic", ""));
      const num = parseFloat(val);

      let isOut = false;
      if (method.includes("fail") || dimType.includes("*")) {
        isOut = val.trim() === "-999";
      } else if (isNaN(num)) {
        isOut = true;
      } else {
        if (!isNaN(min) && num < min) isOut = true;
        if (!isNaN(max) && num > max) isOut = true;
      }

      if (isOut) outOfSpecCells.push(cellNum);
    }

    return outOfSpecCells;
  };

  const proceedToSave = async (nonConformities = null) => {
    if (!selectedDna) return toast.error("No DNA selected.");

    const entries = Object.entries(entryValues)
      .filter(([_, val]) => val && val.trim() !== "")
      .reduce((acc, [key, val]) => {
        acc[key] = val.trim();
        return acc;
      }, {});

    const payload = {
      ...JOB_CONTEXT,
      dnaNum: selectedDna.DNANum,
      tool: selectedDna.Tool || "",
      assemblySeq: JOB_CONTEXT.seq,
      partNum: selectedDna.PartNum,
      entries,
      comment: payloadComment,
      nonConformities: nonConformities
        ? {
            cellNums: nonConformities.cellNums,
            classification: nonConformities.classification,
            scrap: nonConformities.scrap,
            leave: nonConformities.leave,
            dmr: nonConformities.dmr,
          }
        : null,
    };

    try {
      const response = await api.post("/Inspection/save-inspection", payload);
      if (response.status === 200) {
        toast.success("Comment entries saved successfully.");
        setUnresolvedCells([]);
        setClassificationInfo(null);
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error(err);
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

  const handleEntryChange = (name, value) => {
    setEntryValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getInspectionData();
  }, []);

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

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", marginTop: "60px" }}>
      {/* Left Panel */}
      <div style={{ width: "20%", display: "flex", flexDirection: "row", borderRight: "1px solid #ccc" }}>
        <div style={{ width: "50%" }}>
          <OpNumSelector data={fullData} selectedOpNum={selectedOpNum} onSelect={setSelectedOpNum} />
        </div>
        <div style={{ width: "50%" }}>
          <DnaNumDetails data={filteredData} selectedDna={selectedDna} onSelectDna={handleDnaSelect} />
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flexGrow: 1, backgroundColor: "#ffffff", display: "flex", flexDirection: "column" }}>
        <DnaDetailsHeader selectedDna={selectedDna} />

        {/* Scrollable Entry Grid */}
        <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
          {selectedDna && entryBoxCount > 0 && (
            <DynamicCommentGrid
              count={entryBoxCount}
              values={entryValues}
              onChange={handleEntryChange}
              labels={
                selectedDna?.DimType?.toLowerCase().includes("pass/fail") ? ["Pass", "Fail", "Total"] : undefined
              }
            />
          )}
        </div>

        {/* Fixed Footer with Comment & Save */}
        <div
          style={{
            borderTop: "1px solid #ccc",
            padding: "12px 24px",
            backgroundColor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <textarea
            placeholder="Enter comments here..."
            value={payloadComment}
            onChange={(e) => setPayloadComment(e.target.value)}
            style={{
              flexGrow: 1,
              height: "60px",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          <button
            onClick={handleSave}
            disabled={!selectedDna || entryBoxCount === 0}
            style={{
              height: "40px",
              padding: "0 16px",
              fontSize: "14px",
              backgroundColor: !selectedDna || entryBoxCount === 0 ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: !selectedDna || entryBoxCount === 0 ? "not-allowed" : "pointer",
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
