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
                                                Settings
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

                                                                <TabPane tabId="3" id="nav-border-justified-messages">
                                                                    <h6>Message</h6>
                                                                    <p className="mb-0">
                                                                        Consistency is the one thing that can take all of the different elements in your design, and tie them all together and make them work. In an awareness campaign, it is vital for people to begin put 2 and 2 together and begin to recognize your cause. Consistency piques people’s interest is that it has become more and more popular over the years, which is excellent news to the beginner and advanced <Link to="#" className="text-decoration-underline"><b>Contact Designer</b></Link>.
                                                                    </p>
                                                                </TabPane>
                                                                <TabPane tabId="4" id="nav-border-justified-messages">
                                                                    <h6>Message</h6>
                                                                    <p className="mb-0">
                                                                        Consistency is the one thing that can take all of the different elements in your design, and tie them all together and make them work. In an awareness campaign, it is vital for people to begin put 2 and 2 together and begin to recognize your cause. Consistency piques people’s interest is that it has become more and more popular over the years, which is excellent news to the beginner and advanced <Link to="#" className="text-decoration-underline"><b>Contact Designer</b></Link>.
                                                                    </p>
                                                                </TabPane>
                                                            </TabContent>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </TabPane>
                                        <TabPane tabId="2">

                                            <div className="d-flex">

                                            </div>

                                        </TabPane>
                                        <TabPane tabId="3">

                                            <div className="d-flex">

                                            </div>

                                        </TabPane>
                                        <TabPane tabId="4">

                                            <div className="d-flex">

                                            </div>

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