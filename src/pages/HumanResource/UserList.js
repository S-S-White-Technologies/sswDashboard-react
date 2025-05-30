import React from "react";
import { useState, useEffect } from 'react';
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import BreadCrumb from '../../Components/Common/BreadCrumb';
import logoRefresh from "../../assets/images/refresh_icon.png";
import axios from "axios";
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns, SearchTableEdit } from '../../pages/Tables/ReactTables/ReactTable'
import { Link } from 'react-router-dom';
import classnames from "classnames";

const UserList = () => {
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




    document.title =
        "Who's In the Building | SSW Technologies Inc.";
    return (
        <React.Fragment>

            <Container fluid>
                <Row>
                    <Col xxl={12}>

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
                                                <SearchTableEdit data={salariedData} />
                                            </CardBody>

                                        </div>

                                    </TabPane>

                                    <TabPane tabId="2" id="profile-1">

                                        <div className="d-flex">

                                            <CardBody>
                                                <SearchTableEdit data={hourlyData} />
                                            </CardBody>

                                        </div>
                                    </TabPane>



                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </React.Fragment>
    );
};

export default UserList;
