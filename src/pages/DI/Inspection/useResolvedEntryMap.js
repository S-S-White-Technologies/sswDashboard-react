import { useMemo } from "react";

export const useResolvedEntryMap = ({
  mafiaEntryTable = [],
  selectedDna,
  min,
  max,
}) => {
  return useMemo(() => {
    if (!selectedDna || mafiaEntryTable.length === 0) {
      return { values: {}, disabledFields: [], highlightedFields: [] };
    }

    const values = {};
    const disabled = [];
    const highlight = [];

    mafiaEntryTable.forEach((row) => {
      const cell = row.CellNum?.toString();
      const value = row.Value?.toString();
      const dnaMatch = row.DNANum?.trim() === selectedDna.DNANum;
      const name = `txtDynamic${cell}`;

      if (!dnaMatch || !cell || !value) return;
      values[name] = value;
      disabled.push(name);

      if (value === "-777") values[name] = "PASS";
      else if (value === "-999") {
        values[name] = "FAIL";
        highlight.push(name);
      } else {
        const valNum = parseFloat(value);
        const lower = min !== "" ? parseFloat(min) : null;
        const upper = max !== "" ? parseFloat(max) : null;
        if (
          (!isNaN(valNum) &&
            ((lower !== null && valNum < lower) ||
              (upper !== null && valNum > upper)))
        ) {
          highlight.push(name);
        }
      }
    });

    return { values, disabledFields: disabled, highlightedFields: highlight };
  }, [mafiaEntryTable, selectedDna, min, max]);
};
