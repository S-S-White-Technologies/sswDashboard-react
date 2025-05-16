import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MyPortfolio from './MyPortfolio';
import { Alert, Card, CardBody } from 'reactstrap';


//Import Icons
import FeatherIcon from "feather-icons-react";

import { otherWidgets2 } from "../../common/data/index";

// Import Images
import illustarator1 from "../../assets/images/user-illustarator-1.png";
import illustarator2 from "../../assets/images/user-illustarator-2.png";


const DashboardCrypto = () => {
    document.title = "SSW Technologies Dashboard";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Time and Attendance" pageTitle="Dashboards" />
                    <Row>
                        <MyPortfolio />
                        <Col className="order-xxl-0 order-first">

                            <Row>
                                <Col xl={4}>
                                    <Card>
                                        <CardBody className="p-0">
                                            <Alert color='secondary' className="border-0 bg-soft-secondary rounded-top rounded-0 m-0 d-flex align-items-center">
                                                <FeatherIcon
                                                    icon="clock"
                                                    className="text-secondary me-2 icon-sm"
                                                />
                                                <div className="flex-grow-1 text-truncate">
                                                    In / Out
                                                </div>
                                            </Alert>

                                            <Row className="align-items-end">
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-success">In for the Day</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Link to="/pages-pricing" className="btn btn-soft-danger">Out for the Day</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>


                                <Col xl={4}>
                                    <Card>
                                        <CardBody className="p-0">
                                            <Alert color='primary' className="border-0 bg-soft-primary rounded-top rounded-0 m-0 d-flex align-items-center">
                                                <FeatherIcon
                                                    icon="coffee"
                                                    className="text-soft-primary me-2 icon-sm"
                                                />

                                                <div className="flex-grow-1 text-truncate">
                                                    Lunch
                                                </div>
                                            </Alert>

                                            <Row className="align-items-end">
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-primary">Out for the Lunch</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3" >
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-secondary">Back from Lunch</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xl={4}>
                                    <Card>
                                        <CardBody className="p-0">
                                            <Alert color='warning' className="border-0 bg-soft-warning rounded-top rounded-0 m-0 d-flex align-items-center">
                                                <FeatherIcon
                                                    icon="briefcase"
                                                    className="text-soft-warning me-2 icon-sm"
                                                />

                                                <div className="flex-grow-1 text-truncate">
                                                    Business
                                                </div>
                                            </Alert>

                                            <Row className="align-items-end">
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-warning">Out for Business</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Link to="/pages-pricing" className="btn btn-soft-warning">Back from Business</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xl={4}>
                                    <Card>
                                        <CardBody className="p-0">
                                            <Alert color='success' className="border-0 bg-soft-success rounded-top rounded-0 m-0 d-flex align-items-center">
                                                <FeatherIcon
                                                    icon="briefcase"
                                                    className="text-soft-success me-2 icon-sm"
                                                />

                                                <div className="flex-grow-1 text-truncate">
                                                    Personal Business
                                                </div>
                                            </Alert>

                                            <Row className="align-items-end">
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-success">Out for Personal Business</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Link to="/pages-pricing" className="btn btn-soft-success">Back from Personal Business</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={8}>
                                    <Card>
                                        <CardBody className="p-0">
                                            <Alert color='danger' className="border-0 bg-soft-danger rounded-top rounded-0 m-0 d-flex align-items-center">
                                                <FeatherIcon
                                                    icon="settings"
                                                    className="text-soft-danger me-2 icon-sm"
                                                />

                                                <div className="flex-grow-1 text-truncate">
                                                    Biomatrics
                                                </div>
                                            </Alert>

                                            <Row className="align-items-end">
                                                <Col sm={4}>
                                                    <div className="p-4">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-danger">My Missing Punches</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="p-4">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Link to="/pages-pricing" className="btn btn-soft-danger">My Time Punch Records</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="p-4">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Link to="/who-in-the-building" className="btn btn-soft-danger">Who's In The Building?</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>


                            </Row>
                            {/* <Row>
                                <Widgets />
                               
                            </Row>
                            <Row>
                                <Widgets />
                               
                            </Row>
                            <Row>
                                <Widgets />
                               
                            </Row> */}
                        </Col>
                    </Row>
                    {/* <Row>
                        <Widgets1 />
                    </Row>
                    <Row>
                        <MyCurrencies />
                        <Trading />
                    </Row>
                    <Row>
                        <RecentActivity />
                        <TopPerformers />
                        <NewsFeed />
                    </Row> */}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrypto;