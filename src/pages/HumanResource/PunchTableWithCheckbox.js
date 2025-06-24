import React, { useState } from "react";
import {
    Table, Input, Button, Row, Col, Label, FormGroup
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import PunchActionsPanel from "./PunchActionsPanel";

const PunchTableWithCheckboxes = ({ data }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [inOut, setInOut] = useState("IN");
    const [punchType, setPunchType] = useState("Normal");
    const [punchTime, setPunchTime] = useState([new Date()]);
    const [workingDate, setWorkingDate] = useState([new Date()]);

    const formatDate = date =>
        new Date(date).toISOString().split("T")[0];

    const handleCheckboxChange = (empId, date) => {
        const key = `${empId}-${formatDate(date)}`;
        setSelectedRows(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const selected = selectedRows.length === 1
        ? data.find(row => {
            const rowKey = `${row.empId}-${formatDate(row.date)}`;
            const match = rowKey === selectedRows[0];
            if (match) console.log("🔍 Found match for:", rowKey);
            return match;
        })
        : null;
    console.log("✅ selected:", selected);
    return (
        <div>
            <Table bordered responsive hover>
                <thead>
                    <tr>
                        <th><Input type="checkbox" /></th>
                        <th>Emp ID</th>
                        <th>Employee Name</th>
                        <th>Missing Date</th>
                        <th>Type</th>
                        <th>Seq. Code</th>
                        <th>Status</th>

                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 ? data.map((row, index) => {
                        const key = `${row.empId}-${row.date}`;
                        const isChecked = selectedRows.includes(key);

                        return (
                            <tr key={key}>
                                <td>
                                    <div className="form-check">
                                        <Input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`checkbox-${key}`}
                                            checked={isChecked}
                                            onChange={() => handleCheckboxChange(row.empId, row.date)}
                                        />
                                        <label className="form-check-label" htmlFor={`checkbox-${key}`}></label>
                                    </div>
                                </td>
                                <td>{row.empId}</td>
                                <td>{row.name}</td>
                                <td>{new Date(row.date).toLocaleDateString()}</td>
                                <td>{row.type}</td>
                                <td>{row.seqCode}</td>
                                <td>
                                    {row.type.includes("Missing") ? (
                                        <span className="text-danger">Incomplete</span>
                                    ) : (
                                        <span className="text-success">OK</span>
                                    )}
                                </td>

                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan="7" className="text-center">No punch data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>


            {selected ? (
                <PunchActionsPanel
                    selectedEmpId={selected.empId}
                    selectedEmpName={selected.name}
                    selectedDate={selected.date}
                    selectedSeqCode={selected.seqCode}
                    status={selected.status}
                />
            ) : (
                <p>No row selected or not found.</p>
            )}

        </div>
    );
};

export default PunchTableWithCheckboxes;
