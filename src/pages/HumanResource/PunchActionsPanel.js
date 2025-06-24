import React, { useState } from "react";
import {
    Row,
    Col,
    Button,
    Input,
    Label,
    FormGroup,
    Card,
    CardBody
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const PunchActionsPanel = ({ selectedEmpId, selectedEmpName, selectedDate, selectedSeqCode, status }) => {
    const [inOut, setInOut] = useState("IN");
    const [punchType, setPunchType] = useState("Normal");
    const [punchTime, setPunchTime] = useState([new Date()]);
    const [workingDate, setWorkingDate] = useState([new Date()]);

    const [editInOut, setEditInOut] = useState("IN");
    const [editPunchType, setEditPunchType] = useState("Normal");
    const [editPunchTime, setEditPunchTime] = useState([new Date()]);
    const [editWorkingDate, setEditWorkingDate] = useState([new Date()]);


    return (
        <Card className="shadow-sm mt-4">
            <CardBody>
                <Row>
                    <Col md={6}>
                        <h5 className="mb-3 border-bottom pb-2">Add Punches:</h5>
                        <FormGroup className="d-flex gap-4 align-items-center">
                            <div>Emp. Id: <strong>{selectedEmpId}</strong></div>
                            <div>Emp. Name: <strong>{selectedEmpName}</strong></div>
                        </FormGroup>

                        <FormGroup>
                            <Label>In / Out</Label><br />
                            <Input type="radio" name="inOut" checked={inOut === "IN"} onChange={() => setInOut("IN")} /> In{' '}
                            <Input type="radio" name="inOut" checked={inOut === "OUT"} onChange={() => setInOut("OUT")} /> Out
                        </FormGroup>

                        <FormGroup>
                            <Label>Punch Type</Label>
                            <Input
                                type="select"
                                value={punchType}
                                onChange={e => setPunchType(e.target.value)}
                            >
                                <option>Normal</option>
                                <option>Break</option>
                                <option>Business</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Missing Punch's Time</Label>
                            <Flatpickr
                                className="form-control"
                                value={punchTime}
                                onChange={date => setPunchTime(date)}
                                options={{ enableTime: true, noCalendar: true, dateFormat: "h:i K" }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Working Date</Label>
                            <Flatpickr
                                className="form-control"
                                value={workingDate}
                                onChange={date => setWorkingDate(date)}
                                options={{ dateFormat: "Y-m-d" }}
                            />
                        </FormGroup>
                        <div className="col-auto">
                            <Button color="primary" onClick={() => {
                                console.log("✅ Add Punch:", {
                                    selectedEmpId,
                                    inOut,
                                    punchType,
                                    punchTime: punchTime[0],
                                    workingDate: workingDate[0]
                                });
                            }}>
                                <i className="ri-add-line me-1 align-bottom"></i> Add Punch
                            </Button>
                        </div>

                    </Col>

                    <Col md={6}>
                        <h5 className="mb-3 border-bottom pb-2">Edit Punches:</h5>

                        <FormGroup className="d-flex gap-4 align-items-center">
                            <div>Sequence Code: <strong>{selectedSeqCode}</strong></div>
                        </FormGroup>

                        <FormGroup>
                            <Label>In / Out</Label><br />
                            <Input type="radio" name="editInOut" checked={editInOut === "IN"} onChange={() => setEditInOut("IN")} /> In{' '}
                            <Input type="radio" name="editInOut" checked={editInOut === "OUT"} onChange={() => setEditInOut("OUT")} /> Out
                        </FormGroup>

                        <FormGroup>
                            <Label>Punch Type</Label>
                            <Input
                                type="select"
                                value={editPunchType}
                                onChange={e => setEditPunchType(e.target.value)}
                            >
                                <option>Normal</option>
                                <option>Break</option>
                                <option>Business</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Punch Time</Label>
                            <Flatpickr
                                className="form-control"
                                value={editPunchTime}
                                onChange={date => setEditPunchTime(date)}
                                options={{ enableTime: true, noCalendar: true, dateFormat: "h:i K" }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Working Date</Label>
                            <Flatpickr
                                className="form-control"
                                value={editWorkingDate}
                                onChange={date => setEditWorkingDate(date)}
                                options={{ dateFormat: "Y-m-d" }}
                            />
                        </FormGroup>
                        <div className="col-auto">
                            <Button color="primary" onClick={() => {
                                console.log("✏️ Edit Punch:", {
                                    selectedSeqCode,
                                    editInOut,
                                    editPunchType,
                                    editPunchTime: editPunchTime[0],
                                    editWorkingDate: editWorkingDate[0]
                                });
                            }}>
                                <i className="ri-pencil-line me-1 align-bottom"></i> Edit Highlighted
                            </Button>
                        </div>

                    </Col>
                </Row>
            </CardBody>
        </Card>

    );
};

export default PunchActionsPanel;
