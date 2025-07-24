import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, Row, Col } from "reactstrap";
import classnames from "classnames";
import Register from "../Authentication/Register";
import UserList from "./UserList";
import ManageDepartments from "./ManageDepartments";
import ManageRoles from "./ManageRoles";

const TimelineTabs = () => {
    const [activeTab, setActiveTab] = useState("1");

    const tabs = [
        { id: "1", label: "Add Employee", icon: "ri-user-add-line", content: <Register /> },
        { id: "2", label: "Manage Employee", icon: "ri-user-settings-line", content: <UserList /> },
        { id: "3", label: "Manage Departments", icon: "ri-building-4-line", content: <ManageDepartments /> },
        { id: "4", label: "Manage Roles", icon: "ri-shield-user-line", content: <ManageRoles /> },
    ];

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
        <Card className="shadow-sm">
            <CardBody>
                <Row>
                    <Col md={3} style={{ position: "relative" }}>
                        <div className="timeline-nav position-relative border-start border-2 ps-4">
                            <Nav pills className="flex-column gap-3">
                                {tabs.map((tab, idx) => (
                                    <NavItem key={tab.id} className="position-relative">
                                        <NavLink
                                            onClick={() => toggleTab(tab.id)}
                                            className={classnames("px-3 py-2 rounded", {
                                                active: activeTab === tab.id,
                                            })}
                                            style={{
                                                backgroundColor: activeTab === tab.id ? "#36c381" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#495057",
                                                fontWeight: activeTab === tab.id ? "600" : "400",
                                                position: "relative",
                                                zIndex: 1,
                                            }}
                                        >
                                            <span className="me-2">{tab.icon && <i className={tab.icon}></i>}</span>
                                            {tab.label}
                                        </NavLink>

                                        {/* Timeline Dot */}
                                        <span
                                            className="position-absolute top-50 start-0 translate-middle rounded-circle"
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                                backgroundColor: activeTab === tab.id ? "#36c381" : "#dee2e6",
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
                                    {tab.content}
                                </TabPane>
                            ))}
                        </TabContent>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default TimelineTabs;
