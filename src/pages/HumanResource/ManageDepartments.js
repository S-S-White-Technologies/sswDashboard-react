import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";

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
        <div>
            <h3>Manage Departments</h3>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Dept ID"
                    value={newDept.jcDept1}
                    onChange={(e) => setNewDept({ ...newDept, jcDept1: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newDept.description}
                    onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                />
                <button onClick={handleAdd}>Add Department</button>
            </div>

            <div>
                <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                >
                    <option value="">Select Department to Delete</option>
                    {departments.map(dept => (
                        <option key={dept.jcDept1} value={dept.jcDept1}>
                            {dept.jcDept1} - {dept.description}
                        </option>
                    ))}
                </select>
                <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ManageDepartments;
