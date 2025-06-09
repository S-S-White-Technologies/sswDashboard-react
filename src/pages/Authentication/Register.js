import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Row, Col, CardBody, Card, Alert, Button, Modal, ModalBody, ModalHeader, Container, Input, Label, Form, FormFeedback } from "reactstrap";
import axios from "axios";
import api from "../../config/api";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, apiError, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/logofinal.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const Register = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        roleId: ""
    });
    const [previewImage, setPreviewImage] = React.useState(logoLight);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    //For the Supervisor and Department
    const [departments, setDepartments] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [nextEmpId, setNextEmpId] = useState("");
    const [roles, setRoles] = useState([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const tog_backdrop = () => setmodal_backdrop(!modal_backdrop);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get("https://localhost:7168/api/registration/departments");
                setDepartments(res);
            } catch (err) {
                console.error("⚠️ Departments fetch error:", err.message || err);
                toast.error("Unable to load Departments. Please try again later!");
            }
        };

        const fetchSupervisors = async () => {
            try {
                const res = await axios.get("https://localhost:7168/api/registration/supervisors");
                setSupervisors(res);
            } catch (err) {
                console.error("⚠️ Supervisors fetch error:", err.message || err);
                toast.error("Unable to load Supervisors. Please try again later!");
            }
        };

        const fetchNextEmpId = async () => {
            try {
                const res = await axios.get("https://localhost:7168/api/registration/next-empid");
                setNextEmpId(res);
            } catch (err) {
                console.error("⚠️ Next EmpID fetch error:", err.message || err);
                toast.error("Unable to get Next Employee ID!");
                setErrorModalOpen(true);
            }
        };

        const fetchRoles = async () => {
            try {
                const res = await axios.get("https://localhost:7168/api/registration/roles");
                setRoles(res);
            } catch (err) {
                console.error("⚠️ Roles fetch error:", err.message || err);
                toast.error("Unable to load Roles. Please try again later!");
            }
        };

        // Call all methods here
        fetchDepartments();
        fetchSupervisors();
        fetchNextEmpId();
        fetchRoles();

    }, []);





    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            empId: '',
            email: '',
            first_name: '',
            last_name: '',
            title: '',
            departmentId: '',
            supervisorId: '',
            roleId: '',
            password: '',
            mi: '',
            gender: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postalcode: '',
            phone: '',
            emgcontact: '',
            expensecode: '',
            department: '',
            supervisor: '',
            shift: '',
            hireDate: '',
            type: '',
            epolimit: '',
            FtoOffset: '',

        },
        validationSchema: Yup.object({
            email: Yup.string().email().required("Please Enter Your Email"),
            first_name: Yup.string().required("Please Enter Your First Name"),
            last_name: Yup.string().required("Please Enter Your Last Name"),
            title: Yup.string().required("Please Enter Title"),
            roleId: Yup.string()
                .notOneOf(["", "Select Role"], "Please Select Role")
                .required("Please Select Role"),
            password: Yup.string().min(6).required("Please Enter Password"),
            gender: Yup.string()
                .notOneOf(["", "Select Gender"], "Please Select Gender")
                .required("Please Select Gender"),
            address1: Yup.string().required("Please Enter Street Line 1"),
            address2: Yup.string().required("Please Enter Street Line 2"),
            city: Yup.string().required("Please Enter City"),
            state: Yup.string().required("Please Enter State"),
            postalcode: Yup.string().required("Please Enter PIN Code"),
            phone: Yup.string().required("Please Enter Phone"),
            emgcontact: Yup.string().required("Please Enter Emergency Phone"),
            expensecode: Yup.string()
                .notOneOf(["", "Select Expense Code"], "Please Select Expense Code")
                .required("Please Select Expense Code"),
            department: Yup.string()
                .notOneOf(["", "Select Department"], "Please Select Department")
                .required("Please Select Department"),
            supervisor: Yup.string()
                .notOneOf(["", "Select Supervisor"], "Please Select Supervisor")
                .required("Please Select Supervisor"),
            shift: Yup.string()
                .notOneOf(["", "Select Shift"], "Please Select Shift")
                .required("Please Select Shift"),
            hireDate: Yup.string().required("Hire Date is required"),
            type: Yup.string()
                .notOneOf(["", "Select Type"], "Please Select Type")
                .required("Please Select Type"),
        }),
        onSubmit: async (values, { resetForm }) => {

            const expenseCodeValue = validation.values.expensecode === "Salary" ? "IDL" : "DL";

            const payload = {
                empID: nextEmpId,
                firstName: validation.values.first_name,
                mi: validation.values.mi,
                lastName: validation.values.last_name,
                street1: validation.values.address1,
                street2: validation.values.address2,
                city: validation.values.city,
                state: validation.values.state,
                zip: validation.values.postalcode,
                country: "USA",
                phone: validation.values.phone,
                emgContact: validation.values.emgcontact,
                expenseCode: expenseCodeValue,
                dept: validation.values.department,
                supervisor: validation.values.supervisor,
                shift: parseInt(validation.values.shift, 10),
                hireDate: validation.values.hireDate,
                type: validation.values.type,
                roleId: parseInt(validation.values.roleId, 10),
                epoLimit: 0,
                grade: 0,
                rate: 0,
                empStatus: "A",
                extension: "",
                email: validation.values.email,
                windowsID: validation.values.windowsID || "",
                title: validation.values.title,
                companyCell: "",
                gender: validation.values.gender,
                ftoOffset: 0,
                password: validation.values.password,

            };


            console.log("Submitting payload: ", JSON.stringify(payload, null, 2));

            try {
                const response = await api.post("registration/add-employee", payload);

                if (response.status === 200 || response.status === 201) {
                    setmodal_backdrop(true);
                    resetForm();
                } else {
                    toast.error("Registration Error!");
                }
            } catch (error) {
                toast.error("Registration Error! Server not reachable.");
            }
        }


    });


    document.title = "SSW Dashboard Sign-up";

    return (
        <React.Fragment>

            <Container fluid>
                <Row>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                        className="needs-validation"
                        action="#"
                    >
                        <Card>
                            <CardBody className="p-4">


                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Emp.ID</Label>
                                            <Input type="text" name="empid" value={nextEmpId} readOnly />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label for="roleId">Select Role</Label>
                                            <Input
                                                type="select"
                                                name="roleId"
                                                id="roleId"
                                                value={validation.values.roleId}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.roleId && validation.errors.roleId ? true : false}

                                            >
                                                <option value="">Select Role</option>
                                                {roles?.map((role) => (
                                                    <option key={role.roleId} value={role.roleId}>
                                                        {role.roleName}
                                                    </option>
                                                ))}
                                            </Input>
                                            {validation.touched.roleId && validation.errors.roleId ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.roleId}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label htmlFor="first_name" className="form-label">First Name <span className="text-danger">*</span></Label>
                                            <Input type="text" id="firstname" name="first_name" placeholder="Enter First Name"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.first_name || ""}
                                                invalid={
                                                    validation.touched.first_name && validation.errors.first_name ? true : false
                                                }
                                            />
                                            {validation.touched.first_name && validation.errors.first_name ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.first_name}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Middle Name</Label>
                                            <Input type="text" id="mi" name="middle_name" placeholder="Enter Initial"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.middle_name || ""}
                                                invalid={
                                                    validation.touched.middle_name && validation.errors.middle_name ? true : false
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label htmlFor="last_name" className="form-label">Last Name <span className="text-danger">*</span></Label>
                                            <Input type="text" id="lastname" name="last_name" placeholder="Enter Last Name"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.last_name || ""}
                                                invalid={
                                                    validation.touched.last_name && validation.errors.last_name ? true : false
                                                }
                                            />
                                            {validation.touched.last_name && validation.errors.last_name ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.last_name}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Gender</Label>
                                            <Input type="select" name="gender"

                                                value={validation.values.gender}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.gender && validation.errors.gender ? true : false}
                                            >
                                                <option>Select Gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Trans</option>
                                            </Input>
                                            {validation.touched.gender && validation.errors.gender ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.gender}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className="mb-3">
                                            <Label>Address Line 1</Label>
                                            <Input type="text" name="address1" placeholder="Street Line 1"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.address1 || ""}
                                                invalid={
                                                    validation.touched.address1 && validation.errors.address1 ? true : false
                                                }
                                            />
                                            {validation.touched.address1 && validation.errors.address1 ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.address1}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={5}>
                                        <div className="mb-3">
                                            <Label>Address Line 2</Label>
                                            <Input type="text" name="address2" placeholder="Street Line 2"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.address2 || ""}
                                                invalid={
                                                    validation.touched.address2 && validation.errors.address2 ? true : false
                                                }
                                            />
                                            {validation.touched.address2 && validation.errors.address2 ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.address2}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>City</Label>
                                            <Input type="text" name="city" placeholder="Enter City"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.city || ""}
                                                invalid={
                                                    validation.touched.city && validation.errors.city ? true : false
                                                }
                                            />
                                            {validation.touched.city && validation.errors.city ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.city}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>State</Label>
                                            <Input type="text" name="state" placeholder="Enter State"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.state || ""}
                                                invalid={
                                                    validation.touched.state && validation.errors.state ? true : false
                                                }
                                            />
                                            {validation.touched.state && validation.errors.state ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.state}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Postal Code</Label>
                                            <Input type="text" name="postalcode" placeholder="Enter Six digit Postal code"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.postalcode || ""}
                                                invalid={
                                                    validation.touched.postalcode && validation.errors.postalcode ? true : false
                                                }
                                            />
                                            {validation.touched.postalcode && validation.errors.postalcode ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.postalcode}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label>Phone</Label>
                                            <Input type="text" name="phone" placeholder="Enter Phone"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.phone || ""}
                                                invalid={
                                                    validation.touched.phone && validation.errors.phone ? true : false
                                                }
                                            />
                                            {validation.touched.phone && validation.errors.phone ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.phone}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label>Emergency Contact</Label>
                                            <Input type="text" name="emgcontact" placeholder="Enter Alternate Phone"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.emgcontact || ""}
                                                invalid={
                                                    validation.touched.emgcontact && validation.errors.emgcontact ? true : false
                                                }
                                            />
                                            {validation.touched.emgcontact && validation.errors.emgcontact ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.emgcontact}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Expense Code</Label>
                                            <Input type="select" name="expensecode"
                                                value={validation.values.expensecode}
                                                onBlur={validation.handleBlur}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.expensecode && validation.errors.expensecode ? true : false}
                                            >
                                                <option>Select Expense Code</option>
                                                <option>Salary</option>
                                                <option>Hourly</option>
                                            </Input>
                                            {validation.touched.expensecode && validation.errors.expensecode ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.expensecode}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <Label>Department</Label>
                                            <Input type="select" name="department"
                                                value={validation.values.department}
                                                onBlur={validation.handleBlur}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.department && validation.errors.department ? true : false}
                                            >
                                                <option value="">Select Department</option>
                                                {departments?.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.description}
                                                    </option>
                                                ))}
                                            </Input>
                                            {validation.touched.department && validation.errors.department ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.department}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={4}>
                                        <div className="mb-3">
                                            <Label>Supervisor</Label>
                                            <Input type="select" name="supervisor"
                                                value={validation.values.supervisor}
                                                onBlur={validation.handleBlur}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.supervisor && validation.errors.supervisor ? true : false}>
                                                <option value="">Select Supervisor</option>
                                                {supervisors?.map((sup) => (
                                                    <option key={sup.empId} value={sup.empId}>
                                                        {sup.name}
                                                    </option>
                                                ))}
                                            </Input>
                                            {validation.touched.supervisor && validation.errors.supervisor ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.supervisor}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Shift</Label>
                                            <Input type="select" name="shift"
                                                value={validation.values.shift}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.shift && validation.errors.shift ? true : false}
                                            >
                                                <option>Select Shift</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </Input>
                                            {validation.touched.shift && validation.errors.shift ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.shift}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter email address"
                                                type="email"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.email || ""}
                                                invalid={
                                                    validation.touched.email && validation.errors.email ? true : false
                                                }
                                            />
                                            {validation.touched.email && validation.errors.email ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Label className="form-label" htmlFor="password-input">Password<span className="text-danger">*</span></Label>
                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                            <Input
                                                name="password"
                                                value={validation.values.password || ""}
                                                type={passwordShow ? "text" : "password"}
                                                className="form-control pe-5"
                                                placeholder="Enter Password"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                invalid={
                                                    validation.touched.password && validation.errors.password ? true : false
                                                }
                                            />
                                            {validation.touched.password && validation.errors.password ? (
                                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                            ) : null}
                                            <div className="mb-3">
                                                <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                            </div>

                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label htmlFor="title" className="form-label">Title (Designation)<span className="text-danger">*</span></Label>
                                            <Input type="text" id="title" name="title" placeholder="Enter Designation"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.title || ""}
                                                invalid={
                                                    validation.touched.title && validation.errors.title ? true : false
                                                }
                                            />
                                            {validation.touched.title && validation.errors.title ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.title}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="mb-3">
                                            <Label className="form-label">Hire Date</Label>
                                            <Flatpickr
                                                className={`form-control ${validation.touched.hireDate && validation.errors.hireDate ? "is-invalid" : ""}`}
                                                name="hireDate"
                                                value={validation.values.hireDate}
                                                onChange={(date) => {
                                                    validation.setFieldValue("hireDate", date[0]?.toISOString() || "");
                                                }}
                                                options={{
                                                    enableTime: true,
                                                    dateFormat: "Y-m-d H:i",
                                                }}
                                            />
                                            {validation.touched.hireDate && validation.errors.hireDate && (
                                                <div className="invalid-feedback d-block">
                                                    {validation.errors.hireDate}
                                                </div>
                                            )}
                                        </div>

                                    </Col>



                                </Row>

                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label>Employement Type</Label>
                                            <Input type="select" name="type"
                                                value={validation.values.type}
                                                onChange={validation.handleChange}
                                                invalid={validation.touched.type && validation.errors.type ? true : false}
                                            >
                                                <option>Select Type</option>
                                                <option>Temp Worker</option>
                                                <option>Factory Worker</option>
                                                <option>Staff</option>
                                                <option>Management</option>
                                            </Input>
                                            {validation.touched.type && validation.errors.type ? (
                                                <FormFeedback type="invalid"><div>{validation.errors.type}</div></FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label className="form-label">FTO Offset</Label>
                                            <Input type="text" name="ftooffset" placeholder="0" />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div>
                                            <Label className="form-label">EPO Limit</Label>
                                            <Input type="text" name="epolimit" placeholder="0" />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Label htmlFor="profilePic" className="form-label">Upload Image</Label>
                                            <Input
                                                type="file"
                                                id="profilePic"
                                                name="profilePic"
                                                onChange={handleFileChange} // optional if you want to preview or handle upload
                                                accept="image/*"
                                            />
                                        </div>
                                    </Col>


                                </Row>
                                <Row>
                                    <Col md={2}>
                                        <div className="mb-3">

                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                                />
                                            ) : (
                                                <div className="text-muted">No image selected</div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>



                                <button className="btn btn-success w-10 mt-3" type="submit">Add Employee</button>

                            </CardBody>
                        </Card>
                    </Form>


                    <Modal isOpen={errorModalOpen} centered size="lg" backdrop="static">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">⚠️ Server Error</h5>
                        </div>
                        <div className="modal-body text-center">
                            <h2 className="text-danger mb-4">Something Went Wrong!</h2>
                            <p className="fs-5">We are unable to connect to the server right now. <br />Please try again later.</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <Button color="danger" size="lg" onClick={() => history("/")}>
                                Go Back to Dashboard
                            </Button>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={modal_backdrop}
                        toggle={tog_backdrop}
                        backdrop="static"
                        id="staticBackdrop"
                        centered
                    >
                        <ModalHeader>
                            <h5 className="modal-title" id="staticBackdropLabel">Success</h5>
                        </ModalHeader>
                        <ModalBody className="text-center p-5">
                            <lord-icon
                                src="https://cdn.lordicon.com/lupuorrc.json"
                                trigger="loop"
                                colors="primary:#121331,secondary:#08a88a"
                                style={{ width: "120px", height: "120px" }}>
                            </lord-icon>

                            <div className="mt-4">
                                <h4 className="mb-3">Employee Registered!</h4>
                                <p className="text-muted mb-4">You have successfully added a new employee. 🎉</p>
                                <div className="hstack gap-2 justify-content-center">
                                    <Button color="success" onClick={() => {
                                        setmodal_backdrop(false);
                                        history("/login"); // Redirect if needed
                                    }}>
                                        Go to Login
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>




                </Row>


                {/* <Row className="justify-content-center">
                            <Col md={12} lg={12} xl={18}>
                                <Card className="mt-4" >

                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Add New Employee</h5>
                                            <p className="text-muted"></p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        Email has been Register Before, Please Use Another Email Address... </div></Alert>
                                                ) : null}

                                                
                                                    <div className="mb-3" >
                                                        <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Enter email address"
                                                            type="email"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.email || ""}
                                                            invalid={
                                                                validation.touched.email && validation.errors.email ? true : false
                                                            }
                                                        />
                                                        {validation.touched.email && validation.errors.email ? (
                                                            <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                        ) : null}

                                                    </div>
                                                
                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="first_name"
                                                        type="text"
                                                        placeholder="Enter username"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.first_name || ""}
                                                        invalid={
                                                            validation.touched.first_name && validation.errors.first_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.first_name && validation.errors.first_name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.first_name}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password || ""}
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-2">
                                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.confirm_password || ""}
                                                        invalid={
                                                            validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                              

                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type="submit">Sign Up</button>
                                                </div>

                                                
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                
                            </Col>
                        </Row> */}
            </Container>


        </React.Fragment>
    );
};

export default Register;
