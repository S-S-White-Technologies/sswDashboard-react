import React, { useEffect, useState, useRef } from 'react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, FormGroup, Label, Input, Row, Col,
    CardBody, Card, Container
} from 'reactstrap';
import SignaturePad from 'react-signature-canvas';
import axios from "axios";
import api from '../../api'; // assume Axios wrapper
import trimCanvas from 'trim-canvas';
import SignatureField from './SignatureField';
import { useNavigate } from 'react-router-dom';
const questions = [
    "Has the past year been good/bad/satisfactory for you, and why?",
    "What do you consider your most important achievements of the past year?",
    "What aspects of your job do you find most interesting, and least interesting?",
    "What aspects of your job do you think you can improve?",
    "Are there any changes you would like to suggest?",
    "What do you consider your most important activities in the next year?",
    "What action could be taken to improve your performance in your current job by you, and your boss?",
    "What kind of work or job would you like to be doing in one/two/five years' time?",
    "What sort of training/certifications would benefit you in the next year?",
    "Employee's Comments"
];

const HRReviewModal = ({ isOpen, toggle, reviewId }) => {


    const [formData, setFormData] = useState({
        employeeAnswers: {},
        supervisorRatings: [],
        summary: {
            strengths: '',
            improvements: '',
            recommendations: '',
            goals: '',
            followUpRequested: false,
            meetingDate: '',
            signatures: {
                employeeName: '',
                employeeFont: '',
                employeeDate: '',
                managerName: '',
                managerFont: '',
                managerDate: '',
                hrName: '',
                hrFont: '',
                hrDate: ''
            }
        }
    });




    useEffect(() => {
        if (reviewId) {
            api.get(`ExemptedReview/full/${reviewId}`).then(res => {
                console.log("Full res: ", res.data);

                const currentHRName = JSON.parse(sessionStorage.getItem('authUser'))?.name // or props if passed
                const today = new Date().toISOString().split('T')[0];

                setFormData({
                    employeeAnswers: res.data.employeeAnswers,
                    supervisorRatings: res.data.supervisorRatings,
                    summary: {
                        ...res.data.summary,
                        signatures: {
                            employeeName: res.data.employeeSignature?.name || '',
                            employeeFont: res.data.employeeSignature?.font || '',
                            employeeDate: res.data.employeeSignature?.date || '',
                            managerName: res.data.supervisorSignature?.name || '',
                            managerFont: res.data.supervisorSignature?.font || '',
                            managerDate: res.data.supervisorSignature?.date || '',
                            hrName: currentHRName,
                            hrFont: 'Pacifico',
                            hrDate: today
                        }
                    }
                });
            });
        }
    }, [isOpen, reviewId]);


    const handleSummaryChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            summary: {
                ...prev.summary,
                [field]: value
            }
        }));
    };

    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);
    const navigate = useNavigate();
    const toISOStringIfDate = (val) => {
        if (!val) return null;
        return new Date(val).toISOString();
    };

    const handleFinalize = async () => {
        const { managerName, managerDate, hrName, hrDate, hrFont } = formData.summary.signatures;

        const payload = {
            reviewId,
            summary: {
                strengths: formData.summary.strengths,
                improvements: formData.summary.improvements,
                recommendations: formData.summary.recommendations,
                goals: formData.summary.goals,
                followUpRequested: formData.summary.followUpRequested,
                meetingDate: toISOStringIfDate(formData.summary.meetingDate),
                signatures: {
                    supervisor: managerName || "",
                    supervisorDate: toISOStringIfDate(managerDate),
                    deptManager: "",
                    deptManagerDate: null,
                    hr: hrName || "",
                    hrDate: toISOStringIfDate(hrDate)
                },
                Signature: {
                    Name: hrName || "Angela Vo",
                    Font: hrFont || "Satisfy", // default if none selected
                    Date: toISOStringIfDate(hrDate)
                }
            }
        };

        try {
            console.log("Submitting payload:", payload);
            await api.post("exemptedreview/submit-hr", payload);
            setmodal_backdrop(true);
        } catch (error) {
            console.error("Error submitting HR review:", error.response?.data || error);
        }
    };





    return (
        <Container className="py-5">
            <Card>
                <CardBody>
                    <div className="container py-4">
                        <h2 className="mb-4">HR Review & Finalization</h2>

                        <section className="mb-5">
                            <h5>Employee Answers</h5>
                            {questions.map((q, i) => (
                                <p key={i}><strong>{i + 1}. {q}</strong>: {formData.employeeAnswers[`q${i + 1}`] || ''}</p>
                            ))}
                            <p><strong>10. Employee's Comments:</strong> {formData.employeeAnswers.comments || ''}</p>
                        </section>

                        <section className="mb-5">
                            <h5>Supervisor Ratings</h5>
                            {formData.supervisorRatings.map((r, i) => (
                                <p key={i}><strong>{i + 1}. {r.title}:</strong> {r.value}</p>
                            ))}
                        </section>

                        <section className="mb-5">
                            <h5>Summary</h5>
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
                        </section>

                        <section className="mb-5">
                            <h5>Signatures</h5>
                            {['employee', 'manager', 'hr'].map(role => (
                                <SignatureField
                                    key={role}
                                    role={role}
                                    formData={formData}
                                    setFormData={setFormData}
                                    readOnlyFont={role !== 'hr'}
                                    readOnlyDate={role !== 'hr'}
                                />
                            ))}

                        </section>

                        <div className="text-end">
                            <Button color="success" onClick={handleFinalize}>Finalize Review</Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Modal
                isOpen={modal_backdrop}
                toggle={tog_backdrop}
                backdrop="static"
                id="staticBackdrop"
                centered
            >
                <ModalHeader>
                    <h5 className="modal-title" id="staticBackdropLabel">Success</h5>
                </ModalHeader>
                <ModalBody className="text-center p-5">
                    <lord-icon
                        src="https://cdn.lordicon.com/lupuorrc.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "120px", height: "120px" }}>
                    </lord-icon>

                    <div className="mt-4">
                        <h4 className="mb-3">Review Registered!</h4>
                        <p className="text-muted mb-4">You have successfully submit your review. 🎉</p>
                        <div className="hstack gap-2 justify-content-center">
                            <Button color="light" onClick={() => navigate("/")}>Close</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </Container>
    );

};

export default HRReviewModal;
