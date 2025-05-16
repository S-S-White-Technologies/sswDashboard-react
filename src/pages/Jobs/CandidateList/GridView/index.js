import React from "react";
import { useState, useEffect } from 'react';
import TableContainer from "../../../../Components/Common/TableContainerReactTable";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import logoRefresh from "../../../../assets/images/refresh_icon.png";
import axios from "axios";
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from '../../../../pages/Tables/ReactTables/ReactTable'
import { Link } from 'react-router-dom';
import classnames from "classnames";

const CandidateGrid = () => {
  const [pillsTab, setpillsTab] = useState("1");  // Active tab for salaried or hourly
  const [salariedData, setSalariedData] = useState([]);  // Salaried employees data
  const [hourlyData, setHourlyData] = useState([]);  // Hourly employees data
  const [lastRefreshed, setLastRefreshed] = useState("");

  const pillsToggle = (tab) => {
    if (pillsTab !== tab) {
      setpillsTab(tab);
    }
  };

  useEffect(() => {
    if (pillsTab === "1") {
      axios.get("https://localhost:7168/api/WhosInBuilding/salaried")
        .then((response) => {
          setSalariedData(response);
          console.log("Salaried", response);
        });
    }
  }, [pillsTab]);

  useEffect(() => {
    if (pillsTab === "2") {
      axios.get("https://localhost:7168/api/WhosInBuilding/hourly")
        .then((response) => {
          setHourlyData(response);
          console.log("Hourly", response);
        });
    }
  }, [pillsTab]);

  const handleRefresh = () => {
    const currentDateTime = new Date().toLocaleString();
    setLastRefreshed(currentDateTime);  // Update the last refreshed time
    setpillsTab('1');
    setpillsTab('2');
    setpillsTab('1');
  };


  document.title =
    "Who's In the Building | SSW Technologies Inc.";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xxl={12}>
              <h5 className="mb-3">
                <div className="flex-grow-1">
                  <h4 className="fs-16 mb-1">Who's In the Building?</h4>

                </div>
              </h5>
              <br />
              <Card>
                <CardBody>


                  <Nav pills className="nav-success mb-3">
                    <NavItem>
                      <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pillsTab === "1", })} onClick={() => { pillsToggle("1"); }} >
                        Salaried
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pillsTab === "2", })} onClick={() => { pillsToggle("2"); }} >
                        Hourly
                      </NavLink>
                    </NavItem>
                  </Nav>




                  <TabContent activeTab={pillsTab} className="text-muted">
                    <TabPane tabId="1" id="home-1">
                      <div className="d-flex">

                        <CardBody>
                          <SearchTable data={salariedData} />
                        </CardBody>

                      </div>

                    </TabPane>

                    <TabPane tabId="2" id="profile-1">

                      <div className="d-flex">

                        <CardBody>
                          <SearchTable data={hourlyData} />
                        </CardBody>

                      </div>

                      {/* <div className="d-flex">
                        <div className="flex-shrink-0">
                          <i className="ri-checkbox-circle-fill text-success"></i>
                        </div>
                        <div className="flex-grow-1 ms-2">
                          In some designs, you might adjust your tracking to create a certain artistic effect. It can also help you fix fonts that are poorly spaced to begin with.
                        </div>
                      </div>
                      <div className="d-flex mt-2">
                        <div className="flex-shrink-0">
                          <i className="ri-checkbox-circle-fill text-success"></i>
                        </div>
                        <div className="flex-grow-1 ms-2">
                          A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.
                        </div>
                      </div> */}
                    </TabPane>
                    <hr
                      style={{
                        borderTop: "1px solid lightgrey",
                        width: "100%",
                        margin: "20px 0",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button onClick={handleRefresh} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <img
                          src={logoRefresh}
                          alt="Refresh Icon"
                          style={{ height: "20px", width: "20px" }}
                        />
                      </button>
                      <span style={{ fontSize: "14px", color: "#6c757d" }}>Click to refresh</span>
                    </div>


                    {lastRefreshed && (
                      <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#6c757d" }}>
                        <span>Last refreshed on: {lastRefreshed}</span>
                      </div>
                    )}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CandidateGrid;
