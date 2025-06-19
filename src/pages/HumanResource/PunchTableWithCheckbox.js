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

    const handleCheckboxChange = (empId, date) => {
        const key = `${empId}-${date}`;
        setSelectedRows(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };
    const formatDate = date =>
        new Date(date).toISOString().split("T")[0];

    const selected = selectedRows.length === 1
        ? data.map(row =>
            `${row.empId}-${formatDate(row.date)}` === selectedRows[0]
        )
        : null;
    console.log("✅ selected:", selected);
    return (
        <div>
            <Table bordered responsive hover>
                <thead>
                    <tr>
                        <th><Input type="checkbox" disabled /></th>
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
                                    <Input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleCheckboxChange(row.empId, row.date)}
                                    />
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
                            <td colSpan="6" className="text-center">No punch data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>


            {selected && (

                <PunchActionsPanel
                    selectedEmpId={selected.empId}
                    selectedEmpName={selected.name}
                    selectedDate={selected.date}
                    selectedSeqCode={selected.seqCode}
                    status={selected.status}
                />
            )}

        </div>
    );
};

export default PunchTableWithCheckboxes;
