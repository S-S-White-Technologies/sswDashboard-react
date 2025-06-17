import React, { useState } from "react";
import { Row, Col, Button, Input, Form, Label, Card, CardBody, Container, Popover, PopoverBody } from "reactstrap";
import Flatpickr from "react-flatpickr";
import logomain from "../../../src/assets/images/logofinal.png"
import axios from "axios";
import jsPDF from 'jspdf/dist/jspdf.umd.min.js'
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";




const HRReportsHourly = () => {
    const [employeeMode, setEmployeeMode] = useState("all");
    const [employeeId, setEmployeeId] = useState("");
    const [loading, setLoading] = useState(false);

    const [dateRange, setDateRange] = useState("");



    const [popoverOpenHourly, setPopoverOpenHourly] = useState(false);
    const [popoverOpenEarlyHourly, setPopoverOpenEarlyHourly] = useState(false);

    const togglePopover = () => {
        setPopoverOpenHourly(prev => {
            if (!prev) setPopoverOpenEarlyHourly(false); // close the other one
            return !prev;
        });
    };

    const togglePopoverEalry = () => {
        setPopoverOpenEarlyHourly(prev => {
            if (!prev) setPopoverOpenHourly(false); // close the other one
            return !prev;
        });
    };

    const handleExport = (type) => {
        setPopoverOpenHourly(false);
        if (type === "excel") {
            handleTodayExcelExport(); // your logic
        } else if (type === "pdf") {
            handleTodayDataClick(); // your logic
        }
    };

    const handleExportEarly = (type) => {
        setPopoverOpenEarlyHourly(false);
        if (type === "excel") {
            handleEarlyLeaveExcelExport(); // your logic
        } else if (type === "pdf") {
            handleEarlyLeaveClick(); // your logic
        }
    };

    //TodayData Excel


    const handleTodayExcelExport = async () => {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        const url =
            employeeMode === "specific" && employeeId.trim()
                ? `https://localhost:7168/api/Reports/daily-report-hourly?empId=${employeeId}&reportDate=${today}`
                : `https://localhost:7168/api/Reports/daily-report-hourly?reportDate=${today}`;

        try {
            const response = await axios.get(url);
            const data = response;

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

    const handleTodayDataClick = async () => {

        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const url =
            employeeMode === "specific" && employeeId.trim()
                ? `https://localhost:7168/api/Reports/daily-report-hourly?empId=${employeeId}&reportDate=${today}`
                : `https://localhost:7168/api/Reports/daily-report-hourly?reportDate=${today}`;

        try {
            const response = await axios.get(url);
            const data = response;

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
            alert("Please select a valid start and end date.");
            setLoading(false);
            return;
        }

        const [startDate, endDate] = dateRange.map(d =>
            d.toISOString().split("T")[0]
        );

        const url =
            employeeMode === "specific" && employeeId.trim()
                ? `https://localhost:7168/api/Reports/early-leave-report-hourly?empId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
                : `https://localhost:7168/api/Reports/early-leave-report-hourly?startDate=${startDate}&endDate=${endDate}`;

        try {
            const response = await axios.get(url);
            const data = response.records || response;

            if (!Array.isArray(data)) {
                console.error("Invalid API response format:", data);
                alert("Failed to generate report. Invalid data format.");
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
            alert("Something went wrong. Please check the console for details.");
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
            alert("Please select a valid start and end date.");
            setLoading(false);
            return;
        }

        const [startDate, endDate] = dateRange.map(d =>
            d.toISOString().split("T")[0]
        );

        const url =
            employeeMode === "specific" && employeeId.trim()
                ? `https://localhost:7168/api/Reports/early-leave-report-hourly?empId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
                : `https://localhost:7168/api/Reports/early-leave-report-hourly?startDate=${startDate}&endDate=${endDate}`;

        try {
            const response = await axios.get(url);
            const records = response.records;

            if (!Array.isArray(records) || records.length === 0) {
                alert("No data found for selected range.");
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
            alert("Something went wrong. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    ///Early Leave Excel End





    return (
        <div style={{
            minHeight: 'calc(100vh - 830px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <Container>
                <Card className="shadow border-0 p-4 position-relative">
                    <CardBody>
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

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="mt-3">
                                        <Label className="text-dark">Please Select Date Range</Label>
                                        <Flatpickr
                                            className="form-control"
                                            value={dateRange}
                                            onChange={selectedDates => setDateRange(selectedDates)}
                                            options={{
                                                mode: "range",
                                                dateFormat: "Y-m-d"
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="mt-3">
                                        <Input
                                            type="radio"
                                            name="employeeMode"
                                            value="all"
                                            checked={employeeMode === "all"}
                                            onChange={() => setEmployeeMode("all")}
                                        /> All Active Employees
                                        <div className="mt-2">
                                            <Input
                                                type="radio"
                                                name="employeeMode"
                                                value="specific"
                                                checked={employeeMode === "specific"}
                                                onChange={() => setEmployeeMode("specific")}
                                            /> Specific Employee
                                            {employeeMode === "specific" && (
                                                <Input
                                                    type="text"
                                                    className="mt-2"
                                                    placeholder="Employee ID"
                                                    value={employeeId}
                                                    onChange={(e) => setEmployeeId(e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
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

                            <Row className="mb-2">
                                <Col className="d-flex flex-wrap gap-2">
                                    <div className="position-relative d-inline-block">
                                        <Button className="btn btn-soft-success"
                                            color="success"
                                            id="todayDataHourly"
                                            onClick={togglePopover}
                                        >
                                            <span classname="text-dark">Today's Data</span>
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenHourly}
                                            target="todayDataHourly"
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
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Early Leave
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarlyHourly}
                                            target="earlyDataHourly"
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

                                    {/* <div className="position-relative d-inline-block">
                                        <Button className="btn btn-soft-success"
                                            color="success"
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Late In
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarly}
                                            target="earlyDataHourly"
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
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Long Lunch
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarly}
                                            target="earlyDataHourly"
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
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Full Report
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarly}
                                            target="earlyDataHourly"
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
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Excel Summary
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarly}
                                            target="earlyDataHourly"
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
                                            id="earlyDataHourly"
                                            onClick={togglePopoverEalry}
                                        >
                                            Absent
                                        </Button>
                                        <Popover
                                            placement="bottom"
                                            isOpen={popoverOpenEarly}
                                            target="earlyDataHourly"
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
                                    </div> */}

                                </Col>


                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export default HRReportsHourly;
