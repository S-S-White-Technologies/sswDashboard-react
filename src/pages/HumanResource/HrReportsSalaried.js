import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Form, Label, Card, CardBody, FormGroup, Collapse, Container, Popover, PopoverBody } from "reactstrap";
import Flatpickr from "react-flatpickr";
import logomain from "../../../src/assets/images/logofinal.png"
import hrBanner from "../../../src/assets/images/auth-one-bg_old.jpg"
import axios from "axios";
import api from "../../api"
import jsPDF from '../../../node_modules/jspdf/dist/jspdf.umd.min.js'
import { applyPlugin } from 'jspdf-autotable'
import Select, { components } from "react-select";
applyPlugin(jsPDF)
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import ReportButton from "../HumanResource/ReportButton.js"

const HRReportsSalaried = () => {
    const [employeeMode, setEmployeeMode] = useState("all");
    const [employeeId, setEmployeeId] = useState("");
    const [loading, setLoading] = useState(false);

    const [dateRange, setDateRange] = useState("");

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverOpenEarly, setPopoverOpenEarly] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get("department");
                console.log("✅ Department API Response:", res);

                const dataRes = res.data?.value ?? res.value;

                if (!Array.isArray(dataRes)) {
                    throw new Error("Expected 'value' to be an array");
                }

                setDepartments(dataRes);
            } catch (err) {
                console.error("❌ Departments fetch error:", err.message || err);
                alert("Error fetching departments");
            }
        };

        fetchDepartments();
    }, []);

    const togglePopover = () => {
        setPopoverOpen(prev => {
            if (!prev) setPopoverOpenEarly(false);
            return !prev;
        });
    };

    const togglePopoverEalry = () => {
        setPopoverOpenEarly(prev => {
            if (!prev) setPopoverOpen(false);
            return !prev;
        });
    };

    const handleExport = (type) => {
        setPopoverOpen(false);
        if (type === "excel") {
            handleTodayExcelExport();
        } else if (type === "pdf") {
            handleTodayDataClick();
        }
    };

    const handleExportEarly = (type) => {
        setPopoverOpenEarly(false);
        if (type === "excel") {
            handleEarlyLeaveExcelExport();
        } else if (type === "pdf") {
            handleEarlyLeaveClick();
        }
    };

    //TodayData Excel


    const handleTodayExcelExport = async () => {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        // const empIds = selectedEmpIds.map(e => e.value);
        // const params = new URLSearchParams();


        // params.append("reportDate", today);

        // selectedEmpIds.forEach(id => params.append("empIds", id.value));
        // const employeeNames = selectedEmployeeNames.map(e => extractName(e.label));

        // employeeNames.forEach(name => {
        //     params.append("employeeNames", name);
        // });
        // if (selectedDepartmentId) {
        //     params.append("departmentIds", selectedDepartmentId);
        // }
        // const url = `http://localhost:7168/api/Reports/daily-report?${params.toString()}`;
        const params = new URLSearchParams();
        const extractName = (label) => {
            const match = label.match(/^(.+?)\s*\(\d+\)$/);
            return match ? match[1].trim() : label;
        };
        params.append("reportDate", today); // Already set
        selectedEmpIds.forEach(id => params.append("empIds", id.value));
        const employeeNames = selectedEmployeeNames.map(e => extractName(e.label)); // <- watch this
        employeeNames.forEach(name => params.append("employeeNames", name));
        if (selectedDepartmentId) {
            params.append("departmentIds", selectedDepartmentId);
        }
        const url = `https://localhost:7168/api/Reports/daily-report?${params.toString()}`;

        console.log("Final URL: ", url);

        try {
            const response = await axios.get(url);
            const data = response;


            if (!Array.isArray(data) || data.length === 0) {
                toast.error("No today data found!");
                return;
            }

            if (!data || data.length === 0) {
                alert("No data found to export.");
                return;
            }

            const exportRows = [];

            exportRows.push([]);
            exportRows.push(["S S White Technologies Inc"]);
            exportRows.push(["Daily Timecard Report"]);
            exportRows.push([`Report Date: ${new Date().toLocaleDateString()}`]);
            exportRows.push([]);

            data.forEach(emp => {
                exportRows.push([`Employee ID: ${emp.empId}`, `Employee Name: ${emp.name}`]);
                exportRows.push(["Date", "Day", "Time", "Status", "Type"]);

                emp.records.forEach(r => {
                    exportRows.push([
                        r.dateString,
                        r.dayOfWeek,
                        new Date(r.time).toLocaleTimeString(),
                        r.status,
                        r.type,

                    ]);
                });

                exportRows.push(["", "", "", "", "Total Working Hours", emp.totalWorkingTime]);
                exportRows.push([]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(exportRows);
            worksheet["!cols"] = [
                { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }
            ];
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Timecard");

            XLSX.writeFile(workbook, `DailyTimecard_${today}.xlsx`);
        } catch (error) {
            console.error("Excel export failed:", error);
            alert("Excel export failed.");
        } finally {
            setLoading(false);
        }
    };

    //TodayData Excel End

    /// TodayData PDF
    const handleTodayDataClick = async () => {

        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        // const empIds = selectedEmpIds.map(e => e.value); // e.g., ['0001', '0061']
        // const params = new URLSearchParams();
        const params = new URLSearchParams();
        const extractName = (label) => {
            const match = label.match(/^(.+?)\s*\(\d+\)$/);
            return match ? match[1].trim() : label;
        };

        // params.append("reportDate", today);

        // selectedEmpIds.forEach(id => params.append("empIds", id.value));
        // const employeeNames = selectedEmployeeNames.map(e => extractName(e.label));

        // employeeNames.forEach(name => {
        //     params.append("employeeNames", name);
        // });
        // if (selectedDepartmentId) {
        //     params.append("departmentIds", selectedDepartmentId);
        // }
        params.append("reportDate", today); // Already set
        selectedEmpIds.forEach(id => params.append("empIds", id.value));
        const employeeNames = selectedEmployeeNames.map(e => extractName(e.label)); // <- watch this
        employeeNames.forEach(name => params.append("employeeNames", name));
        if (selectedDepartmentId) {
            params.append("departmentIds", selectedDepartmentId);
        }
        const url = `https://localhost:7168/api/Reports/daily-report?${params.toString()}`;

        console.log("Final URL: ", url);

        try {
            const response = await axios.get(url);
            const data = response;


            if (!Array.isArray(data) || data.length === 0) {
                toast.error("No today data found!");
                return;
            }

            const doc = new jsPDF();
            const images = logomain;

            const pageWidth = doc.internal.pageSize.getWidth();
            const imgWidth = 30;
            const imgHeight = 20;
            const xLogo = (pageWidth - imgWidth) / 2;

            doc.addImage(images, "PNG", xLogo, 10, imgWidth, imgHeight);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("S S White Technologies Inc", pageWidth / 2, 35, { align: "center" });

            doc.setLineWidth(0.3);
            doc.line(10, 38, pageWidth - 10, 38);

            const reportDate = new Date(today).toLocaleDateString();
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Report Date: ${reportDate}`, pageWidth - 15, 42, { align: "right" });



            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Daily Timecard Report", pageWidth / 2, 46, { align: "center" });



            let startY = 55;

            if (!Array.isArray(data) || data.length === 0) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(12);
                doc.text("No data found.", 15, startY);
            } else {
                for (const employee of data) {
                    const { empId, name, records, totalWorkingTime } = employee;


                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bold");
                    doc.text(`Employee ID: ${empId}`, 15, startY);
                    doc.text(`Employee Name: ${name}`, 15, startY + 6);

                    // Table: Records
                    const tableStartY = startY + 12;
                    doc.autoTable({
                        head: [["Date", "Day", "Time", "Status", "Type"]],
                        body: records.map(r => [
                            r.dateString,
                            r.dayOfWeek,
                            new Date(r.time).toLocaleTimeString(),
                            r.status,
                            r.type
                        ]),
                        startY: tableStartY,
                        theme: "grid",
                        startY: startY + 12,
                        theme: "grid",
                        margin: { left: 15, right: 15 },
                        didDrawPage: function (data) {



                            const pageHeight = doc.internal.pageSize.height;
                            doc.setFontSize(10);
                            doc.setTextColor(150);
                            doc.text(
                                `Page ${doc.internal.getCurrentPageInfo().pageNumber} of {totalPages}`,
                                pageWidth / 2,
                                pageHeight - 10,
                                { align: 'center' }
                            );
                        },

                    });


                    const tableEndY = doc.lastAutoTable.finalY + 5;
                    doc.setFont("helvetica", "bold");
                    doc.text(`Total Working Hours: ${totalWorkingTime}`, pageWidth - 15, tableEndY, { align: "right" });

                    startY = tableEndY + 10;


                    if (startY > 250) {
                        doc.addPage();
                        startY = 30;

                    }
                }
            }
            doc.putTotalPages("{totalPages}");
            doc.save(`DailyReport_${today}.pdf`);
        } catch (error) {
            console.error("Error generating report:", error);
        }
        finally {
            setLoading(false);
        }
    };
    /// Today data End


    ///Early Leave

    const handleEarlyLeaveClick = async () => {
        setLoading(true);

        if (!dateRange || dateRange.length !== 2) {
            toast.error("Please select a valid date range.");
            setLoading(false);
            return;
        }

        const [startDate, endDate] = dateRange.map(d =>
            d.toISOString().split("T")[0]
        );
        const extractName = (label) => {
            const match = label.match(/^(.+?)\s*\(\d+\)$/);
            return match ? match[1].trim() : label;
        };
        const empIds = selectedEmpIds.map(e => e.value); // ['0001', '0002']
        const params = new URLSearchParams();

        params.append("startDate", startDate);
        params.append("endDate", endDate);

        // Append multiple empIds
        empIds.forEach(id => {
            params.append("empIds", id);
        });

        // Optional filters
        if (selectedDepartmentId) {
            params.append("departmentId", selectedDepartmentId); // e.g., "19"
        }

        const employeeNames = selectedEmployeeNames.map(e => extractName(e.label));

        employeeNames.forEach(name => {
            params.append("employeeNames", name);
        });

        const url = `https://localhost:7168/api/Reports/early-leave-report?${params.toString()}`;



        try {
            const response = await axios.get(url);
            const data = response.records;

            if (!Array.isArray(data) || data.length === 0) {
                toast.error("No data found, Change filter Selection!");
                return;
            }



            const images = logomain;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const reportDate = new Date().toLocaleString();
            const imgWidth = 30;
            const imgHeight = 20;
            const xLogo = (pageWidth - imgWidth) / 2;

            doc.addImage(images, "PNG", xLogo, 10, imgWidth, imgHeight);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("S S White Technologies Inc", pageWidth / 2, 35, { align: "center" });

            doc.setLineWidth(0.3);
            doc.line(10, 38, pageWidth - 10, 38);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Early Leave Report", pageWidth / 2, 46, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Print Date: ${reportDate}`, 15, 54);
            doc.text(`Report Range: ${startDate} - ${endDate}`, 15, 60);

            let startY = 68;


            const grouped = groupBy(data, r => `${r.name} - ${r.empId}`);

            for (const [empKey, rows] of Object.entries(grouped)) {
                const [name, empId] = empKey.split(" - ");

                doc.setFont("helvetica", "bold");
                doc.text(name || "N/A", 15, startY);
                doc.text(empId || "-", pageWidth - 15, startY, { align: "right" });

                startY += 6;

                doc.autoTable({
                    head: [["Day", "Date", "Time", "Status", "Type"]],
                    body: rows.map(r => [
                        r.dayOfWeek || "-",
                        r.dateString || "-",
                        r.time ? new Date(r.time).toLocaleTimeString() : r.timeString || "-",
                        r.status || "-",
                        r.type || "-"
                    ]),
                    startY,
                    margin: { left: 15, right: 15 },
                    theme: "grid",
                    styles: { fontSize: 9 },
                });

                startY = doc.lastAutoTable.finalY + 10;

                if (startY > 250) {
                    doc.addPage();
                    startY = 30;
                }
            }


            doc.save("EarlyLeaveReport.pdf");
        } catch (err) {
            console.error("Early leave report failed", err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    function groupBy(arr, keyFn) {
        return arr.reduce((acc, item) => {
            const key = keyFn(item);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }



    ///Early Leave End

    ///Early Leave Excel


    const handleEarlyLeaveExcelExport = async () => {
        setLoading(true);

        if (!dateRange || dateRange.length !== 2) {
            toast.error("Please select a valid date range.");
            setLoading(false);
            return;
        }

        const [startDate, endDate] = dateRange.map(d =>
            d.toISOString().split("T")[0]
        );
        const extractName = (label) => {
            const match = label.match(/^(.+?)\s*\(\d+\)$/);
            return match ? match[1].trim() : label;
        };
        const empIds = selectedEmpIds.map(e => e.value); // ['0001', '0002']
        const params = new URLSearchParams();

        params.append("startDate", startDate);
        params.append("endDate", endDate);

        // Append multiple empIds
        empIds.forEach(id => {
            params.append("empIds", id);
        });

        // Optional filters
        if (selectedDepartmentId) {
            params.append("departmentId", selectedDepartmentId); // e.g., "19"
        }

        const employeeNames = selectedEmployeeNames.map(e => extractName(e.label));

        employeeNames.forEach(name => {
            params.append("employeeNames", name);
        });

        const url = `https://localhost:7168/api/Reports/early-leave-report?${params.toString()}`;



        try {
            const response = await axios.get(url);
            const records = response.records;

            if (!Array.isArray(records) || records.length === 0) {
                toast.error("No data found, Change filter Selection!");
                return;
            }

            // Group by employee
            const groupBy = (arr, keyFn) => {
                return arr.reduce((acc, item) => {
                    const key = keyFn(item || {});
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                }, {});
            };

            const grouped = groupBy(records, r => `${r?.name || "Unknown"} - ${r?.empId || "N/A"}`);

            const wb = XLSX.utils.book_new();
            const wsData = [];

            wsData.push([`Report Date Range:`, `${startDate} to ${endDate}`]);
            wsData.push([]);

            for (const [empKey, rows] of Object.entries(grouped)) {
                const [name = "Unknown", empId = "N/A"] = empKey.split(" - ");

                wsData.push([`Employee Name:`, name]);
                wsData.push([`Employee ID:`, empId]);
                wsData.push([]);
                wsData.push(["Day", "Date", "Time", "Status", "Type"]);

                rows.forEach(row => {
                    wsData.push([
                        row?.dayOfWeek || "-",
                        row?.dateString || "-",
                        row?.time ? new Date(row.time).toLocaleTimeString() : row?.timeString || "-",
                        row?.status || "-",
                        row?.type || "-"
                    ]);
                });

                wsData.push([], []); // Add spacing between employees
            }

            // Create a single worksheet from combined data
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, "Early Leave Report");

            // Export to file
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, `EarlyLeaveReport_${startDate}_to_${endDate}.xlsx`);

        } catch (err) {
            console.error("Early leave Excel export failed", err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    ///Early Leave Excel End

    const [selectedMulti2, setselectedMulti2] = useState(null);
    const [SingleOptions, setSingleOptions] = useState([]);
    const [employeeIdOptions, setEmployeeIdOptions] = useState([]);

    useEffect(() => {
        api.get("WhosInBuilding/userList")
            .then((res) => {
                const data = res.data;

                // Employee Name dropdown
                const names = data.map(user => ({
                    value: user.empId,
                    label: `${user.name} (${user.empId})`
                }));

                // Employee ID dropdown
                const ids = data.map(user => ({
                    value: user.empId,
                    label: user.empId
                }));

                setSingleOptions(names);
                setEmployeeIdOptions(ids);
            })
            .catch((err) => {
                console.error("Error fetching employee list:", err);
            });
    }, []);

    function handleMulti2(selectedMulti2) {
        setselectedMulti2(selectedMulti2);
    }

    const CustomMenuList = (props) => {
        return (
            <>
                <div className="d-flex justify-content-between px-2 pt-2 pb-1 border-bottom">
                    <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => props.setValue(props.options)}
                    >
                        Check All
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => props.setValue([])}
                    >
                        Clear
                    </button>
                </div>
                <components.MenuList {...props}>{props.children}</components.MenuList>
            </>
        );
    };
    const customSelectStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: 'white',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'white',
        }),
    };


    const [selectedEmpIds, setSelectedEmpIds] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div style={{ minHeight: 'calc(100vh - 830px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Container fluid>
                <Card className="mb-4">
                    <CardBody className="p-0">
                        <div className="bg-overlay"></div>
                        <img
                            src={hrBanner}
                            alt="HR Banner"
                            className="img-fluid w-100"
                            style={{

                                width: '100%',
                                height: 'auto',
                                maxHeight: "180px",
                                objectFit: 'cover'
                            }}

                        />
                    </CardBody>
                </Card>

                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center shadow-sm">
                            <CardBody>
                                <h6>Total Employees</h6>
                                <h4 className="text-primary">157</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow-sm">
                            <CardBody>
                                <h6>Late In Today</h6>
                                <h4 className="text-warning">28</h4>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow-sm">
                            <CardBody>
                                <h6>Early Leave</h6>
                                <h4 className="text-danger">54</h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Form>
                    {/* <Row className="custom-accordionwithicon accordion-secondary">
                                <Col md={12}>
                                    <blockquote className="blockquote border-start border-4 border-success ps-3 rounded mb-0">
                                        <p className="text-dark mb-2">Note *</p>
                                        <footer className="blockquote-footer text-muted mt-0">Early Leave: Out for day earlier than <cite>04:30pm</cite></footer>
                                        <footer className="blockquote-footer text-muted mt-0">Late In: In for the day after <cite>08:00am</cite></footer>
                                        <footer className="blockquote-footer text-muted mt-0">Long Lunch: Greater than <cite>50 minutes</cite></footer>
                                    </blockquote>
                                </Col>
                            </Row> */}
                    <div className="border rounded p-3 shadow-sm ">
                        <Row>
                            <Col md={3}>
                                <FormGroup>
                                    <Label className="text-dark">Please Select Date Range</Label>
                                    <Flatpickr
                                        className="form-control"
                                        value={dateRange}
                                        onChange={selectedDates => setDateRange(selectedDates)}
                                        options={{ mode: "range", dateFormat: "Y-m-d" }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <Label htmlFor="choices-multiple-remove-button" className="form-label text-dark">Employee Name</Label>
                                    <Select
                                        value={selectedEmployeeNames}
                                        isMulti={true}
                                        isClearable={true}
                                        onChange={(selected) => setSelectedEmployeeNames(selected || [])}
                                        options={SingleOptions}
                                        styles={customSelectStyles}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <Label>Department</Label>
                                    <Input
                                        type="select"
                                        value={selectedDepartmentId}
                                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        {departments?.map((dept) => (
                                            <option key={dept.jcDept1} value={dept.jcDept1}>
                                                {dept.jcDept1} - {dept.description}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <Label htmlFor="empIdSelect" className="form-label text-dark">Employee ID</Label>
                                    <Select
                                        id="empIdSelect"
                                        isMulti
                                        isClearable
                                        isSearchable
                                        options={employeeIdOptions}
                                        value={selectedEmpIds}
                                        onChange={setSelectedEmpIds}
                                        components={{ MenuList: (props) => <CustomMenuList {...props} setValue={setSelectedEmpIds} /> }}
                                        setValue={setSelectedEmpIds}
                                        styles={customSelectStyles}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={12} className="d-flex flex-wrap gap-5">
                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-success"
                                        color="success"
                                        id="todayData"
                                        onClick={togglePopover}
                                    >
                                        <span classname="text-dark">Today's Data</span>
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpen}
                                        target="todayData"
                                        toggle={togglePopover}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExport("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExport("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>

                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-success"
                                        color="success"
                                        id="earlyData"
                                        onClick={togglePopoverEalry}
                                    >
                                        Early Leave
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpenEarly}
                                        target="earlyData"
                                        toggle={togglePopoverEalry}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>

                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-success"
                                        color="success"
                                        id="earlyData"
                                        onClick={togglePopoverEalry}
                                    >
                                        Late In
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpenEarly}
                                        target="earlyData"
                                        toggle={togglePopoverEalry}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>


                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-success"
                                        color="success"
                                        id="earlyData"
                                        onClick={togglePopoverEalry}
                                    >
                                        Full Report
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpenEarly}
                                        target="earlyData"
                                        toggle={togglePopoverEalry}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>

                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-success"
                                        color="success"
                                        id="earlyData"
                                        onClick={togglePopoverEalry}
                                    >
                                        Excel Summary
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpenEarly}
                                        target="earlyData"
                                        toggle={togglePopoverEalry}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>
                                <div className="position-relative d-inline-block">
                                    <Button className="btn btn-soft-danger"
                                        color="danger"
                                        id="earlyData"
                                        onClick={togglePopoverEalry}
                                    >
                                        Absent
                                    </Button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={popoverOpenEarly}
                                        target="earlyData"
                                        toggle={togglePopoverEalry}
                                        container="body"
                                    >
                                        <PopoverBody className="d-flex flex-column gap-2">
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("excel")}>
                                                📊 Export Excel
                                            </Button>
                                            <Button size="sm" color="light" onClick={() => handleExportEarly("pdf")}>
                                                📄 Export PDF
                                            </Button>
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row className="mb-3">
                        <Col md={6}>

                        </Col>
                    </Row>


                    {loading && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                backgroundColor: "rgba(255,255,255,0.6)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999,
                            }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                </Form>
                {/* </CardBody>
                </Card> */}
            </Container>
        </div>
    );
};

export default HRReportsSalaried;
