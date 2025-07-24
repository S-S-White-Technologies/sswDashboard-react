import React, { useState, useEffect } from "react";
import { Button, Input, Label, FormGroup, Form, Row, CardHeader, Col, Container } from "reactstrap";
import toast from "react-hot-toast";

const initialForm = {
    employeeName: "",
    reviewDate: "",
    position: "",
    department: "",
    dateOfHire: "",
    supervisor: "",
    questions: {
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: "",
        comments: ""
    },
    ratings: Array.from({ length: 13 }, () => ({ value: "", label: "" })),
    summary: {
        strengths: "",
        improvements: "",
        recommendations: "",
        goals: "",
        followUpRequested: false,
        meetingDate: "",
        signatures: {
            supervisor: "",
            supervisorDate: "",
            deptManager: "",
            deptManagerDate: "",
            hr: "",
            hrDate: ""
        }
    }
};

const ratingLabels = ["Unsatisfactory", "Marginal", "Good", "Exceptional", "Beyond Belief"];

const ExemptReviewFormFull = () => {
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("exemptReviewFullDraft", JSON.stringify(formData));
            toast.success("Draft saved", { duration: 1000, position: "bottom-right" });
        }, 1500);
        return () => clearTimeout(timeout);
    }, [formData]);

    useEffect(() => {
        const saved = localStorage.getItem("exemptReviewFullDraft");
        if (saved) setFormData(JSON.parse(saved));
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuestionChange = (q, value) => {
        setFormData(prev => ({
            ...prev,
            questions: { ...prev.questions, [q]: value }
        }));
    };

    const handleRatingChange = (index, value) => {
        const newRatings = [...formData.ratings];
        newRatings[index] = { value, label: ratingLabels[value - 1] };
        setFormData(prev => ({ ...prev, ratings: newRatings }));
    };

    const handleSummaryChange = (field, value) => {
        setFormData(prev => ({ ...prev, summary: { ...prev.summary, [field]: value } }));
    };

    const handleSignatureChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            summary: {
                ...prev.summary,
                signatures: { ...prev.summary.signatures, [field]: value }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/hr/review/full", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) toast.success("Form submitted successfully");
            else throw new Error("Failed to submit");
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
                            href="/assets/HR021Exempt Performance Review.pdf"
                            download
                            className="btn btn-soft-info btn-sm"
                        >
                            <i className="ri-download-2-fill me-1 align-bottom"></i> Download Form
                        </a>
                    </div>
                </CardHeader>
                <FormGroup><Label>Employee Name</Label><Input value={formData.employeeName} onChange={e => handleChange("employeeName", e.target.value)} /></FormGroup>
                <Row>
                    <Col md={6}><FormGroup><Label>Review Date</Label><Input type="date" value={formData.reviewDate} onChange={e => handleChange("reviewDate", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date of Hire</Label><Input type="date" value={formData.dateOfHire} onChange={e => handleChange("dateOfHire", e.target.value)} /></FormGroup></Col>
                </Row>
                <FormGroup><Label>Position</Label><Input value={formData.position} onChange={e => handleChange("position", e.target.value)} /></FormGroup>
                <FormGroup><Label>Department</Label><Input value={formData.department} onChange={e => handleChange("department", e.target.value)} /></FormGroup>
                <FormGroup><Label>Supervisor</Label><Input value={formData.supervisor} onChange={e => handleChange("supervisor", e.target.value)} /></FormGroup>

                <h5 className="mt-4">Employee Input</h5>
                {Object.entries(formData.questions).map(([key, value], i) => (
                    <FormGroup key={key}><Label>{i + 1}. {getQuestionText(key)}</Label>
                        <Input type="textarea" rows={3} value={value} onChange={e => handleQuestionChange(key, e.target.value)} />
                    </FormGroup>
                ))}

                <h5 className="mt-4">Supervisor Ratings</h5>
                {getRatingCriteria().map((title, i) => (
                    <FormGroup key={i}>
                        <Label>{i + 1}. {title}</Label>
                        <Input type="select" value={formData.ratings[i].value} onChange={e => handleRatingChange(i, Number(e.target.value))}>
                            <option value="">Select Rating</option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n} - {ratingLabels[n - 1]}</option>
                            ))}
                        </Input>
                    </FormGroup>
                ))}

                <h5 className="mt-4">Summary</h5>
                <FormGroup><Label>Strengths</Label><Input type="textarea" rows={2} value={formData.summary.strengths} onChange={e => handleSummaryChange("strengths", e.target.value)} /></FormGroup>
                <FormGroup><Label>Opportunities for Improvement</Label><Input type="textarea" rows={2} value={formData.summary.improvements} onChange={e => handleSummaryChange("improvements", e.target.value)} /></FormGroup>
                <FormGroup><Label>Recommendations</Label><Input type="textarea" rows={2} value={formData.summary.recommendations} onChange={e => handleSummaryChange("recommendations", e.target.value)} /></FormGroup>
                <FormGroup><Label>Goals for Next Year</Label><Input type="textarea" rows={2} value={formData.summary.goals} onChange={e => handleSummaryChange("goals", e.target.value)} /></FormGroup>
                <FormGroup check>
                    <Input type="checkbox" checked={formData.summary.followUpRequested} onChange={e => handleSummaryChange("followUpRequested", e.target.checked)} />
                    <Label check>Follow-up Meeting Requested</Label>
                </FormGroup>
                {formData.summary.followUpRequested && (
                    <FormGroup className="mt-2">
                        <Label>Meeting Date</Label>
                        <Input type="date" value={formData.summary.meetingDate} onChange={e => handleSummaryChange("meetingDate", e.target.value)} />
                    </FormGroup>
                )}

                <h5 className="mt-4">Signatures</h5>
                <Row>
                    <Col md={6}><FormGroup><Label>Supervisor</Label><Input value={formData.summary.signatures.supervisor} onChange={e => handleSignatureChange("supervisor", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.summary.signatures.supervisorDate} onChange={e => handleSignatureChange("supervisorDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>Department Manager</Label><Input value={formData.summary.signatures.deptManager} onChange={e => handleSignatureChange("deptManager", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.summary.signatures.deptManagerDate} onChange={e => handleSignatureChange("deptManagerDate", e.target.value)} /></FormGroup></Col>
                </Row>
                <Row>
                    <Col md={6}><FormGroup><Label>HR</Label><Input value={formData.summary.signatures.hr} onChange={e => handleSignatureChange("hr", e.target.value)} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" value={formData.summary.signatures.hrDate} onChange={e => handleSignatureChange("hrDate", e.target.value)} /></FormGroup></Col>
                </Row>

                <Button color="primary" type="submit" className="mt-3">Submit Review</Button>
            </Form>
        </Container>
    );
};

function getQuestionText(key) {
    const questions = {
        q1: "Has the past year been good/bad/satisfactory for you, and why?",
        q2: "What do you consider your most important achievements of the past year?",
        q3: "What aspects of your job do you find most interesting, and least interesting?",
        q4: "What aspects of your job do you think you can improve?",
        q5: "Are there any changes you would like to suggest?",
        q6: "What do you consider your most important activities in the next year?",
        q7: "What action could be taken to improve your performance in your current job by you, and your boss?",
        q8: "What kind of work or job would you like to be doing in one/two/five years’ time?",
        q9: "What sort of training/certifications would benefit you in the next year?",
        comments: "Employee’s Comments"
    };
    return questions[key];
}

function getRatingCriteria() {
    return [
        "Attitude",
        "Efficient use of Technology",
        "Leadership traits",
        "Job Knowledge",
        "Time Management",
        "Communication (written, verbal, grammar)",
        "People Skills",
        "Commitment to SSW",
        "Style fit",
        "Product Knowledge",
        "Technical documentation",
        "Delegation skills",
        "Understanding of finance/manufacturing"
    ];
}

export default ExemptReviewFormFull;
