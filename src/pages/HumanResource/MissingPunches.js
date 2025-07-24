import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import {
    Row, Col, Button, Card, CardBody, CardHeader, ListGroup, Modal, ModalBody, ModalHeader, ListGroupItem,
    Table, Input, FormGroup, Label
} from "reactstrap";
import axios from "axios";
import { Link } from 'react-router-dom';
import PunchTableWithCheckboxes from "./PunchTableWithCheckbox";
import api from "../../api"


const MissingPunches = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);
    const fetchPunchData = async () => {
        if (!startDate || !endDate) {
            console.warn("Start or end date is missing");
            return;
        }

        setLoading(true);

        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];

        try {
            const res = await api.get(
                `Punch/missing?startDate=${start}&endDate=${end}`
            );

            const punches = res.data?.missingPunches || [];

            const isToday = (date) => {
                const today = new Date();
                return (
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );
            };

            const startIsToday = isToday(new Date(startDate));
            const endIsToday = isToday(new Date(endDate));

            if ((!punches || punches.length === 0) && !(startIsToday && endIsToday)) {
                setmodal_backdrop(true);
            }

            console.log("Response Missing:", res);
            setReportData(punches || []);
        } catch (err) {
            console.error("Error loading punch data:", err);
        } finally {
            setLoading(false);
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

            <CardBody>
                <Row className="mb-3">
                    <Col md={4}>
                        <Label>Start Date</Label>
                        <Flatpickr
                            className="form-control"
                            value={startDate}
                            onChange={(dates) => setStartDate(dates[0])}
                            options={{ dateFormat: "Y-m-d" }}
                        />
                    </Col>
                    <Col md={4}>
                        <Label>End Date</Label>
                        <Flatpickr
                            className="form-control"
                            value={endDate}
                            onChange={(dates) => setEndDate(dates[0])}
                            options={{ dateFormat: "Y-m-d" }}
                        />
                    </Col>
                    {loading && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                backgroundColor: "rgba(255,255,255,0.6)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999,
                            }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <Col md={4} className="d-flex align-items-end">
                        <Button color="success" className="btn btn-success" onClick={fetchPunchData}>Get Details</Button>
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
                <Modal
                    isOpen={modal_backdrop}
                    toggle={tog_backdrop}
                    backdrop="static"
                    id="staticBackdrop"
                    centered
                >
                    <ModalHeader>
                        {/* <h5 className="modal-title" id="staticBackdropLabel">Missing Punches</h5> */}
                    </ModalHeader>
                    <ModalBody className="text-center p-5">
                        <lord-icon
                            src="https://cdn.lordicon.com/lupuorrc.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "120px", height: "120px" }}>
                        </lord-icon>

                        <div className="mt-4">
                            <h4 className="mb-3">No Missing Punches</h4>
                            <p className="text-muted mb-4">No Missing Punches Have been Detected 🎉</p>
                            <div className="hstack gap-2 justify-content-center">
                                {/* <Button color="success" onClick={() => {
                                                        setmodal_backdrop(false);
                                                        history("/login"); // Redirect if needed
                                                    }}>
                                                        Go to Login
                                                    </Button> */}
                            </div>
                        </div>
                    </ModalBody>
                    <div className="modal-footer">
                        <Link to="#" className="btn btn-link link-success fw-medium" onClick={() => setmodal_backdrop(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link>

                    </div>
                </Modal>
            </CardBody>
        </Card>
    );
};

export default MissingPunches;
