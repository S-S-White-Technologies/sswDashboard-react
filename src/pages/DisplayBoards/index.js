import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import api from '../../api';
import { Alert, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Toast, ToastBody, Nav, NavItem, NavLink, Table, TabContent, TabPane, Spinner } from 'reactstrap';
import FeatherIcon from "feather-icons-react";
import DigitalClock from '../../Components/DigitalClock';
import avatar3 from "../../../src/assets/images/logofinal.png";
import WhoisInBuilding from '../../pages/Jobs/CandidateList/GridView/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComingSoon from '../Pages/ComingSoon/ComingSoon';
import classnames from "classnames";
const DisplayBoards = () => {
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
                                                CNC
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
                                                Shukla
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
                                                Winding
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
                                                Production - Flex
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
                                                Quality
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

                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </TabPane>
                                        <TabPane tabId="2">

                                            <TabPane tabId="2" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <Card>
                                                            <CardBody>

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                            </TabPane>

                                        </TabPane>
                                        <TabPane tabId="3">

                                            <Row>
                                                <Col xxl={12}>

                                                    <Card>
                                                        <CardBody>

                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </TabPane>
                                        <TabPane tabId="4">

                                            <TabPane tabId="4" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <Card>
                                                            <CardBody>

                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                            </TabPane>

                                        </TabPane>
                                        <TabPane tabId="5">

                                            <TabPane tabId="5" id="home1">

                                                <Row>
                                                    <Col xxl={12}>

                                                        <Card>
                                                            <CardBody>

                                                            </CardBody>
                                                        </Card>
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

export default DisplayBoards;