import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import api from '../../config/api';
import { Alert, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Toast, ToastBody, Table, Spinner } from 'reactstrap';
import FeatherIcon from "feather-icons-react";
import DigitalClock from '../../Components/DigitalClock';
import avatar3 from "../../../src/assets/images/logofinal.png";
import WhoisInBuilding from '../../pages/Jobs/CandidateList/GridView/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComingSoon from '../Pages/ComingSoon/ComingSoon';
import MyPortfolio from './MyPortfolio';

const Timer = ({ clockInTime }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {

        if (clockInTime) {
            const startTime = new Date(clockInTime);
            const intervalId = setInterval(() => {
                const currentTime = new Date();
                const diff = currentTime - startTime; // Difference in milliseconds
                setElapsedTime(diff);
            }, 1000); // Update every second

            return () => clearInterval(intervalId); // Clean up the interval on component unmount
        }
    }, [clockInTime]);

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}:${minutes % 60}:${seconds % 60}`;
    };

    return (
        <div className="text-center">
            <h5>Working Hours</h5>
            <p>{formatTime(elapsedTime)}</p>
        </div>
    );
};

// const Timer1 = ({ clockInTime, clockOutTime }) => {
//     const [totalTime, setTotalTime] = useState(0); 

//     useEffect(() => {
//         if (clockInTime && clockOutTime) {
//             const clockInDate = new Date(clockInTime);
//             const clockOutDate = new Date(clockOutTime);
//             const timeDifference = (clockOutDate - clockInDate) / 1000; 
//             setTotalTime(timeDifference);
//         }
//     }, [clockInTime, clockOutTime]);

//     const hours = Math.floor(totalTime / 3600);
//     const minutes = Math.floor((totalTime % 3600) / 60);
//     const seconds = totalTime % 60;

//     return (
//         <div className="text-center">
//             <h5>Total Working Hours</h5>
//             <p>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
//                 {String(seconds)}</p>
//         </div>
//     );
// };

const DashboardCrypto = () => {
    document.title = "SSW Technologies Dashboard";
    const [modal_togFirst, setmodal_togFirst] = useState('');
    const [modal_togSecond, setmodal_togSecond] = useState('');
    const [modal_togClockIn, setmodal_togClockIn] = useState('');
    const [modal_togClockOut, setmodal_togClockOut] = useState('');
    const [modal_togOutLunch, setmodal_togOutLunch] = useState('');
    const [modal_togInLunch, setmodal_togInLunch] = useState('');
    const [modal_togClockOutLunch, setmodal_togClockOutLunch] = useState('');
    const [modal_togClockOutBusiness, setmodal_togClockOutBusiness] = useState('');
    const [modal_togMissingPunches, setmodal_togMissingPunches] = useState('');
    const [modal_togClockOutPersonal, setmodal_togClockOutPersonal] = useState('');
    const [modal_togClockInLunch, setmodal_togClockInLunch] = useState('');
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);

    const [modal_backdropRecords, setmodal_backdropRecords] = useState(false);
    const tog_backdropRecords = () => setmodal_backdropRecords(!modal_backdropRecords);

    const [modal_togClockInBusiness, setmodal_togClockInBusiness] = useState('');
    const [modal_togClockInPersonal, setmodal_togClockInPersonal] = useState('');
    const [modal_togViewAttendace, setmodal_togViewAttendace] = useState('');
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);
    const [workingTime, setWorkingTime] = useState(null);
    const [toast10, setToast10] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [modal_xlarge, setmodal_xlarge] = useState(false);
    function tog_xlarge() {
        setmodal_xlarge(!modal_xlarge);
    }
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
    function tog_togInLunch() {
        setmodal_togInLunch(!modal_togInLunch);
    }
    function tog_togClockOutLunch() {
        setmodal_togClockOutLunch(!modal_togClockOutLunch)
    }
    function tog_togClockOutBusiness() {
        setmodal_togClockOutBusiness(!modal_togClockOutBusiness)
    }
    function tog_togClockOutPersonal() {
        setmodal_togClockOutPersonal(!modal_togClockOutPersonal)
    }
    function tog_togClockInLunch() {
        setmodal_togClockInLunch(!modal_togClockInLunch)
    }
    function tog_togClockInBusiness() {
        setmodal_togClockInBusiness(!modal_togClockInBusiness)
    }
    function tog_togClockInPersonal() {
        setmodal_togClockInPersonal(!modal_togClockInPersonal)
    }
    function tog_togMissingPunches() {
        setmodal_togMissingPunches(!modal_togMissingPunches)
    }

    function tog_togViewAttendace() {
        setmodal_togViewAttendace(!modal_togViewAttendace)
    }
    const [clockInSuccess, setClockInSuccess] = useState(false);
    const [clockOutSuccess, setClockOutSuccess] = useState(false);

    const [status, setStatus] = useState('');
    const [maxTime, setMaxTime] = useState('');

    const [statusBreak, setStatusBreak] = useState('');
    const [maxTimeBreak, setMaxTimeBreak] = useState('');

    const [statusBusiness, setStatusBusiness] = useState('');
    const [maxTimeBusiness, setMaxTimeBusiness] = useState('');

    const [statusPersonal, setStatusPersonal] = useState('');
    const [maxTimePersonal, setMaxTimePersonal] = useState('');

    const handleClockIn = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        try {
            const response = await api.get(`WhosInBuilding/last-action/${employeeId}`, {
                params: { empId: employeeId },
            });
            console.log("New Employee status :", response.data.status);
            if (response.data.status === null) {
                tog_togClockIn();
            }
            if (response.data.status == 'IN') {
                tog_togFirst();
            }
            else {
                tog_togClockIn();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };


    useEffect(() => {

        const savedClockInTime = sessionStorage.getItem("clockInTime");
        if (savedClockInTime) {
            setClockInTime(savedClockInTime);
        }
    }, []);
    const handleConfirmClockIn = async () => {

        const newClockInTime = new Date().toISOString();
        setClockInTime(newClockInTime);
        sessionStorage.setItem("clockInTime", newClockInTime);

        // Fetch empId and other logic...
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;


        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const clockInResponse = await api.post("WhosInBuilding/clock-in", {
                empId: employeeId,
                myType: 'tod',
            });

            if (clockInResponse.status === 200 || clockInResponse.status === 201) {
                setClockInSuccess(true);
                fetchLastAction(employeeId);

                console.log("Emp ID in Clock In :", employeeId);

                tog_togClockIn();
            }
        } catch (error) {
            console.error("Error during clock-in process:", error);
        }
    };
    const handleConfirmClockOut = async () => {

        setClockInTime(null);
        sessionStorage.removeItem("clockInTime")
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-out", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {
                console.log("Tringer Clock In :", clockInSuccess);
                setClockOutSuccess(true);
                fetchLastAction(employeeId);
                tog_togClockOut();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };
    const handleClockOut = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;
        try {
            const response = await api.get(`WhosInBuilding/last-action/${employeeId}`, {

            });

            if (response.data.status == 'OUT') {
                tog_togSecond();
            }
            else {
                tog_togClockOut();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };
    const handleClockOutLunch = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;
        try {
            const response = await api.get(`WhosInBuilding/last-action/${employeeId}`, {

            });
            console.log("Response last Break", response.data);
            if (response.data.status === 'OUT') {
                tog_togSecond();
            }
            else {
                tog_togClockOutLunch();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };
    const handleClockOutBusiness = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;
        try {
            const response = await api.get(`WhosInBuilding/last-action/${employeeId}`, {

            });
            console.log("Response last Break", response.data);
            if (response.data.status === 'OUT') {
                tog_togSecond();
            }
            else {
                tog_togClockOutBusiness();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };

    const handleClockOutPersonal = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;
        try {
            const response = await api.get(`WhosInBuilding/last-action/${employeeId}`, {

            });
            console.log("Response last Break", response.data);
            if (response.data.status === 'OUT') {
                tog_togSecond();
            }
            else {
                tog_togClockOutPersonal();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };

    const handleClockInBusiness = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        try {
            const response = await api.get(`WhosInBuilding/last-action-business/${employeeId}`, {
                params: { empId: employeeId },
            });

            if (response.data.status == 'IN') {
                tog_togFirst();
            }
            else {
                tog_togClockInBusiness();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };

    const handleClockInPersonal = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        try {
            const response = await api.get(`WhosInBuilding/last-action-personal/${employeeId}`, {
                params: { empId: employeeId },
            });

            if (response.data.status == 'IN') {
                tog_togFirst();
            }
            else {
                tog_togClockInPersonal();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };

    const handleConfirmClockOutBusiness = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-out-for-business", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {

                fetchLastActionBusiness(employeeId);
                tog_togClockOutBusiness();

                console.log("Business Max Time and Status : ", statusBusiness);

            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const handleConfirmClockOutPersonal = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-out-for-personal", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {

                fetchLastActionPersonal(employeeId);
                tog_togClockOutPersonal();

                console.log("Business Max Time and Status : ", statusBusiness);

            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const handleClockInLunch = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        try {
            const response = await api.get(`WhosInBuilding/last-action-break/${employeeId}`, {
                params: { empId: employeeId },
            });

            if (response.data.status == 'IN') {
                tog_togFirst();
            }
            else {
                tog_togClockInLunch();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

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

            if (response.status === 200 || response.status === 201) {

                fetchLastActionBreak(employeeId);
                tog_togClockOutLunch();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };
    const handleConfirmClockInLunch = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-in-for-lunch", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {

                fetchLastActionBreak(employeeId);
                tog_togClockInLunch();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const handleConfirmClockInBusiness = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-in-for-business", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {

                fetchLastActionBusiness(employeeId);
                tog_togClockInBusiness();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const handleConfirmClockInPersonal = async () => {

        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;

        console.log("final empId: ", employeeId);
        if (!employeeId) {
            console.error("Employee ID is not found");
            return;
        }
        try {
            const response = await api.post("WhosInBuilding/clock-in-for-personal", {
                empId: employeeId,
            });

            if (response.status === 200 || response.status === 201) {

                fetchLastActionPersonal(employeeId);
                tog_togClockInPersonal();
            }
        } catch (error) {
            console.error("Error during clock-out process:", error);
        }
    };

    const fetchLastActionBreak = async (empId) => {
        try {
            const response = await api.get(`WhosInBuilding/last-action-break/${empId}`);
            if (response.data) {
                sessionStorage.setItem("getLastActionBreak", JSON.stringify(response.data));

                setMaxTimeBreak(response.data.maxTime.replace("T", " "));
                setStatusBreak(response.data.status); // Set status (IN or OUT)
            }
        } catch (error) {
            console.error("Error fetching last action:", error);
        }
    };
    const fetchLastActionBusiness = async (empId) => {
        try {
            const response = await api.get(`WhosInBuilding/last-action-business/${empId}`);
            if (response.data) {
                sessionStorage.setItem("getLastActionBusiness", JSON.stringify(response.data));

                setMaxTimeBusiness(response.data.maxTime.replace("T", " "));
                setStatusBusiness(response.data.status); // Set status (IN or OUT)
            }
        } catch (error) {
            console.error("Error fetching last action:", error);
        }
    };

    const fetchLastActionPersonal = async (empId) => {
        try {
            const response = await api.get(`WhosInBuilding/last-action-personal/${empId}`);
            if (response.data) {
                sessionStorage.setItem("getLastActionPersonal", JSON.stringify(response.data));

                setMaxTimePersonal(response.data.maxTime.replace("T", " "));
                setStatusPersonal(response.data.status); // Set status (IN or OUT)
            }
        } catch (error) {
            console.error("Error fetching last action:", error);
        }
    };

    const fetchLastAction = async (empId) => {
        try {
            const response = await api.get(`WhosInBuilding/last-action/${empId}`);
            if (response.data) {
                sessionStorage.setItem("getLastAction", JSON.stringify(response.data));

                console.log("FetchLastAction :", response.data);
                setMaxTime(response.data.maxTime.replace("T", " ")); // Set formatted maxTime
                setStatus(response.data.status); // Set status (IN or OUT)
            }
        } catch (error) {
            console.error("Error fetching last action:", error);
        }
    };

    //Bio Matrics Start

    const handleMissingPunch = async () => {

        setmodal_backdrop(true);

    };

    const handlePunchRecords = async () => {

        setmodal_backdropRecords(true);

    };

    // Bio Matrics End

    const authUser = sessionStorage.getItem("authUser");
    const empId = authUser ? JSON.parse(authUser)?.uid : null;

    useEffect(() => {
        const storedData = sessionStorage.getItem("getLastActionBreak");

        if (storedData) {
            const lastAction = JSON.parse(storedData);
            setMaxTimeBreak(lastAction.maxTime.replace("T", " "));
            setStatusBreak(lastAction.status);
        } else {
            const fetchLastActionBreak = async () => {
                try {
                    const response = await api.get(`WhosInBuilding/last-action-break/${empId}`);
                    if (response.data) {
                        sessionStorage.setItem("getLastActionBreak", JSON.stringify(response.data));

                        setMaxTimeBreak(response.maxTime.replace("T", " "));
                        setStatusBreak(response.data.status);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchLastActionBreak();
        }
    }, [empId]);

    useEffect(() => {
        const storedData = sessionStorage.getItem("getLastAction");

        if (storedData) {
            const lastAction = JSON.parse(storedData);
            setMaxTime(lastAction.maxTime.replace("T", " "));
            setStatus(lastAction.status);
        } else {
            const fetchLastAction = async () => {
                try {
                    const response = await api.get(`WhosInBuilding/last-action/${empId}`);
                    if (response.data) {
                        sessionStorage.setItem("getLastAction", JSON.stringify(response.data));
                        setMaxTime(response.data.maxTime.replace("T", " "));
                        setStatus(response.data.status);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchLastAction();
        }
    }, [empId]);

    useEffect(() => {
        const storedData = sessionStorage.getItem("getLastActionBusiness");

        if (storedData) {
            const lastAction = JSON.parse(storedData);
            setMaxTimeBusiness(lastAction.maxTime.replace("T", " "));
            setStatusBusiness(lastAction.status);
        } else {
            const fetchLastActionBusiness = async () => {
                try {
                    const response = await api.get(`WhosInBuilding/last-action-business/${empId}`);
                    if (response.data) {
                        sessionStorage.setItem("getLastActionBusiness", JSON.stringify(response.data));

                        setMaxTimeBusiness(response.maxTime.replace("T", " "));
                        setStatusBusiness(response.data.status);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchLastActionBusiness();
        }
    }, [empId]);

    useEffect(() => {
        const storedData = sessionStorage.getItem("getLastActionPersonal");

        if (storedData) {
            const lastAction = JSON.parse(storedData);
            setMaxTimePersonal(lastAction.maxTime.replace("T", " "));
            setStatusPersonal(lastAction.status);
        } else {
            const fetchLastActionPersonal = async () => {
                try {
                    const response = await api.get(`WhosInBuilding/last-action-Personal/${empId}`);
                    if (response.data) {
                        sessionStorage.setItem("getLastActionPersonal", JSON.stringify(response.data));

                        setMaxTimePersonal(response.maxTime.replace("T", " "));
                        setStatusPersonal(response.data.status);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchLastActionPersonal();
        }
    }, [empId]);

    // View Attendance Modal stuff start...............

    const handleAttendanceView = async () => {
        const authUser = sessionStorage.getItem("authUser");
        const employeeId = authUser ? JSON.parse(authUser)?.uid : null;
        try {
            const response = await api.get(`WhosInBuilding/work-time/${employeeId}`, {
                empId: employeeId,
            });
            console.log("Check Attendace Response :", response.status);

            if (response.status === 200 || response.status === 201) {
                if (Array.isArray(response.data) && response.data.length === 0) {
                    toast.error("Clock-In is necessary");
                } else {
                    setAttendanceData(response.data);
                    tog_togViewAttendace();
                }

            } else if (response.status === 404) {


            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here

        }

    };

    // View Attendance Modal stuff end...............


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <BreadCrumb title="Time and Attendance" pageTitle="Dashboards" />
                    <Row>
                        <div className="col-xxl-3">
                            <div className="card card-height-100">
                                <div className="card-header border-0 align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">My Attendance</h4>


                                </div>
                                <div className="card-body">
                                    <Row className="d-flex justify-content-center align-items-center">
                                        <Col sm={12} className="text-center">
                                            <div className="card ribbon-box border shadow-none mb-lg-0 right">
                                                <div className="card-body text-muted">
                                                    <span className={`ribbon-three ${status === "IN" ? "ribbon-three-success" : "ribbon-three-danger"}`}>
                                                        <span>{status}</span>
                                                    </span>
                                                    <h5 className="fs-14 mb-3">Currently You Are</h5>
                                                    <img className="img-thumbnail rounded-circle avatar-xl" alt="userImage" src={avatar3} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-center align-items-center">
                                        <Col sm={12} className="text-center">
                                            <div className="card-body text-dark">
                                                <span>Your Current Time: {maxTime}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr style={{ borderTop: "1px solid lightgrey", width: "100%", margin: "20px 0" }} />
                                    <Row className="d-flex justify-content-center align-items-center">
                                        <div >
                                            {clockInTime && <h4 className="card-title mb-0 flex-grow-1">
                                                <Timer clockInTime={clockInTime} />
                                            </h4>}
                                        </div>
                                    </Row>
                                    <Row className="d-flex justify-content-center align-items-center">
                                    </Row>
                                    <Row className="align-items-end">
                                        <Col sm={12}>
                                            <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                                                <li className="list-group-item px-0">
                                                    <div className="d-flex">
                                                        <div className="flex-shrink-0 avatar-xs">
                                                            <span className="avatar-title p-1 rounded-circle">
                                                                <i className="mdi mdi-coffee"></i>
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow-1 ms-2">

                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Break Time
                                                            </p>
                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Break Status
                                                            </p>
                                                        </div>

                                                        {statusBreak === "IN" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-success fs-12 mb-0">{maxTimeBreak}</p>
                                                                <p className="text-success fs-12 mb-0">{statusBreak}</p>
                                                            </div>
                                                        ) : statusBreak === "OUT" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-danger fs-12 mb-0">{maxTimeBreak}</p>
                                                                <p className="text-danger fs-12 mb-0">{statusBreak}</p>
                                                            </div>
                                                        ) : null}



                                                    </div>


                                                </li>

                                                <li className="list-group-item px-0">
                                                    <div className="d-flex">
                                                        <div className="flex-shrink-0 avatar-xs">
                                                            <span className="avatar-title p-1 rounded-circle">
                                                                <i className="mdi mdi-skype-business"></i>
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow-1 ms-2">

                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Business Time
                                                            </p>
                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Business Status
                                                            </p>
                                                        </div>
                                                        {statusBusiness === "IN" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-success fs-12 mb-0">{maxTimeBusiness}</p>
                                                                <p className="text-success fs-12 mb-0">{statusBusiness}</p>
                                                            </div>
                                                        ) : statusBusiness === "OUT" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-danger fs-12 mb-0">{maxTimeBusiness}</p>
                                                                <p className="text-danger fs-12 mb-0">{statusBusiness}</p>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </li>



                                                <li className="list-group-item px-0">
                                                    <div className="d-flex">
                                                        <div className="flex-shrink-0 avatar-xs">
                                                            <span className="avatar-title p-1 rounded-circle">
                                                                <i className="mdi mdi-bag-personal"></i>
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow-1 ms-2">

                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Personal Break Time
                                                            </p>
                                                            <p className="fs-12 mb-0 text-muted">
                                                                <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Personal Break Status
                                                            </p>
                                                        </div>
                                                        {statusPersonal === "IN" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-success fs-12 mb-0">{maxTimePersonal}</p>
                                                                <p className="text-success fs-12 mb-0">{statusPersonal}</p>
                                                            </div>
                                                        ) : statusPersonal === "OUT" ? (
                                                            <div className="flex-shrink-0 text-end">

                                                                <p className="text-danger fs-12 mb-0">{maxTimePersonal}</p>
                                                                <p className="text-danger fs-12 mb-0">{statusPersonal}</p>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </li>




                                            </ul>
                                        </Col>
                                        <Row>
                                            <div className="d-grid gap-2">
                                                <Button color="secondary" onClick={handleAttendanceView} className="btn-load btn btn-soft-secondary d-grid" outline>
                                                    <span className="d-flex align-items-center">
                                                        <span className="flex-grow-1 me-2">
                                                            View Attendance
                                                        </span>
                                                        <Spinner size="sm" className="flex-shrink-0" role="status"> View Attendance </Spinner>
                                                    </span>
                                                </Button>
                                            </div>

                                        </Row>
                                        <Row>
                                            <div style={{ zIndex: "11" }}>
                                                <ToastContainer />
                                                {/* <Toast isOpen={toast10} id="borderedToast4" className="toast-border-danger overflow-hidden mt-3">
                                                    <ToastBody>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className="ri-alert-line align-middle"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0">Something is very wrong!  <Link to="#" className="text-decoration-underline">See detailed report.</Link></h6>
                                                            </div>
                                                        </div>
                                                    </ToastBody>
                                                </Toast> */}
                                            </div>
                                        </Row>


                                    </Row>

                                </div>
                            </div>
                        </div>
                        <Col className="order-xxl-0">
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
                                                        <div className="mt-3">
                                                            <Button onClick={handleClockIn} className="btn btn-soft-secondary">
                                                                In for the Day
                                                            </Button>

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
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
                                                        <div className="mt-3">
                                                            <Button onClick={handleClockOutLunch} className="btn btn-soft-primary">Out for the Lunch</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3" >
                                                        <div className="mt-3">
                                                            <Button onClick={handleClockInLunch} className="btn btn-soft-primary">Back from Lunch</Button>
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
                                                        <div className="mt-3">
                                                            <Button onClick={handleClockOutBusiness} className="btn btn-soft-warning">Out for Business</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        <div className="mt-3" >
                                                            <Button onClick={handleClockInBusiness} className="btn btn-soft-warning">Back from Business</Button>

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
                                                        <div className="mt-3">
                                                            <Button onClick={handleClockOutPersonal} className="btn btn-soft-success">Out for Personal Business</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div className="p-3">
                                                        <div className="mt-3" >
                                                            <Button onClick={handleClockInPersonal} className="btn btn-soft-success">Back from Personal Business</Button>
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
                                                        <div className="mt-3">
                                                            <Button onClick={handleMissingPunch} className="btn btn-soft-danger">My Missing Punches</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="p-4">
                                                        <div className="mt-3" >
                                                            <Button onClick={handlePunchRecords} className="btn btn-soft-danger">My Time Punch Records</Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="p-4">
                                                        <div className="mt-3" >
                                                            <Button onClick={tog_xlarge} className="btn btn-soft-danger">Who's In The Building?</Button>

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

                        </Col>
                    </Row>
                    {/* Already Clocked In Message Modal */}
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
                    {/* Already Clocked In Message Modal End */}

                    {/* Already Clocked Out Message Modal */}
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
                    {/* Already Clocked Out Message Modal End */}

                    {/* Clock In for the Day */}
                    <Modal
                        isOpen={modal_togClockIn}
                        toggle={tog_togClockIn}
                        modalClassName="flip" centered
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
                    {/* Clock In for the Day End */}

                    {/* Clock Out for the Day */}
                    <Modal
                        isOpen={modal_togClockOut}
                        toggle={tog_togClockOut}
                        modalClassName="flip" centered
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
                    {/* Clock Out for the Day End */}

                    {/* Out for the Lunch Modal */}
                    <Modal
                        isOpen={modal_togClockOutLunch}
                        toggle={tog_togClockOutLunch}
                        modalClassName="flip" centered

                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock Out for the Lunch</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock Out for the Lunch</h4>

                                <br />
                                <DigitalClock />

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
                    {/* Out for the Lunch Modal End */}


                    {/* Out for the Business Modal */}
                    <Modal
                        isOpen={modal_togClockOutBusiness}
                        toggle={tog_togClockOutBusiness}
                        modalClassName="flip" centered

                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock Out for the Business</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock Out for the Business</h4>

                                <br />
                                <DigitalClock />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockOutBusiness}>
                                Clock Out for Business
                            </Button>

                            <Button color="secondary" onClick={tog_togClockOutBusiness}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* Out for the Business Modal End */}

                    {/* Back form the Lunch Modal */}
                    <Modal
                        isOpen={modal_togClockInLunch}
                        toggle={tog_togClockInLunch}
                        modalClassName="flip" centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Back In from the Lunch</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Back In from the Lunch</h4>

                                <br />
                                <DigitalClock />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockInLunch}>
                                Back In from Lunch
                            </Button>

                            <Button color="secondary" onClick={tog_togClockInLunch}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* Back form the Lunch Modal End */}

                    {/* Back from The Business Modal */}
                    <Modal
                        isOpen={modal_togClockInBusiness}
                        toggle={tog_togClockInBusiness}
                        modalClassName="flip" centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Back In from the Business</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Back In from the Business</h4>

                                <br />
                                <DigitalClock />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockInBusiness}>
                                Back In from Business
                            </Button>

                            <Button color="secondary" onClick={tog_togClockInBusiness}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* Back from The Business Modal End */}


                    {/* Out for the Personal Modal */}
                    <Modal
                        isOpen={modal_togClockOutPersonal}
                        toggle={tog_togClockOutPersonal}
                        modalClassName="flip" centered

                    >
                        <ModalHeader>
                            <h5 className="modal-title">Clock Out for the Personal</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Clock Out for the Personal</h4>

                                <br />
                                <DigitalClock />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockOutPersonal}>
                                Clock Out for Personal
                            </Button>

                            <Button color="secondary" onClick={tog_togClockOutPersonal}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* Out for the Personal Modal End */}


                    {/* Back from The Personal Modal */}
                    <Modal
                        isOpen={modal_togClockInPersonal}
                        toggle={tog_togClockInPersonal}
                        modalClassName="flip" centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title">Back In from the Personal</h5>

                        </ModalHeader>
                        <ModalBody className="text-center p-5">

                            <div className="mt-4 pt-3">
                                <h4>Back In from the Personal</h4>

                                <br />
                                <DigitalClock />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleConfirmClockInPersonal}>
                                Back In from Personal
                            </Button>

                            <Button color="secondary" onClick={tog_togClockInPersonal}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* Back from The Personal Modal End */}


                    {/* View Current day Attendance Modal */}
                    <Modal size="xl" isOpen={modal_togViewAttendace} toggle={tog_togViewAttendace}>
                        <ModalHeader toggle={tog_togViewAttendace}>
                            <FeatherIcon icon="clock" className="text-secondary me-2 icon-sm" />
                            View Attendance
                        </ModalHeader>
                        <ModalBody>
                            {attendanceData ? (
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Status</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Clock In</td>
                                            <td>{attendanceData.status === "IN" ? "Clocked In" : "Clocked In"}</td>
                                            <td>{new Date(attendanceData.clockInTime).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Clock Out</td>
                                            <td>{attendanceData.status === "OUT" ? "Clocked Out" : "Clocked Out"}</td>
                                            <td>{attendanceData.clockOutTime ? new Date(attendanceData.clockOutTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" style={{ padding: "1px" }} ></td>
                                        </tr>
                                        <tr>
                                            <td>Break Start</td>
                                            <td>{attendanceData.breakStartTime ? "On Break" : "No Break"}</td>
                                            <td>{attendanceData.breakStartTime ? new Date(attendanceData.breakStartTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td>Break End</td>
                                            <td>{attendanceData.breakEndTime ? "Break Ended" : "No Break Ended"}</td>
                                            <td>{attendanceData.breakEndTime ? new Date(attendanceData.breakEndTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total Break Time</b></td>
                                            <td colSpan="2" style={{ backgroundColor: "#f1f1f1", padding: "10px", textAlign: "center" }}>
                                                <b> {attendanceData.breakDuration ? attendanceData.breakDuration.toFixed(2) : "N/A"} minutes</b>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" style={{ padding: "1px" }} ></td>
                                        </tr>
                                        <tr>
                                            <td>Business Start</td>
                                            <td>{attendanceData.businessStartTime ? "On Business" : "No Business"}</td>
                                            <td>{attendanceData.businessStartTime ? new Date(attendanceData.businessStartTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td>Business End</td>
                                            <td>{attendanceData.businessEndTime ? "Business Ended" : "No Business Ended"}</td>
                                            <td>{attendanceData.businessEndTime ? new Date(attendanceData.businessEndTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total Business Time</b></td>
                                            <td colSpan="2" style={{ backgroundColor: "#f1f1f1", padding: "10px", textAlign: "center" }}>
                                                <b>{attendanceData.businessDuration ? attendanceData.businessDuration.toFixed(2) : "N/A"} minutes</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" style={{ padding: "1px" }} ></td>
                                        </tr>
                                        <tr>
                                            <td>Personal Business Start</td>
                                            <td>{attendanceData.personalStartTime ? "On Personal" : "No Personal"}</td>
                                            <td>{attendanceData.personalStartTime ? new Date(attendanceData.personalStartTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td>Personal Business End</td>
                                            <td>{attendanceData.personalEndTime ? "Personal Ended" : "No Personal Ended"}</td>
                                            <td>{attendanceData.personalEndTime ? new Date(attendanceData.personalEndTime).toLocaleString() : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total Personal Business Time</b></td>
                                            <td colSpan="2" style={{ backgroundColor: "#f1f1f1", padding: "10px", textAlign: "center" }}>
                                                <b> {attendanceData.personalDuration ? attendanceData.personalDuration.toFixed(2) : "N/A"} minutes</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" style={{ padding: "1px" }} ></td>
                                        </tr>
                                        <tr>
                                            <td className="text-success fs-330 mb-0"><b>Total Worked Time</b></td>
                                            <td colSpan="2" className="text-success fs-330 mb-0" style={{ backgroundColor: "#f1f1f1", padding: "10px", textAlign: "center" }}>
                                                <b>{attendanceData.totalWorkedTime}</b>
                                            </td>
                                        </tr>
                                    </tbody>


                                </Table>
                            ) : (
                                <p>Loading attendance data...</p>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={tog_togViewAttendace}>Close</Button>
                        </ModalFooter>
                    </Modal>
                    {/* View Current day Attendance Modal End */}

                    {/* Who is in the Bulding Modal XL */}
                    <Modal
                        size="xl"
                        isOpen={modal_xlarge}
                        toggle={() => {
                            tog_xlarge();
                        }}
                    >
                        <ModalHeader className="modal-title"
                            id="myExtraLargeModalLabel" toggle={() => {
                                tog_xlarge();
                            }}>

                            Who's In the Building?

                        </ModalHeader>
                        <ModalBody>
                            <WhoisInBuilding />
                        </ModalBody>
                        <div className="modal-footer">
                            <Link to="#" className="btn btn-link link-success fw-medium" onClick={() => setmodal_xlarge(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link>

                        </div>
                    </Modal>
                    {/* Who is in the Bulding Modal XL End*/}

                    {/* Missing Punches */}

                    <Modal
                        isOpen={modal_backdrop}
                        toggle={tog_backdrop}
                        backdrop="static"
                        id="staticBackdrop"
                        centered
                    >
                        <ModalHeader>
                            {/* <h5 className="modal-title" id="staticBackdropLabel">Missing Punches</h5> */}
                        </ModalHeader>
                        <ModalBody className="text-center p-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/lupuorrc.json"
                                trigger="loop"
                                colors="primary:#121331,secondary:#08a88a"
                                style={{ width: "120px", height: "120px" }}>
                            </lord-icon>

                            <div className="mt-4">
                                <h4 className="mb-3">No Missing Punches</h4>
                                <p className="text-muted mb-4">No Missing Punches Have been Detected 🎉</p>
                                <div className="hstack gap-2 justify-content-center">
                                    {/* <Button color="success" onClick={() => {
                                        setmodal_backdrop(false);
                                        history("/login"); // Redirect if needed
                                    }}>
                                        Go to Login
                                    </Button> */}
                                </div>
                            </div>
                        </ModalBody>
                        <div className="modal-footer">
                            <Link to="#" className="btn btn-link link-success fw-medium" onClick={() => setmodal_backdrop(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link>

                        </div>
                    </Modal>

                    {/* Missing Punches End */}


                    {/* My Punch Records */}

                    <Modal
                        size="xl"
                        isOpen={modal_backdropRecords}
                        toggle={tog_backdropRecords}

                    >
                        <ModalHeader>
                            {/* <h5 className="modal-title" id="staticBackdropLabel">Missing Punches</h5> */}
                        </ModalHeader>
                        <ModalBody>
                            <ComingSoon />
                        </ModalBody>
                        <div className="modal-footer">
                            <Link to="#" className="btn btn-link link-success fw-medium" onClick={() => setmodal_backdropRecords(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link>

                        </div>
                    </Modal>

                    {/* My Punch Records End */}



                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrypto;