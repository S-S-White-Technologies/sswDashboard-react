import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, Button, Container, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import api from "../../api";
import SignatureField from './SignatureField';
import { useNavigate } from 'react-router-dom';

const SupervisorReviewModal = ({ reviewId, onSubmitted }) => {
    const [ratings, setRatings] = useState([]);
    const [formData, setFormData] = useState({
        summary: {
            signatures: {
                supervisorDate: "",
                deptManagerDate: "",
                hrDate: "",
                employeeDate: ""
            }
        }
    });

    const ratingCriteria = [
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

    const userId = JSON.parse(sessionStorage.getItem("authUser"))?.uid;

    useEffect(() => {
        if (reviewId) {
            api.get(`ExemptedReview/supervisor/${reviewId}`)
                .then(res => {
                    if (res.data?.ratings?.length) {
                        setRatings(res.data.ratings);
                    } else {
                        setRatings(ratingCriteria.map(title => ({ title, value: "" })));
                    }

                    // Preload signature summary if available
                    if (res.data?.summary?.signatures) {
                        setFormData(prev => ({
                            ...prev,
                            summary: {
                                signatures: {
                                    ...prev.summary.signatures,
                                    ...res.data.summary.signatures
                                }
                            }
                        }));
                    }
                })
                .catch(err => console.error("Rating fetch error:", err));
        }
    }, [reviewId]);

    const handleRatingChange = (index, value) => {
        const updated = [...ratings];
        updated[index].value = value;
        setRatings(updated);
    };
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            await api.post("ExemptedReview/submit-supervisor", {
                reviewId,
                ratings,
                summary: formData.summary,
                signature: {
                    name: formData.summary.signatures.managerName,
                    font: formData.summary.signatures.managerFont,
                    date: formData.summary.signatures.managerDate
                },
                submittedBy: userId
            });

            if (onSubmitted) onSubmitted();
            setmodal_backdrop(true);
        } catch (err) {
            console.error("Supervisor submission failed", err);
        }
    };


    return (
        <Container className="py-5">
            <Card>
                <CardBody>
                    <h2 className="mb-4">Supervisor Ratings</h2>
                    {ratings.map((item, i) => (
                        <FormGroup key={i}>
                            <Label>{i + 1}. {item.title}</Label>
                            <Input
                                type="select"
                                value={item.value}
                                onChange={e => handleRatingChange(i, Number(e.target.value))}
                            >
                                <option value="">Select Rating</option>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    ))}

                    <section className="mb-5">
                        <h5>Signature</h5>
                        <SignatureField
                            role="manager"
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </section>

                    <div className="text-end mt-4">
                        <Button color="primary" onClick={handleSubmit}>
                            Submit Ratings
                        </Button>
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

export default SupervisorReviewModal;
