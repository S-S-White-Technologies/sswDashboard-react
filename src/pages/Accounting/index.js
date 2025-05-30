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

const Accounting = () => {
    document.title = "SSW Technologies Dashboard";


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Accounting" pageTitle="Dashboards" />
                    <Row>
                        <ComingSoon />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );


}

export default Accounting;