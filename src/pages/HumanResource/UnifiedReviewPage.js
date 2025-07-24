// UnifiedReviewPage.jsx
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EmployeeReviewPanel from "./EmployeeReviewPanel";
import SupervisorReviewModal from "./SupervisorReviewModal";
import HRReviewModal from "./HRReviewModal";
import { Card, CardBody, Row, Col } from 'reactstrap';

const steps = ["Employee", "Manager", "HR"];

const UnifiedReviewPage = () => {
    const { reviewId } = useParams(); // From /review/exempted/:reviewId
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get("role")?.toLowerCase(); // "employee" | "manager" | "hr"

    const roleMap = {
        employee: "Employee",
        manager: "Manager",
        hr: "HR Admin"
    };

    const currentUserRole = roleMap[roleParam];
    const currentStepIndex = steps.findIndex(step => step === currentUserRole);
    console.log("Current Role :", currentUserRole);
    const renderPanel = () => {
        if (!reviewId || !currentUserRole) return <div className="text-red-500">Access Denied</div>;

        switch (currentUserRole) {
            case "Employee":
                return <EmployeeReviewPanel reviewId={reviewId} />;
            case "Manager":
                return <SupervisorReviewModal reviewId={reviewId} />;
            case "HR Admin":
                return <HRReviewModal reviewId={reviewId} />;
            default:
                return <div className="text-red-500">Access Denied</div>;
        }
    };

    return (
        <Card>
            <CardBody className="p-4">
                <Row>
                    <Col>
                        <br />
                    </Col>
                </Row>
                <div className="p-2 max-w-2xl mx-auto ">
                    <div className="flex items-center justify-center mb-8">
                        <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-1" />

                    </div>

                    <div className="d-flex align-items-center justify-content-center my-4">
                        {steps.map((label, index) => (
                            <React.Fragment key={label}>
                                <div className="text-center">
                                    <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center mx-2 ${index <= currentStepIndex ? 'bg-primary text-white' : 'bg-light text-muted'
                                            }`}
                                        style={{ width: 32, height: 32 }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="small">{label}</div>
                                </div>
                                {index < steps.length - 1 && <div className="flex-grow-1 border-top mx-2" />}
                            </React.Fragment>
                        ))}
                    </div>


                    {renderPanel()}
                </div>
            </CardBody>
        </Card>
    );
};

export default UnifiedReviewPage;
