import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Col, Container, Row, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from "classnames";

import Register from "../../../src/pages/Authentication/Register"
import UserList from "../../../src/pages/HumanResource/UserList"
// Images



import img4 from "../../assets/images/small/img-4.jpg";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";

import img3 from "../../assets/images/small/img-3.jpg";

import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";
import img8 from "../../assets/images/small/img-8.jpg";
import ComingSoon from '../Pages/ComingSoon/ComingSoon';

const HumanResource = () => {
    document.title = "SSW Technologies Dashboard";
    const [customHoverTab, setcustomHoverTab] = useState("1");
    const customHovertoggle = (tab) => {
        if (customHoverTab !== tab) {
            setcustomHoverTab(tab);
        }
    };

    const [verticalTab, setverticalTab] = useState("1");
    const toggleVertical = (tab) => {
        if (verticalTab !== tab) {
            setverticalTab(tab);
        }
    };
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Human Resource" pageTitle="Dashboards" />
                    <Row>
                        <Col xxl={12}>
                            <h5 className="mb-3">HR Operations</h5>
                            <Card>

                                <div className="border">
                                    <Nav pills className="nav nav-pills custom-hover-nav-tabs">
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customHoverTab === "1", })} onClick={() => { customHovertoggle("1"); }} >
                                                <i className="ri-user-fill nav-icon nav-tab-position"></i>
                                                <p className="nav-titl nav-tab-position m-0">Employee</p>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customHoverTab === "2", })} onClick={() => { customHovertoggle("2"); }} >
                                                <i className="ri-file-text-line nav-icon nav-tab-position"></i>
                                                <h5 className="nav-titl nav-tab-position m-0">HR Reports</h5>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customHoverTab === "3", })} onClick={() => { customHovertoggle("3"); }} >
                                                <i className="ri-star-half-line nav-icon nav-tab-position"></i>
                                                <h5 className="nav-titl nav-tab-position m-0">FTO Central</h5>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </div>
                                <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                                    <CardBody style={{ flex: 1, overflow: "auto" }}>
                                        <TabContent activeTab={customHoverTab} className="text-muted">
                                            <TabPane tabId="1" id="custom-hover-customere">
                                                <h6>Employee Management</h6>
                                                <Col xxl={12} style={{ flex: 1, overflow: "auto" }}>
                                                    <Card style={{ height: "100%", display: "flex", boxShadow: 0 }}>
                                                        <CardBody style={{ flex: 1, overflow: "auto" }}>
                                                            <Row style={{ height: "100%" }}>
                                                                <Col md={3} style={{ minHeight: "100%" }}>
                                                                    <Nav pills className="flex-column" id="v-pills-tab" style={{ height: "100%" }}>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{ cursor: "pointer" }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "1",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("1");
                                                                                }}
                                                                                id="v-pills-home-tab"
                                                                            >
                                                                                Add Employee
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{ cursor: "pointer" }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "2",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("2");
                                                                                }}
                                                                                id="v-pills-profile-tab"
                                                                            >
                                                                                Edit Employee
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{ cursor: "pointer" }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "3",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("3");
                                                                                }}
                                                                                id="v-pills-messages-tab"
                                                                            >
                                                                                Add Department
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{ cursor: "pointer" }}
                                                                                className={classnames({
                                                                                    active: verticalTab === "4",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("4");
                                                                                }}
                                                                                id="v-pills-settings-tab"
                                                                            >
                                                                                Add / Edit Roles
                                                                            </NavLink>
                                                                        </NavItem>
                                                                    </Nav>
                                                                </Col>
                                                                <Col md={9} style={{ height: "100%" }}>
                                                                    <TabContent
                                                                        activeTab={verticalTab}
                                                                        className="text-muted mt-4 mt-md-0"
                                                                        id="v-pills-tabContent"
                                                                        style={{ height: "100%" }}
                                                                    >
                                                                        <TabPane tabId="1" id="v-pills-home" style={{ height: "100%" }}>
                                                                            <div className="d-flex mb-2">
                                                                                <Register />
                                                                            </div>
                                                                        </TabPane>
                                                                        <TabPane tabId="2" id="v-pills-profile">
                                                                            <div className="d-flex mb-2">
                                                                                <UserList />
                                                                            </div>

                                                                        </TabPane>
                                                                        <TabPane tabId="3" id="v-pills-messages">
                                                                            <div className="d-flex mb-2">

                                                                            </div>

                                                                        </TabPane>
                                                                        <TabPane tabId="4" id="v-pills-settings">
                                                                            <div className="d-flex mb-2">

                                                                            </div>

                                                                        </TabPane>
                                                                    </TabContent>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </TabPane>

                                            <TabPane tabId="2" id="custom-hover-customere">

                                                <div className="table-responsive">
                                                    <ComingSoon />
                                                </div>
                                            </TabPane>

                                            <TabPane tabId="3" id="custom-hover-reviews">

                                                <div className="table-responsive">
                                                    <ComingSoon />
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );


}

export default HumanResource;