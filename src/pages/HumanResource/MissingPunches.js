import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import {
    Row, Col, Button, Card, CardBody, CardHeader, ListGroup, ListGroupItem,
    Table, Input, FormGroup, Label
} from "reactstrap";
import axios from "axios";
import PunchTableWithCheckboxes from "./PunchTableWithCheckbox"


const MissingPunches = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);

    const fetchPunchData = async () => {


        const start = startDate[0].toISOString().split("T")[0];
        const end = endDate[0].toISOString().split("T")[0];

        try {
            const res = await axios.get(
                `https://localhost:7168/api/Punch/missing?startDate=${start}&endDate=${end}`
            );

            console.log("Response Missing:", res);
            setReportData(res.missingPunches || []);
        } catch (err) {
            console.error("Error loading punch data:", err);
        }
    };


    useEffect(() => {
        fetchPunchData();
    }, []);

    const empList = Array.from(new Set(reportData.map(r => r.empId)));

    const filteredLogs = selectedEmp
        ? reportData.filter(p => p.empId === selectedEmp)
        : [];

    return (
        <Card className="shadow-sm">
            <CardHeader>🕒 Missing Punches Report</CardHeader>
            <CardBody>
                <Row className="mb-3">
                    <Col md={4}>
                        <Label>Start Date</Label>
                        <Flatpickr
                            className="form-control"
                            value={startDate}
                            onChange={date => setStartDate(date)}
                            options={{ dateFormat: "Y-m-d" }}
                        />
                    </Col>
                    <Col md={4}>
                        <Label>End Date</Label>
                        <Flatpickr
                            className="form-control"
                            value={endDate}
                            onChange={date => setEndDate(date)}
                            options={{ dateFormat: "Y-m-d" }}
                        />
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                        <Button color="danger" className="btn btn-soft-danger" onClick={fetchPunchData}>Get Details</Button>
                    </Col>
                </Row>

                <Row>
                    <Col md={3}>
                        <Label>Employee List</Label>
                        <ListGroup style={{ maxHeight: 300, overflowY: "auto" }}>
                            {empList.map(emp => (
                                <ListGroupItem
                                    key={emp}
                                    active={emp === selectedEmp}
                                    tag="button"
                                    onClick={() => setSelectedEmp(emp)}
                                >
                                    {emp}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col md={9}>
                        <Label>Missing Punch Log</Label>
                        {/* <Table bordered size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>Emp ID</th>
                                    <th>Date</th>
                                    <th>Missing Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.empId}</td>
                                            <td>{new Date(row.date).toLocaleDateString()}</td>
                                            <td>{row.type}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center">No missing punches</td></tr>
                                )}
                            </tbody>
                        </Table> */}
                        <PunchTableWithCheckboxes data={filteredLogs} />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default MissingPunches;
