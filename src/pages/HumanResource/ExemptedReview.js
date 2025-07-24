import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardBody, CardHeader, Table, } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import api from "../../api"

const ExemptedReview = () => {

    const [eligibleEmployees, setEligibleEmployees] = useState([]);
    const [completedReviews, setcompletedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(sessionStorage.getItem("authUser"));

    useEffect(() => {
        fetchEligibleEmployees();
        fetchCompletedReviews();
    }, []);

    const fetchEligibleEmployees = async () => {
        try {
            const response = await api.get("ExemptedReview/eligible");
            console.log("Eligible :", response);
            setEligibleEmployees(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching eligible employees", err);
            setLoading(false);
        }
    };
    const fetchCompletedReviews = async () => {
        try {
            const response = await api.get("ExemptedReview/completed");
            console.log("Eligible :", response);
            setcompletedReviews(response.data);

        } catch (err) {
            console.error("Error fetching completed review", err);

        }
    };
    const handleStartReview = async (empId) => {
        console.log("Start Review from EmpID  and Curr User :", empId, currentUser.uid);
        try {
            await api.post("StartReview/start-review", {
                empId,
                createdBy: currentUser.uid
            });
            fetchEligibleEmployees(); // Refresh list
        } catch (err) {
            console.error("Failed to start review", err);
        }
    };
    const navigate = useNavigate();
    const handleViewReview = (reviewId) => {
        // navigate(`/review/exempted/${reviewId}?role=hr`);
        const pdfUrl = `https://localhost:7168/api/exemptedreview/pdf/${reviewId}`;
        window.open(pdfUrl, "_blank");
    };
    return (
        <div className="container">

            {loading ? <p>Loading...</p> : (
                <Card>
                    <CardHeader>Eligible Employees for Exempted Review</CardHeader>
                    <CardBody>
                        <Table>

                            <thead className="table-light">
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Hire Date</th>
                                    <th>Supervisor ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eligibleEmployees?.map((emp) => (
                                    <tr key={emp.empId}>
                                        <td>{emp.empId}</td>
                                        <td>{emp.fullName}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : "N/A"}</td>
                                        <td>{emp.supervisorId}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => handleStartReview(emp.empId)}>
                                                Start Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    </CardBody>
                </Card>
            )}

            <Card>
                <CardHeader>Completed Exempted Reviews</CardHeader>
                <CardBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Hire Date</th>
                                <th>Supervisor ID</th>
                                <th>Completed On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedReviews.map((review) => (
                                <tr key={review.reviewId}>
                                    <td>{review.empID}</td>
                                    <td>{review.employeeFullName}</td>
                                    <td>{review.employeeEmail}</td>
                                    <td>{review.hireDate}</td>
                                    <td>{review.supervisorId}</td>
                                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Button className="btn btn-danger btn-sm" onClick={() => handleViewReview(review.reviewId)}>
                                            View Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>


        </div>
    );
};

export default ExemptedReview;
