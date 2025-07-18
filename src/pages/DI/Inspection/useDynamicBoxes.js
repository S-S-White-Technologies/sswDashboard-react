import { useEffect, useState } from "react";
import api from "../../../config/api";

const getSpecialBoxConfig = (dimType) => {
  const config = {
    "check w/ gauge*": {
      labels: ["Calib. Date", "Asset #"],
      names: ["txtDynamic500001", "txtDynamic500002"],
    },
    "heat treat*": {
      labels: ["Time", "Temp (F)", "Condition", "Hardness"],
      names: [
        "txtDynamic500003",
        "txtDynamic500004",
        "txtDynamic500005",
        "txtDynamic500006",
      ],
    },
    "weld*": {
      labels: ["Weld Type", "Filler Rod", "Rod Lot #", "Pass/Fail"],
      names: [
        "txtDynamic500007",
        "txtDynamic500008",
        "txtDynamic500009",
        "txtDynamic500010",
      ],
    },
    "passivation*": {
      labels: ["Time", "Temp (F)", "H2O Quality", "Concentration", "Pass/Fail"],
      names: [
        "txtDynamic500011",
        "txtDynamic500012",
        "txtDynamic500013",
        "txtDynamic500014",
        "txtDynamic500015",
      ],
    },
    "humidity chamber*": {
      labels: ["Start Time", "End Time", "Pass/Fail"],
      names: [
        "txtDynamic500016",
        "txtDynamic500017",
        "txtDynamic500018",
      ],
    },
    "salt fog*": {
      labels: ["Start Time", "End Time", "Pass/Fail"],
      names: [
        "txtDynamic500020",
        "txtDynamic500021",
        "txtDynamic500022",
      ],
    },
    "copper sulfate*": {
      labels: ["Expir. Date", "Soak Time", "Pass/Fail"],
      names: [
        "txtDynamic500023",
        "txtDynamic500024",
        "txtDynamic500025",
      ],
    },
    "final inspection*": {
      labels: ["Check Visual (P/F)", "Check Dimensional (P/F)"],
      names: ["txtDynamic500026", "txtDynamic500027"],
    },
    "pass/fail*": {
      labels: ["# pass", "# fail", "# total"],
      names: ["txtDynamic500028", "txtDynamic500029", "txtDynamic500030"],
    },
  };
  return config[dimType] || null;
};

export const useDynamicBoxes = ({
  jobNum,
  waveNumber,
  seq,
  partNum,
  lotNum,
  revMajor,
  revMinor,
  selectedDna,
  mafiaTables,
}) => {
  const [entryCount, setEntryCount] = useState(0);
  const [entryLabels, setEntryLabels] = useState([]);
  const [entryNames, setEntryNames] = useState([]);
  const [jobQuantity, setJobQuantity] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!selectedDna || !selectedDna.DNANum) return;

      try {
        const dimType = mafiaTables?.[selectedDna.DNANum]?.DimType?.toLowerCase()?.trim() || "";

        if (dimType.includes("note") || dimType.includes("textbox")) {
          setEntryCount(0);
          setEntryLabels([]);
          setEntryNames([]);
          return;
        }


        const qtyRes = await api.post("/Inspection/original-quantity", {
          JobNum: jobNum,
          WaveNumber: parseInt(waveNumber, 10),
          Seq: seq,
          PartNum: partNum,
          Lot: parseInt(lotNum, 10) || 0,
        });


        const quantity = qtyRes?.data;
        if (!quantity || isNaN(quantity)) throw new Error("Invalid quantity received");
        setJobQuantity(quantity);

       const initRes = await api.post("/Inspection/determine-number-to-check", {
          JobQuan: quantity,
          DnaNum: selectedDna.DNANum,
          PartNum: partNum,
          RevMajor: revMajor,
          RevMinor: revMinor,
        });

        const init = initRes?.data;
        if (typeof init !== "number" ) throw new Error("Invalid init");

       const addlRes = await api.post("/Inspection/determine-number-to-check-additional", {
          JobNum: jobNum,
          DnaNum: selectedDna.DNANum,
          RevMajor: revMajor,
          RevMinor: revMinor,
          WaveNumber: parseInt(waveNumber, 10),
          Seq: seq,
          PartNum: partNum,
          LotNum: parseInt(lotNum, 10) || 0,
          JobQuan: quantity,
        });

        const init2 = addlRes?.data || 0;

        const config = getSpecialBoxConfig(dimType);
        if (config) {
          setEntryCount(config.names.length);
          setEntryLabels(config.labels);
          setEntryNames(config.names);
          return;
        }

        const total = Math.max(init + init2, init);
        const interval = init > 2 ? Math.floor(quantity / (init - 2)) : 1;
        const labels = [];
        const names = [];

        let addl = 1;
        for (let i = 1; i <= total; i++) {
          names.push(`txtDynamic${i}`);
          if (i === 1) {
            labels.push("1");
          } else if (i === init) {
            labels.push(quantity.toString());
          } else if (i > init) {
            labels.push(`+${addl++}`);
          } else {
            const calculated = interval * (i - 1);
            if (calculated === quantity) {
              labels.push((calculated - 1).toString());
            } else {
              labels.push((calculated).toString());
            }
          }

        }

        setEntryCount(total);
        setEntryLabels(labels);
        setEntryNames(names);
      } catch (err) {
        console.error("useDynamicBoxes failed:", err);
        setEntryCount(0);
        setEntryLabels([]);
        setEntryNames([]);
      }
    };
    load();
  }, [selectedDna]);

  return { entryCount, entryLabels, entryNames, jobQuantity };
};