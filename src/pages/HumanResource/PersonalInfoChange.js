import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, CardHeader, Input, Row, Col, Container } from "reactstrap";
import toast from "react-hot-toast";

const initialForm = {
    employee: "",
    hireDate: "",
    jobTitle: "",
    changeDate: "",
    changes: {
        departmentFrom: "",
        departmentTo: "",
        supervisorFrom: "",
        supervisorTo: "",
        titleFrom: "",
        titleTo: "",
        flsaFrom: "",
        flsaTo: "",
        shiftFrom: "",
        shiftTo: "",
        payFrom: "",
        payTo: "",
        percentIncrease: "",
        amountIncrease: "",
        effectivePP: "",
        retroFrom: "",
        retroTo: "",
        retroTotal: "",
        bonusPlan: "",
        comments: "",
        epoLimit: ""
    },
    approvals: {
        supervisor: "",
        supervisorDate: "",
        manager: "",
        managerDate: "",
        hr: "",
        hrDate: "",
        president: "",
        presidentDate: ""
    }
};

const PICForm = () => {
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        const draft = localStorage.getItem("picFormDraft");
        if (draft) setFormData(JSON.parse(draft));
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            localStorage.setItem("picFormDraft", JSON.stringify(formData));
            toast.success("Draft saved", { duration: 1000, position: "bottom-right" });
        }, 1000);
        return () => clearTimeout(t);
    }, [formData]);

    const handleChange = (field, value) => {
        setFormData(p => ({ ...p, [field]: value }));
    };

    const handleChangeDetail = (field, value) => {
        setFormData(p => ({ ...p, changes: { ...p.changes, [field]: value } }));
    };

    const handleApprovalChange = (field, value) => {
        setFormData(p => ({
            ...p,
            approvals: { ...p.approvals, [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/hr/pic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) toast.success("PIC Form submitted successfully");
            else throw new Error("Submission failed");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit} className="p-4">
                <CardHeader className="align-items-center d-flex ">
                    <h2 className=" mb-0 flex-grow-1"></h2>
                    <div className="">
                        <a
                            href="/assets/HR020-PIC Form.pdf"
                            download
                            className="btn btn-soft-info btn-sm"
                        >
                            <i className="ri-download-2-fill me-1 align-bottom"></i> Download Form
                        </a>
                    </div>
                </CardHeader>

                <Row>
                    <Col md={6}><FormGroup><Label>Employee</Label><Input value={formData.employee} onChange={e => handleChange("employee", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date of Hire</Label><Input type="date" value={formData.hireDate} onChange={e => handleChange("hireDate", e.target.value)} /></FormGroup></Col>
                </Row>

                <Row>
                    <Col md={6}><FormGroup><Label>Job Title</Label><Input value={formData.jobTitle} onChange={e => handleChange("jobTitle", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Change Effective Date</Label><Input type="date" value={formData.changeDate} onChange={e => handleChange("changeDate", e.target.value)} /></FormGroup></Col>
                </Row>

                <h5 className="mt-4">Change Details</h5>
                <Row>
                    <Col md={6}><FormGroup><Label>Department (from)</Label><Input value={formData.changes.departmentFrom} onChange={e => handleChangeDetail("departmentFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Department (to)</Label><Input value={formData.changes.departmentTo} onChange={e => handleChangeDetail("departmentTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Supervisor (from)</Label><Input value={formData.changes.supervisorFrom} onChange={e => handleChangeDetail("supervisorFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Supervisor (to)</Label><Input value={formData.changes.supervisorTo} onChange={e => handleChangeDetail("supervisorTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Job Title (from)</Label><Input value={formData.changes.titleFrom} onChange={e => handleChangeDetail("titleFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Job Title (to)</Label><Input value={formData.changes.titleTo} onChange={e => handleChangeDetail("titleTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>FLSA Status (from)</Label><Input value={formData.changes.flsaFrom} onChange={e => handleChangeDetail("flsaFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>FLSA Status (to)</Label><Input value={formData.changes.flsaTo} onChange={e => handleChangeDetail("flsaTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Shift (from)</Label><Input value={formData.changes.shiftFrom} onChange={e => handleChangeDetail("shiftFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Shift (to)</Label><Input value={formData.changes.shiftTo} onChange={e => handleChangeDetail("shiftTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Pay Rate (from)</Label><Input value={formData.changes.payFrom} onChange={e => handleChangeDetail("payFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Pay Rate (to)</Label><Input value={formData.changes.payTo} onChange={e => handleChangeDetail("payTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={4}><FormGroup><Label>Increase %</Label><Input value={formData.changes.percentIncrease} onChange={e => handleChangeDetail("percentIncrease", e.target.value)} /></FormGroup></Col>
                    <Col md={4}><FormGroup><Label>Increase $</Label><Input value={formData.changes.amountIncrease} onChange={e => handleChangeDetail("amountIncrease", e.target.value)} /></FormGroup></Col>
                    <Col md={4}><FormGroup><Label>Effective PP</Label><Input value={formData.changes.effectivePP} onChange={e => handleChangeDetail("effectivePP", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Retroactive From PP</Label><Input value={formData.changes.retroFrom} onChange={e => handleChangeDetail("retroFrom", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Retroactive To PP</Label><Input value={formData.changes.retroTo} onChange={e => handleChangeDetail("retroTo", e.target.value)} /></FormGroup></Col>
                </Row>
                <FormGroup><Label>Total Retroactive Amount</Label><Input value={formData.changes.retroTotal} onChange={e => handleChangeDetail("retroTotal", e.target.value)} /></FormGroup>
                <FormGroup><Label>Bonus / Bonus Plan</Label><Input value={formData.changes.bonusPlan} onChange={e => handleChangeDetail("bonusPlan", e.target.value)} /></FormGroup>
                <FormGroup><Label>Special Permissions / Software Access / Comments</Label><Input type="textarea" rows={3} value={formData.changes.comments} onChange={e => handleChangeDetail("comments", e.target.value)} /></FormGroup>
                <FormGroup><Label>EPO Limit</Label><Input value={formData.changes.epoLimit} onChange={e => handleChangeDetail("epoLimit", e.target.value)} /></FormGroup>

                <h5 className="mt-4">Approvals</h5>
                <Row>
                    <Col md={6}><FormGroup><Label>Direct Supervisor</Label><Input value={formData.approvals.supervisor} onChange={e => handleApprovalChange("supervisor", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.supervisorDate} onChange={e => handleApprovalChange("supervisorDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Manager</Label><Input value={formData.approvals.manager} onChange={e => handleApprovalChange("manager", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.managerDate} onChange={e => handleApprovalChange("managerDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Human Resources</Label><Input value={formData.approvals.hr} onChange={e => handleApprovalChange("hr", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.hrDate} onChange={e => handleApprovalChange("hrDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>President</Label><Input value={formData.approvals.president} onChange={e => handleApprovalChange("president", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.presidentDate} onChange={e => handleApprovalChange("presidentDate", e.target.value)} /></FormGroup></Col>
                </Row>

                <Button color="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default PICForm;
