import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, Button, Container, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import api from '../../api';
import SignatureField from './SignatureField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const getQuestionText = (key) => {

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
};

const EmployeeReviewPanel = ({ reviewId }) => {
    const [formData, setFormData] = useState({
        employeeAnswers: {},
        summary: {
            signatures: {
                employeeDate: "",
                supervisorDate: "",
                deptManagerDate: "",
                hrDate: ""
            }
        }
    });
    const userId = JSON.parse(sessionStorage.getItem("authUser"))?.uid;
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);
    useEffect(() => {
        if (reviewId) {
            api.get(`ExemptedReview/${reviewId}`)
                .then(res => {
                    const questions = res.data.questions || {};
                    const fullForm = {
                        q1: "", q2: "", q3: "", q4: "", q5: "",
                        q6: "", q7: "", q8: "", q9: "", comments: "",
                        ...questions
                    };
                    setFormData(prev => ({
                        ...prev,
                        employeeAnswers: fullForm
                    }));
                });
        }
    }, [reviewId]);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            const payload = {
                reviewId,
                questions: formData.employeeAnswers,
                summary: formData.summary,
                submittedBy: userId,
                signature: {
                    name: formData.summary.signatures?.employeeName,
                    font: formData.summary.signatures?.employeeFont,
                    date: formData.summary.signatures?.employeeDate
                }
            };
            await api.post("ExemptedReview/submit-employee", {
                reviewId,
                questions: formData.employeeAnswers,
                signature: {
                    name: formData.summary.signatures.employeeName,
                    font: formData.summary.signatures.employeeFont,
                    date: formData.summary.signatures.employeeDate
                },
                submittedBy: userId
            });
            setmodal_backdrop(true);
        } catch (err) {
            console.error("Submission failed", err);
        }
    };


    return (
        <Container className="py-5">
            <Card>
                <CardBody>


                    <h2 className="mb-4">Employee Review</h2>
                    {Object.entries(formData.employeeAnswers)?.map(([key, val], i) => (
                        <FormGroup key={key}>
                            <Label>{i + 1}. {getQuestionText(key)}</Label>
                            <Input
                                type="textarea"
                                rows={3}
                                value={val}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        employeeAnswers: {
                                            ...prev.employeeAnswers,
                                            [key]: e.target.value
                                        }
                                    }))
                                }
                            />
                        </FormGroup>
                    ))}

                    <section className="mb-5">
                        <h5>Signature</h5>
                        <SignatureField
                            role="employee"
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </section>

                    <div className="text-end mt-4">
                        <Button color="primary" onClick={handleSubmit}>Submit</Button>
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

export default EmployeeReviewPanel;
