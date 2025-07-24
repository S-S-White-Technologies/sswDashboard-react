//profile
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Col, Container, Row, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from "classnames";
import ManageDepartments from "./ManageDepartments"; // Adjust the path if needed
import ManageRoles from "./ManageRoles";
import ExemptedReview from './ExemptedReview';
import { ToastContainer } from 'react-toastify';
import Register from "../../../src/pages/Authentication/Register"
import UserList from "../../../src/pages/HumanResource/UserList"
import MissingPunches from "../../../src/pages/HumanResource/MissingPunches"

// web forms

import ExemptReviewFormFull from './ExemptReviewFormFull';
import NinetyDayReviewForm from './NinetyDaysForm';
import PersonalInfoChange from './PersonalInfoChange';
import TimelineTabs from './TimelineTabs';
import HRReportsTimelineTabs from './HRReportsTimelineTabs';
import MissingPunchesTabs from './MissingPunchesTabs';
import WebFormsTimelineTabs from './WebFormsTimelineTabs'
// HR Reports

import HRReportsSalary from "../../pages/HumanResource/HrReportsSalaried"
import HRReportsHourly from "../../pages/HumanResource/HrReportsHourly"

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

    const [topBorderTab, settopBorderTab] = useState("1");
    const topBordertoggle = (tab) => {
        if (topBorderTab !== tab) {
            settopBorderTab(tab);
        }
    };

    const [topBorderjustifyTab, settopBorderjustifyTab] = useState("1");
    const topBorderJustifytoggle = (tab) => {
        if (topBorderjustifyTab !== tab) {
            settopBorderjustifyTab(tab);
        }
    };


    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
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
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Human Resource" pageTitle="Dashboards" />
                    <Row>
                        <Col xxl={12}>
                            <h5 className="mb-3">HR Operations</h5>
                            <Card>
                                <CardBody>

                                    <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "1",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("1");
                                                }}
                                            >
                                                Employee Management
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "2",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("2");
                                                }}
                                            >
                                                HR Reports
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "3",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("3");
                                                }}
                                            >
                                                FTO Central
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "4",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("4");
                                                }}
                                            >
                                                Biomatrics
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "5",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("5");
                                                }}
                                            >
                                                Web Forms
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="text-muted"
                                    >
                                        <TabPane tabId="1" id="home1">

                                            <Row>
                                                <Col xxl={12}>
                                                    {/* 
                                                    <Card>
                                                        <CardBody>


                                                            <Nav tabs className="nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-3">
                                                                <NavItem>
                                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: topBorderTab === "1", })} onClick={() => { topBordertoggle("1"); }} >
                                                                        <i className="ri-home-5-line align-middle me-1"></i> Add Employee
                                                                    </NavLink>
                                                                </NavItem>
                                                                <NavItem>
                                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: topBorderTab === "2", })} onClick={() => { topBordertoggle("2"); }} >
                                                                        <i className="ri-user-line me-1 align-middle"></i> Manage Employee
                                                                    </NavLink>
                                                                </NavItem>
                                                                <NavItem>
                                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: topBorderTab === "3", })} onClick={() => { topBordertoggle("3"); }} >
                                                                        <i className="ri-bank-line align-middle me-1"></i>Manage Departments
                                                                    </NavLink>
                                                                </NavItem>
                                                                <NavItem>
                                                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: topBorderTab === "4", })} onClick={() => { topBordertoggle("4"); }} >
                                                                        <i className="ri-fingerprint-2-fill align-middle me-1"></i>Manage Roles
                                                                    </NavLink>
                                                                </NavItem>
                                                            </Nav>

                                                            <TabContent activeTab={topBorderTab} className="text-muted">
                                                                <TabPane tabId="1" id="nav-border-justified-home">
                                                                    <Register />
                                                                </TabPane>

                                                                <TabPane tabId="2" id="nav-border-justified-profile">
                                                                    <UserList />
                                                                </TabPane>

                                                                <TabPane tabId="3" id="nav-border-justified-manage-departments">
                                                                    <ManageDepartments />
                                                                </TabPane>

                                                                <TabPane tabId="4" id="nav-border-justified-messages">
                                                                    <ManageRoles />
                                                                </TabPane>
                                                            </TabContent>
                                                        </CardBody>
                                                    </Card> */}

                                                    {/* <Card>
                                                        <CardBody>

                                                            <Row>
                                                                <Col md={3} style={{ width: "15%" }}>
                                                                    <Nav pills className="flex-column" id="v-pills-tab">
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    backgroundColor: verticalTab === "1" ? "#36c381" : "transparent",  // Bootstrap's green
                                                                                    color: verticalTab === "1" ? "#fff" : "#000",
                                                                                }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "1",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("1");
                                                                                }}
                                                                                id="v-pills-home-tab"
                                                                            >
                                                                                <i className="ri-home-5-line align-middle me-1"></i> Add Employee
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    backgroundColor: verticalTab === "2" ? "#36c381" : "transparent",  // Bootstrap's green
                                                                                    color: verticalTab === "2" ? "#fff" : "#000",
                                                                                }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "2",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("2");
                                                                                }}
                                                                                id="v-pills-profile-tab"
                                                                            >
                                                                                <i className="ri-user-line me-1 align-middle"></i> Manage Employee
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    backgroundColor: verticalTab === "3" ? "#36c381" : "transparent",  // Bootstrap's green
                                                                                    color: verticalTab === "3" ? "#fff" : "#000",
                                                                                }}
                                                                                className={classnames({
                                                                                    "mb-2": true,
                                                                                    active: verticalTab === "3",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("3");
                                                                                }}
                                                                                id="v-pills-messages-tab"
                                                                            >
                                                                                <i className="ri-bank-line align-middle me-1"></i>Manage Departments
                                                                            </NavLink>
                                                                        </NavItem>
                                                                        <NavItem>
                                                                            <NavLink
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    backgroundColor: verticalTab === "4" ? "#36c381" : "transparent",  // Bootstrap's green
                                                                                    color: verticalTab === "4" ? "#fff" : "#000",
                                                                                }}
                                                                                className={classnames({
                                                                                    active: verticalTab === "4",
                                                                                })}
                                                                                onClick={() => {
                                                                                    toggleVertical("4");
                                                                                }}
                                                                                id="v-pills-settings-tab"
                                                                            >
                                                                                <i className="ri-fingerprint-2-fill align-middle me-1"></i>Manage Roles
                                                                            </NavLink>
                                                                        </NavItem>
                                                                    </Nav>
                                                                </Col>
                                                                <Col md={9}>
                                                                    <TabContent activeTab={topBorderTab} className="text-muted">
                                                                        <TabPane tabId="1" id="nav-border-justified-home">
                                                                            <Register />
                                                                        </TabPane>

                                                                        <TabPane tabId="2" id="nav-border-justified-profile">
                                                                            <UserList />
                                                                        </TabPane>

                                                                        <TabPane tabId="3" id="nav-border-justified-manage-departments">
                                                                            <ManageDepartments />
                                                                        </TabPane>

                                                                        <TabPane tabId="4" id="nav-border-justified-messages">
                                                                            <ManageRoles />
                                                                        </TabPane>
                                                                    </TabContent>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card> */}

                                                    <TimelineTabs />

                                                </Col>
                                            </Row>

                                        </TabPane>
                                        <TabPane tabId="2">

                                            <TabPane tabId="2" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <HRReportsTimelineTabs />
                                                    </Col>
                                                </Row>

                                            </TabPane>

                                        </TabPane>
                                        <TabPane tabId="3">



                                        </TabPane>
                                        <TabPane tabId="4">

                                            <TabPane tabId="4" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <MissingPunchesTabs />
                                                    </Col>
                                                </Row>

                                            </TabPane>

                                        </TabPane>
                                        <TabPane tabId="5">

                                            <TabPane tabId="5" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <WebFormsTimelineTabs />
                                                    </Col>
                                                </Row>

                                            </TabPane>

                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );


}

export default HumanResource;