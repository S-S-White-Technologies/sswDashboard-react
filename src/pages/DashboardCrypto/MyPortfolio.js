import React from 'react';
import { Row, Col } from 'reactstrap';
import avatar3 from "../../../src/assets/images/logofinal.png";

const MyPortfolio = ({ clockOutLunchSuccess, clockInLunchSuccess, status, statusBreak, maxTime, maxTimeBreak }) => {
    return (
        <React.Fragment>
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
                        {(clockOutLunchSuccess || clockInLunchSuccess) && (
                            <Row className="align-items-end">
                                <Col sm={12}>
                                    <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                                        <li className="list-group-item px-0">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0 avatar-xs">
                                                    <span className="avatar-title p-1 rounded-circle">
                                                        <i className="mdi mdi-login"></i>
                                                    </span>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    <h6 className="mb-1">Today</h6>
                                                    <p className="fs-12 mb-0 text-muted">
                                                        <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Break Time
                                                    </p>
                                                    <p className="fs-12 mb-0 text-muted">
                                                        <i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>Break Status
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-end">
                                                    <h6 className="mb-1">{status}</h6>
                                                    <p className="text-danger fs-12 mb-0">{maxTimeBreak}</p>
                                                    <p className="text-danger fs-12 mb-0">{statusBreak}</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MyPortfolio;
