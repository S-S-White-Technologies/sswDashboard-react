import React, { useState } from "react";
import {
    Card,
    CardBody,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames";
import ExemptedReview from './ExemptedReview';
import ExemptReviewFormFull from "./ExemptReviewFormFull";
import NinetyDayReviewForm from "./NinetyDaysForm";
import PersonalInfoChange from "./PersonalInfoChange";

const WebFormsTimelineTabs = () => {
    const [activeTab, setActiveTab] = useState("1");

    const tabs = [
        {
            id: "1",
            label: "HR021-Exempt Review Form",
            icon: "ri-todo-fill",
            component: <ExemptedReview />,
        },
        {
            id: "2",
            label: "90-Day Review Form",
            icon: "ri-todo-fill",
            component: <NinetyDayReviewForm />,
        },
        {
            id: "3",
            label: "HR020-PIC Form",
            icon: "ri-todo-fill",
            component: <PersonalInfoChange />,
        },
    ];

    return (
        <Card className="shadow-sm">
            <CardBody>
                <Row>
                    <Col md={3} style={{ position: "relative" }}>
                        <div className="timeline-nav position-relative border-start border-2 ps-4">
                            <Nav pills className="flex-column gap-3">
                                {tabs.map((tab) => (
                                    <NavItem key={tab.id} className="position-relative">
                                        <NavLink
                                            onClick={() => setActiveTab(tab.id)}
                                            className={classnames("px-3 py-2 rounded", {
                                                active: activeTab === tab.id,
                                            })}
                                            style={{
                                                backgroundColor:
                                                    activeTab === tab.id ? "#36c381" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#495057",
                                                fontWeight: activeTab === tab.id ? "600" : "400",
                                                position: "relative",
                                                zIndex: 1,
                                            }}
                                        >
                                            <span className="me-2">
                                                <i className={`${tab.icon} align-middle me-1`}></i>
                                            </span>
                                            {tab.label}
                                        </NavLink>

                                        {/* Dot Indicator */}
                                        <span
                                            className="position-absolute top-50 start-0 translate-middle rounded-circle"
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                                backgroundColor:
                                                    activeTab === tab.id ? "#36c381" : "#dee2e6",
                                                border: "2px solid white",
                                                boxShadow: "0 0 0 2px #adb5bd",
                                                zIndex: 2,
                                            }}
                                        ></span>
                                    </NavItem>
                                ))}
                            </Nav>
                        </div>
                    </Col>

                    <Col md={9}>
                        <TabContent activeTab={activeTab} className="text-muted">
                            {tabs.map((tab) => (
                                <TabPane tabId={tab.id} key={tab.id}>
                                    {tab.component}
                                </TabPane>
                            ))}
                        </TabContent>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default WebFormsTimelineTabs;
