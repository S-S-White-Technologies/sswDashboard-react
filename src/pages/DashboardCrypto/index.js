import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MyPortfolio from './MyPortfolio';
import api from '../../config/api';
import { Alert, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { setClockInStatus } from '../../slices/crypto/clockSlice';

//Import Icons
import FeatherIcon from "feather-icons-react";

import { otherWidgets2 } from "../../common/data/index";

// Import Images
import illustarator1 from "../../assets/images/user-illustarator-1.png";
import illustarator2 from "../../assets/images/user-illustarator-2.png";
import DigitalClock from '../../Components/DigitalClock';



const DashboardCrypto = () => {
    document.title = "SSW Technologies Dashboard";
    const [modal_togFirst, setmodal_togFirst] = useState(false);
    const [modal_togSecond, setmodal_togSecond] = useState(false);
    const [modal_togClockIn, setmodal_togClockIn] = useState(false);
    const [modal_togClockOut, setmodal_togClockOut] = useState(false);
    const [modal_togOutLunch, setmodal_togOutLunch] = useState(false);
    const [modal_togClockOutLunch, setmodal_togClockOutLunch] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState("tod");
    const [maxTime, setMaxTime] = useState(null);

    function tog_togFirst() {
        setmodal_togFirst(!modal_togFirst);
    }

    function tog_togSecond() {
        setmodal_togSecond(!modal_togSecond);
    }
    function tog_togClockIn() {
        setmodal_togClockIn(!modal_togClockIn);
    }
    function tog_togClockOut() {
        setmodal_togClockOut(!modal_togClockOut);
    }
    function tog_togOutLunch() {
        setmodal_togOutLunch(!modal_togOutLunch);
    }
    function tog_togClockOutLunch() {
        setmodal_togClockOutLunch(!modal_togClockOutLunch)
    }
    const [clockInSuccess, setClockInSuccess] = useState(false);
    const [clockOutSuccess, setClockOutSuccess] = useState(false);
    const [clockOutLunchSuccess, setClockOutLunchSuccess] = useState(false);
    const [status, setStatus] = useState(null);

    const updateStatus = () => {
        const getLastAction = sessionStorage.getItem("getLastAction");
        const getStatus = getLastAction ? JSON.parse(getLastAction)?.status : null;
        setStatus(getStatus); // Update the status in state
        console.log("Updated Status:", getStatus); // Log the updated status
    };

    useEffect(() => {

        updateStatus();


        const intervalId = setInterval(updateStatus, 5000);

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []);
    const handleClockIn = () => {
        if (status === "IN") {
            tog_togFirst();
        } else {
            // If the user is not clocked in, open the second modal to choose Today or Tomorrow
            tog_togClockIn();
        }
    };

    const dispatch = useDispatch();
    const handleConfirmClockIn = async () => {
        // Fetch empId and other logic...
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const clockInResponse = await api.post("WhosInBuilding/clock-in", {
                empId: employeeId,
                myType: 'tod',
            });

            if (clockInResponse.status === 200) {

                const lastActionResponse = await api.get(`WhosInBuilding/last-action/${employeeId}`);
                setClockInSuccess(true);
                // if (lastActionResponse.data) {
                //     dispatch(setClockInStatus({
                //         status: lastActionResponse.data.status,
                //         maxTime: lastActionResponse.data.maxTime.replace("T", " ")
                //     }));
                //     tog_togClockIn();
                // }
                tog_togClockIn();
            }
        } catch (error) {
            console.error("Error during clock-in process:", error);
        }
    };

    const handleConfirmClockOut = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-out", {
                empId: employeeId, // Get empId from sessionStorage or state
            });

            if (response.status === 200) {

                const lastActionResponse = await api.get(`WhosInBuilding/last-action/${employeeId}`);
                setClockOutSuccess(true);
                // if (lastActionResponse.data) {
                //     dispatch(setClockInStatus({
                //         status: lastActionResponse.data.status,
                //         maxTime: lastActionResponse.data.maxTime.replace("T", " ")
                //     }));
                //     tog_togClockIn();
                // }
                tog_togClockOut();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const handleConfirmClockOutLunch = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-out-for-lunch", {
                empId: employeeId,
            });

            if (response.status === 200) {

                const lastActionResponse = await api.get(`WhosInBuilding/last-action/${employeeId}`);
                setClockOutLunchSuccess(true);
                // if (lastActionResponse.data) {
                //     dispatch(setClockInStatus({
                //         status: lastActionResponse.data.status,
                //         maxTime: lastActionResponse.data.maxTime.replace("T", " ")
                //     }));
                //     tog_togClockIn();
                // }
                tog_togClockOutLunch();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };
    const handleClockOut = () => {
        if (status === "OUT") {
            tog_togSecond();
        } else {
            tog_togClockOut();
        }
    };
    const handleClockOutLunch = () => {
        if (status === "OUT") {
            tog_togOutLunch();
        } else {
            tog_togClockOutLunch();
        }
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Time and Attendance" pageTitle="Dashboards" />
                    <Row>
                        <MyPortfolio clockInSuccess={clockInSuccess} clockOutSuccess={clockOutSuccess} clockOutLunchSuccess={clockOutLunchSuccess} />
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
                                                            <Button onClick={handleClockIn} className="btn btn-soft-secondary">
                                                                In for the Day
                                                            </Button>

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3" >
                                                            <Button onClick={handleClockOut} className="btn btn-soft-secondary">Out for the Day</Button>
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
                                                            <Button onClick={handleClockOutLunch} className="btn btn-soft-secondary">Out for the Lunch</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3" >
                                                        {/* <p className="fs-16 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p> */}
                                                        <div className="mt-3">
                                                            <Link to="/pages-pricing" className="btn btn-soft-primary">Back from Lunch</Link>
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
                    <Modal
                        isOpen={modal_togFirst}
                        toggle={tog_togFirst}
                        id="firstmodal"
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title" id="exampleModalToggleLabel">
                                You are already Clocked In
                            </h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/tdrtiskw.json"
                                trigger="loop"
                                colors="primary:#f7b84b,secondary:#405189"
                                style={{ width: "130px", height: "130px" }}
                            />
                            <div className="mt-4 pt-4">
                                <h4>You're already Clocked In!</h4>
                                <p className="text-muted">You have already clocked in for today. Please clock out if you want to clock in again.</p>
                                <Button className="btn btn-warning" onClick={tog_togFirst}>Close</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <Modal
                        isOpen={modal_togSecond}
                        toggle={tog_togSecond}
                        id="secondmodal"
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title" id="exampleModalToggleLabel2">
                                You are already Clocked Out
                            </h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/tdrtiskw.json"
                                trigger="loop"
                                colors="primary:#405189,secondary:#0ab39c"
                                style={{ width: "150px", height: "150px" }}
                            />
                            <div className="mt-4 pt-3">
                                <h4>You're already Clocked Out!</h4>
                                <p className="text-muted">You have already clocked out for today. Please clock in if you want to clock out again.</p>
                                <Button className="btn btn-warning" onClick={tog_togSecond}>Close</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                    <Modal
                        isOpen={modal_togClockIn}
                        toggle={tog_togClockIn}
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock In</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock In for the Day</h4>
                                {/* <p className="text-muted mb-4">Please select the date for your clock-in:</p> */}
                                <br />
                                <DigitalClock />
                                {/* <FormGroup>
                                    <Label for="clockInSelection">Select Date</Label>
                                    <div>
                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInToday"
                                            value="tod"
                                            checked={selectedDateType === "tod"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Today

                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInTomorrow"
                                            value="tom"
                                            checked={selectedDateType === "tom"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Tomorrow
                                    </div>
                                </FormGroup> */}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockIn}>
                                Clock In
                            </Button>

                            <Button color="secondary" onClick={tog_togClockIn}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Modal
                        isOpen={modal_togClockOut}
                        toggle={tog_togClockOut}
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock Out</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock Out for the Day</h4>
                                {/* <p className="text-muted mb-4">Please select the date for your clock-in:</p> */}
                                <br />
                                <DigitalClock />
                                {/* <FormGroup>
                                    <Label for="clockInSelection">Select Date</Label>
                                    <div>
                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInToday"
                                            value="tod"
                                            checked={selectedDateType === "tod"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Today

                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInTomorrow"
                                            value="tom"
                                            checked={selectedDateType === "tom"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Tomorrow
                                    </div>
                                </FormGroup> */}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockOut}>
                                Clock Out
                            </Button>

                            <Button color="secondary" onClick={tog_togClockOut}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>


                    {/* Out for Lunch Modal Warning */}
                    <Modal
                        isOpen={modal_togOutLunch}
                        toggle={tog_togOutLunch}
                        id="lunchModal"
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title" id="exampleModalToggleLabel2">
                                You are Clocked Out
                            </h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/tdrtiskw.json"
                                trigger="loop"
                                colors="primary:#405189,secondary:#0ab39c"
                                style={{ width: "150px", height: "150px" }}
                            />
                            <div className="mt-4 pt-3">
                                <h4>You're already Clocked Out!</h4>
                                <p className="text-muted">You have already clocked out for today. Please clock in if you want to clock out for the Lunch.</p>
                                <Button className="btn btn-warning" onClick={tog_togOutLunch}>Close</Button>
                            </div>
                        </ModalBody>
                    </Modal>

                    {/*Modal Warning End*/}

                    <Modal
                        isOpen={modal_togClockOutLunch}
                        toggle={tog_togClockOutLunch}
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock Out for the Lunch</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock Out for the Lunch</h4>
                                {/* <p className="text-muted mb-4">Please select the date for your clock-in:</p> */}
                                <br />
                                <DigitalClock />
                                {/* <FormGroup>
                                    <Label for="clockInSelection">Select Date</Label>
                                    <div>
                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInToday"
                                            value="tod"
                                            checked={selectedDateType === "tod"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Today

                                        <Input
                                            type="radio"
                                            name="clockInType"
                                            id="clockInTomorrow"
                                            value="tom"
                                            checked={selectedDateType === "tom"}
                                            onChange={(e) => setSelectedDateType(e.target.value)}
                                        /> Tomorrow
                                    </div>
                                </FormGroup> */}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockOutLunch}>
                                Clock Out for Lunch
                            </Button>

                            <Button color="secondary" onClick={tog_togClockOutLunch}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>

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