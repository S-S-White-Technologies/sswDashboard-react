import React from "react";
import { useState, useEffect } from 'react';
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import BreadCrumb from '../../Components/Common/BreadCrumb';
import logoRefresh from "../../assets/images/refresh_icon.png";
import axios from "axios";
import { SearchTableEdit } from '../../pages/Tables/ReactTables/ReactTable'
import { Link } from 'react-router-dom';
import classnames from "classnames";

const UserList = () => {

    const [salariedData, setSalariedData] = useState([]);  // Salaried employees data
    useEffect(() => {
        axios.get("https://localhost:7168/api/WhosInBuilding/userList")
            .then((response) => {
                setSalariedData(response); // ✅ access response.data
                console.log("Salaried", response);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


    return (
        <React.Fragment>

            <Container fluid>
                <Row>
                    <Col xxl={12}>

                        <Card>
                            <CardBody>
                                <SearchTableEdit data={salariedData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </React.Fragment>
    );
};

export default UserList;
