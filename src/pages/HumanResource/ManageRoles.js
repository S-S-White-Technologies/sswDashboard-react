import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Row, Col, Card, CardBody,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button
} from "reactstrap";
import PreviewCardHeader from '../../Components/Common/PreviewCardHeader';
import { SingleButtonDropdownExample } from '../../../src/pages/BaseUi/UiDropdowns/UiDropdownsCode';
import { api } from "../../config";

function ManageRoles() {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ roleName: "" });
    const [selectedRoleId, setSelectedRoleId] = useState("");

    // Fetch all roles from backend
    const fetchRoles = async () => {
        try {
            const res = await axios.get(`${api.API_URL}role`, { responseType: 'json' }); // optional, depends on backend
            console.log("✅ Fetched Roles:", res);

            if (Array.isArray(res)) {
                setRoles(res);
            } else {
                console.warn("⚠️ Unexpected shape:", res);
                setRoles([]);
            }
        } catch (err) {
            console.error("❌ Error fetching roles:", err.message || err);
            alert("Failed to load roles");
        }
    };


    // Add a new role
    const handleAdd = async () => {
        if (!newRole.roleName.trim()) {
            alert("Please enter a role name.");
            return;
        }

        try {
            console.log("📤 Payload:", newRole);
            await axios.post(`${api.API_URL}role`, newRole);
            setNewRole({ roleName: "" });
            fetchRoles();
        } catch (err) {
            console.error("❌ Error adding role:", err.message || err);
            alert("Failed to add role");
        }
    };

    // Delete selected role
    const handleDelete = async () => {
        if (!selectedRoleId) {
            alert("Please select a role to delete.");
            return;
        }

        try {
            await axios.delete(`${api.API_URL}role/${selectedRoleId}`);
            setSelectedRoleId("");
            fetchRoles();
        } catch (err) {
            console.error("❌ Error deleting role:", err.message || err);
            alert("Failed to delete role");
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div>

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <h4 className="card-title mb-4 text-primary">Manage Roles</h4>

                            {/* Add Role */}
                            <div className="row align-items-center g-3 mb-3">
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter new role name"
                                        value={newRole.roleName}
                                        onChange={(e) =>
                                            setNewRole({ ...newRole, roleName: e.target.value })
                                        }
                                        style={{ width: "250px" }}
                                    />
                                </div>
                                <div className="col-auto">
                                    <Button color="success" onClick={handleAdd}>
                                        <i className="ri-add-line me-1 align-bottom"></i> Add Role
                                    </Button>
                                </div>
                            </div>

                            {/* Delete Role */}
                            <div className="row align-items-center g-3 mb-4">
                                <div className="col-auto">
                                    <select
                                        className="form-select"
                                        value={selectedRoleId}
                                        onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                                        style={{ width: "250px" }}
                                    >
                                        <option value="">Select Role to Delete</option>
                                        {roles.map((role) => (
                                            <option key={role.roleId} value={role.roleId}>
                                                {role.roleName}
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

                            {/* Role Table */}
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Role Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.length > 0 ? (
                                            roles.map((role) => (
                                                <tr key={role.roleId}>
                                                    <td>{role.roleId}</td>
                                                    <td>{role.roleName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center">No roles found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </div>
    );
}

export default ManageRoles;
