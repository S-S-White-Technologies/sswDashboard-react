import React, { useState, useEffect } from 'react';
import { Row, Col, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import api from "../../config/api";
import { getPortfolioChartsData } from '../../slices/thunks';
import avatar3 from "../../../src/assets/images/logofinal.png"

const MyPortfolio = ({ clockInSuccess, clockOutSuccess, clockOutLunchSuccess }) => {


    const [status, setStatus] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [breakStartTime, setBreakStartTime] = useState('');
    const [breakEndTime, setBreakEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    const authUser = sessionStorage.getItem("authUser");
    const empId = authUser ? JSON.parse(authUser)?.uid : null;

    console.log("Employee ID: ", empId);

    useEffect(() => {
        if (empId || clockInSuccess || clockOutSuccess || clockOutLunchSuccess) {

            const fetchLastAction = async () => {

                setLoading(true);
                try {
                    const response = await api.get(`WhosInBuilding/last-action/${empId}`);

                    if (response.data) {

                        sessionStorage.setItem("getLastAction", JSON.stringify(response.data));

                        console.log("GetLastAction:", response.data);
                        setMaxTime(response.data.maxTime.replace("T", "  "));
                        setStatus(response.data.status);

                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLastAction();

            // const fetchData = async () => {
            //     setLoading(true);
            //     try {
            //         // Fetch last action data (clock in/out)
            //         const lastActionPromise = api.get(`WhosInBuilding/last-action/${empId}`);

            //         // Fetch break data (if exists)
            //         const breakTimePromise = api.get(`WhosInBuilding/last-action-break/${empId}`);

            //         // Wait for both promises to resolve
            //         const [lastActionResponse, breakTimeResponse] = await Promise.all([lastActionPromise, breakTimePromise]);

            //         if (lastActionResponse.data) {
            //             // Handle last action response
            //             setMaxTime(lastActionResponse.data.maxTime.replace("T", " "));
            //             setStatus(lastActionResponse.data.status);
            //         }

            //         if (breakTimeResponse.data) {
            //             // Handle break time response
            //             setBreakStartTime(breakTimeResponse.data.breakStartTime ? breakTimeResponse.data.breakStartTime.replace("T", " ") : null);
            //             setBreakEndTime(breakTimeResponse.data.breakEndTime ? breakTimeResponse.data.breakEndTime.replace("T", " ") : null);
            //         }

            //         // Save both responses in sessionStorage if needed
            //         sessionStorage.setItem("getLastAction", JSON.stringify(lastActionResponse.data));
            //         sessionStorage.setItem("getBreakTime", JSON.stringify(breakTimeResponse.data));
            //         console.log("Break Time :", breakTimeResponse.data);

            //     } catch (error) {
            //         console.error("Error fetching data:", error);
            //     } finally {
            //         setLoading(false);
            //     }
            // };

            // fetchData();
        }


    }, [empId, clockInSuccess, clockOutSuccess, clockOutLunchSuccess]);




    const dispatch = useDispatch();

    const [chartData, setchartData] = useState([]);

    const { portfolioData } = useSelector(state => ({
        portfolioData: state.DashboardCrypto.portfolioData
    }));

    useEffect(() => {
        setchartData(portfolioData);
    }, [portfolioData]);

    const [seletedMonth, setSeletedMonth] = useState("Btc");
    const onChangeChartPeriod = pType => {
        setSeletedMonth(pType);
        dispatch(getPortfolioChartsData(pType));
    };

    useEffect(() => {
        dispatch(getPortfolioChartsData("btc"));
    }, [dispatch]);




    return (
        <React.Fragment>
            <div className="col-xxl-3">
                <div className="card card-height-100">
                    <div className="card-header border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">My Attendance</h4>
                        <div>

                            {/* <UncontrolledDropdown direction='start'>
                                <span tag="button"
                                    className={`btn btn-sm ${status === "IN" ? "btn-success" : "btn-danger"}`}>
                                    <i className={`ri-arrow-right-${status === "IN" ? "up" : "down"}-line`}></i>
                                    {status === "IN" ? "In" : "Out"}
                                </span>
                               
                            </UncontrolledDropdown> */}
                        </div>
                    </div>
                    <div className="card-body">
                        {/* <PortfolioCharts series={chartData} dataColors='["--vz-primary", "--vz-info", "--vz-warning", "--vz-success"]' /> */}

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
                                    <span>
                                        <span>Your Current Time : {maxTime}</span>
                                    </span>


                                </div>


                            </Col>

                        </Row>
                        <hr
                            style={{
                                borderTop: "1px solid lightgrey",
                                width: "100%",
                                margin: "20px 0",
                            }}
                        />
                        <Row className="align-items-end">
                            <Col sm={12}>
                                <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                                    <li className="list-group-item px-0">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <span className="avatar-title  p-1 rounded-circle">
                                                    <i className="mdi mdi-login"></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="mb-1">Today</h6>
                                                <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Out for Break</p>
                                                <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Back from Break</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end">
                                                <h6 className="mb-1"><span>{status}</span></h6>
                                                <p className="text-success fs-12 mb-0">2025-05-23 08:01:32</p>
                                                <p className="text-danger fs-12 mb-0">2025-05-23 05:01:32</p>
                                            </div>

                                        </div>
                                    </li>
                                    {/* <li className="list-group-item px-0">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <span className="avatar-title  p-1 rounded-circle">
                                                    <i className="mdi mdi-logout"></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="mb-1">Sign Out</h6>
                                                <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-info me-1"></i>ETH</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end">
                                                <h6 className="mb-1">ETH 2.25842108</h6>
                                                <p className="text-danger fs-12 mb-0">${chartData[1]}.18</p>
                                            </div>
                                        </div>
                                    </li> */}
                                    {/* <li className="list-group-item px-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={ltc} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Litecoin</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-warning me-1"></i>LTC</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">LTC 10.58963217</h6>
                                        <p className="text-success fs-12 mb-0">${chartData[2]}.58</p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0 pb-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={dash} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Dash</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-success me-1"></i>DASH</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">DASH 204.28565885</h6>
                                        <p className="text-success fs-12 mb-0">${chartData[3]}.84</p>
                                    </div>
                                </div>
                            </li> */}
                                </ul>
                            </Col>
                        </Row>



                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MyPortfolio;