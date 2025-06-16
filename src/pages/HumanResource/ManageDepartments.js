import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import {
    Row, Col, Card, CardBody,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button
} from "reactstrap";

function ManageDepartments() {
    const [departments, setDepartments] = useState([]);
    const [newDept, setNewDept] = useState({ jcDept1: "", description: "" });
    const [selectedDeptId, setSelectedDeptId] = useState(""); // For deletion

    // Fetch all departments
    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${api.API_URL}department`);
            const data = res;
            if (!data || typeof data !== "object") throw new Error("Invalid response");
            if (!Array.isArray(data.value)) throw new Error("Expected 'value' array");
            setDepartments(data.value);
        } catch (err) {
            console.error("❌ Departments fetch error:", err.message || err);
            alert("Error fetching departments");
        }
    };

    // Add department
    const handleAdd = async () => {
        try {
            const payload = {
                JCDept1: newDept.jcDept1,
                Description: newDept.description,
                Company: "SSW",
                GlobalJCDept: true,
                GlobalLock: false,
                SysRevID: 0,
                SysRowID: "00000000-0000-0000-0000-000000000000",
                COASegReferences: "",
                BitFlag: 0,
                RowMod: "A"
            };

            setDepartments([
                ...departments,
                { jcDept1: newDept.jcDept1, description: newDept.description }
            ]);

            setNewDept({ jcDept1: "", description: "" });

            const res = await axios.post(`${api.API_URL}department`, payload);
            console.log("✅ Department added:", res);
            fetchDepartments();
        } catch (err) {
            console.error("❌ Add error:", err.message || err);
            alert("Add failed");
        }
    };

    // Delete department
    const handleDelete = async () => {
        if (!selectedDeptId) {
            alert("Please select a department to delete.");
            return;
        }

        try {
            await axios.delete(`${api.API_URL}department/SSW/${selectedDeptId}`);
            alert("✅ Department deleted");
            setSelectedDeptId(""); // Reset dropdown
            fetchDepartments();
        } catch (err) {
            console.error("❌ Delete error:", err.message || err);
            alert("Error deleting department");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="page-content pt-2">
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title mb-4 text-primary">Manage Departments</h4>

                            {/* Add Department */}
                            <div className="row align-items-center g-3 mb-4">
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Dept ID"
                                        value={newDept.jcDept1}
                                        onChange={(e) =>
                                            setNewDept({ ...newDept, jcDept1: e.target.value })
                                        }
                                        style={{ width: "150px" }}
                                    />
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Description"
                                        value={newDept.description}
                                        onChange={(e) =>
                                            setNewDept({ ...newDept, description: e.target.value })
                                        }
                                        style={{ width: "200px" }}
                                    />
                                </div>
                                <div className="col-auto">
                                    <Button color="primary" onClick={handleAdd}>
                                        <i className="ri-add-line me-1 align-bottom"></i> Add Department
                                    </Button>
                                </div>
                            </div>

                            {/* Delete Department */}
                            <div className="row align-items-center g-3 mb-4">
                                <div className="col-auto">
                                    <select
                                        className="form-select"
                                        value={selectedDeptId}
                                        onChange={(e) => setSelectedDeptId(e.target.value)}
                                        style={{ width: "250px" }}
                                    >
                                        <option value="">Select Department to Delete</option>
                                        {departments.map((dept) => (
                                            <option key={dept.jcDept1} value={dept.jcDept1}>
                                                {dept.jcDept1} - {dept.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-auto">
                                    <Button color="danger" className="bg-gradient" onClick={handleDelete}>
                                        <i className="ri-delete-bin-line me-1 align-bottom"></i> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>

    );
}

export default ManageDepartments;
