import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, CardHeader, Row, Col, Container } from "reactstrap";
import toast from "react-hot-toast";

const initialForm = {
    employee: "",
    hireDate: "",
    supervisor: "",
    reviewDate: "",
    ratings: Array.from({ length: 5 }, () => ({ value: "", label: "" })),
    improvementPlan: "",
    overallAssessment: "", // Below / Meets / Exceeds
    payRaise: false,
    approvals: {
        supervisor: "",
        supervisorDate: "",
        manager: "",
        managerDate: "",
        hr: "",
        hrDate: ""
    }
};

const labels = ["Unsatisfactory", "Marginal", "Good", "Exceptional", "Beyond Belief"];
const criteriaLabels = ["Attitude", "Job Knowledge", "Communication", "Initiative", "Style Fit"];

const NinetyDayReviewForm = () => {
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        const draft = localStorage.getItem("90dayDraft");
        if (draft) setFormData(JSON.parse(draft));
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            localStorage.setItem("90dayDraft", JSON.stringify(formData));
            toast.success("Draft saved", { duration: 1000, position: "bottom-right" });
        }, 1000);
        return () => clearTimeout(t);
    }, [formData]);

    const handleRatingChange = (i, value) => {
        const ratings = [...formData.ratings];
        ratings[i] = { value, label: labels[value - 1] };
        setFormData(p => ({ ...p, ratings }));
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
            const res = await fetch("/api/hr/review/90day", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) toast.success("90-Day Review submitted");
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
                            href="/assets/90-Day Review Form.pdf"
                            download
                            className="btn btn-soft-info btn-sm"
                        >
                            <i className="ri-download-2-fill me-1 align-bottom"></i> Download Form
                        </a>
                    </div>
                </CardHeader>

                <Row>
                    <Col md={6}><FormGroup><Label>Employee</Label><Input value={formData.employee} onChange={e => setFormData(p => ({ ...p, employee: e.target.value }))} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Review Date</Label><Input type="date" value={formData.reviewDate} onChange={e => setFormData(p => ({ ...p, reviewDate: e.target.value }))} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Date of Hire</Label><Input type="date" value={formData.hireDate} onChange={e => setFormData(p => ({ ...p, hireDate: e.target.value }))} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Supervisor</Label><Input value={formData.supervisor} onChange={e => setFormData(p => ({ ...p, supervisor: e.target.value }))} /></FormGroup></Col>
                </Row>

                <h5 className="mt-4">Performance Criteria</h5>
                {criteriaLabels.map((label, i) => (
                    <FormGroup key={label}>
                        <Label>{i + 1}. {label}</Label>
                        <Input type="select" value={formData.ratings[i].value} onChange={e => handleRatingChange(i, Number(e.target.value))}>
                            <option value="">Select Rating</option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n} - {labels[n - 1]}</option>
                            ))}
                        </Input>
                    </FormGroup>
                ))}

                <FormGroup className="mt-3">
                    <Label>Proposed Improvement Plan</Label>
                    <Input type="textarea" rows={4} value={formData.improvementPlan} onChange={e => setFormData(p => ({ ...p, improvementPlan: e.target.value }))} />
                </FormGroup>

                <FormGroup>
                    <Label>Overall Assessment</Label>
                    <Input type="select" value={formData.overallAssessment} onChange={e => setFormData(p => ({ ...p, overallAssessment: e.target.value }))}>
                        <option value="">Select One</option>
                        <option>Below Expectations</option>
                        <option>Meets Expectations</option>
                        <option>Exceeds Expectations</option>
                    </Input>
                </FormGroup>

                <FormGroup check className="mb-3">
                    <Input type="checkbox" checked={formData.payRaise} onChange={e => setFormData(p => ({ ...p, payRaise: e.target.checked }))} />
                    <Label check>Pay Raise (PIC Form)</Label>
                </FormGroup>

                <h5 className="mt-4">Approvals</h5>
                <Row>
                    <Col md={6}><FormGroup><Label>Supervisor</Label><Input value={formData.approvals.supervisor} onChange={e => handleApprovalChange("supervisor", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.supervisorDate} onChange={e => handleApprovalChange("supervisorDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Manager</Label><Input value={formData.approvals.manager} onChange={e => handleApprovalChange("manager", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.managerDate} onChange={e => handleApprovalChange("managerDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>HR</Label><Input value={formData.approvals.hr} onChange={e => handleApprovalChange("hr", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.approvals.hrDate} onChange={e => handleApprovalChange("hrDate", e.target.value)} /></FormGroup></Col>
                </Row>

                <Button color="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default NinetyDayReviewForm;
