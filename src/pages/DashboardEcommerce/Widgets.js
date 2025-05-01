import React, { useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { ecomWidgets } from "../../common/data";

const Widgets = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(new Date());

  const handleToggle = () => {
    setIsClockedIn(prev => !prev);
    setClockTime(new Date());
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <React.Fragment>
      {ecomWidgets.map((item, key) => {
        if (item.label && item.label.toLowerCase() === "attendance") {
          return (
            <Col xl={4} md={12} key={key}>
              <Card className="card-animate">
                <CardBody>
                  <Row className="align-items-center">
                    {/* Profile Avatar */}
                    <Col sm="3" className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        <div className="d-none d-sm-block d-md-none avatar-md">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary fs-3">
                            <i className="ri-user-line"></i>
                          </span>
                        </div>
                        <div className="d-none d-md-block d-xl-none avatar-lg">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary fs-1">
                            <i className="ri-user-line"></i>
                          </span>
                        </div>
                        <div className="d-none d-xl-block avatar-xl">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary fs-2">
                            <i className="ri-user-line"></i>
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <img
                          src="https://flagcdn.com/us.svg"
                          alt="US"
                          height="20"
                          className="rounded shadow-sm"
                        />
                      </div>
                    </Col>

                    {/* Name and Clock Info */}
                    <Col sm="9">
                      <div className="bg-soft-light rounded p-3 mb-3">
                        <h4 className="mb-2 fw-semibold">Paavani Jammu</h4>
                        <p className="mb-1">
                          <i className="ri-login-circle-line text-success me-1"></i>
                          Clock <strong>{isClockedIn ? 'IN' : 'OUT'}</strong> at <strong>{formatTime(clockTime)}</strong>
                        </p>
                        <p className="mb-0">
                          {formatDate(clockTime)}
                        </p>
                      </div>

                      {/* Working hours */}
                      <div className="bg-light p-3 rounded mb-3">
                        <h6 className="mb-1">Working Hours:</h6>
                        <p className="mb-0 text-muted">2h 02m</p>
                      </div>

                      {/* Full-width clock-in button */}
                      <Button
                        color={isClockedIn ? 'danger' : 'success'}
                        className="w-100 text-white"
                        size="lg"
                        onClick={handleToggle}
                      >
                        <i className={isClockedIn ? 'ri-logout-box-line me-2' : 'ri-login-box-line me-2'}></i>
                        {isClockedIn ? 'Clock Out' : 'Clock In'}
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          );
        }

        // Default widget rendering
        return (
          <Col xl={3} md={6} key={key}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                      {item.label}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                      {item.badge ? (
                        <i className={"fs-13 align-middle " + item.badge}></i>
                      ) : null}{" "}
                      {item.percentage} %
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                      <span className="counter-value">
                        <CountUp
                          start={0}
                          prefix={item.prefix}
                          suffix={item.suffix}
                          separator={item.separator}
                          end={item.counter}
                          decimals={item.decimals}
                          duration={4}
                        />
                      </span>
                    </h4>
                    <Link to="#" className="text-decoration-underline">
                      {item.link}
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className={"avatar-title rounded fs-3 bg-" + item.bgcolor}>
                      <i className={`${item.icon}`}></i>
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </React.Fragment>
  );
};

export default Widgets;


