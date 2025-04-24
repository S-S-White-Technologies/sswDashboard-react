import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";
import axios from "axios";

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

    useEffect(() => {
        axios.get("https://localhost:7168/api/registration/departments")
            .then((res) => setDepartments(res))
            .catch((err) => console.error("Departments fetch error", err));
        console.log("departments", departments);

        axios
            .get("https://localhost:7168/api/registration/supervisors")
            .then((res) => setSupervisors(res))
            .catch((err) => console.error("Supervisors fetch error", err));

    }, []);
    //End Supervisor and Department
    //next-employee ID
    const [nextEmpId, setNextEmpId] = useState("");

    useEffect(() => {
        axios.get("https://localhost:7168/api/registration/next-empid")
            .then((res) => {
                console.log("Next EmpID response 👉", res.data); // Should log 3346
                setNextEmpId(res); // res.data is 3346
            })
            .catch((err) => {
                console.error("Error fetching next EmpID:", err);
            });
    }, []);

    //End next emp-Id
    const [passwordShow, setPasswordShow] = useState(false);
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: '',
            first_name: '',
            last_name: '',
            title: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            first_name: Yup.string().required("Please Enter Your First Name"),
            last_name: Yup.string().required("Please Enter Your Last Name"),
            title: Yup.string().required("Please Enter Title"),
            password: Yup.string().required("Please Enter Password"),

        }),
        onSubmit: (values) => {
            dispatch(registerUser(values));
        }
    });

    const { error, success } = useSelector(state => ({
        success: state.Account.success,
        error: state.Account.error
    }));

    useEffect(() => {
        dispatch(apiError(""));
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);

    document.title = "SSW Dashboard Sign-up";

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="120" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-35 fw-medium" style={{ fontSize: "25px", color: "#070161" }}>
                                        SS White Technologies Inc.
                                    </p>

                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">

                            <Card>
                                <div className="text-center mt-2">
                                    <p className="mt-3 fs-35 fw-medium" style={{ fontSize: "15px", color: "#070161" }}>
                                        Add New Employee
                                    </p>
                                    <hr className="mx-auto mb-3" style={{ width: "100", borderTop: "2px solidrgb(201, 203, 206)" }} />
                                    <p className="text-muted"></p>
                                </div>

                                <Form


                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                    }}
                                    className="needs-validation" action="#">

                                    {success && success ? (
                                        <>
                                            {toast("You're Redirect To Login Page...", { position: "top-right", hideProgressBar: true, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                            <ToastContainer autoClose={2000} limit={1} />
                                            <Alert color="success">
                                                Register User Successfully and Your Redirect To Login Page...
                                            </Alert>
                                        </>
                                    ) : null}

                                    {error && error ? (
                                        <>
                                            {toast("Registration Error...", { position: "top-right", hideProgressBar: true, className: 'bg-danger text-white', progress: undefined, toastId: "" })}
                                            <ToastContainer autoClose={2000} limit={1} />
                                            <Alert color="danger">
                                                Something Went wrong!
                                            </Alert>
                                        </>
                                    ) : null}
                                    <CardBody className="p-4">


                                        <Row>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>Emp.ID</Label>
                                                    <Input type="text" name="empid" value={nextEmpId} readOnly />
                                                </div>
                                            </Col>

                                            <Col md={4}>
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
                                                    <Input type="text" name="middle_name" placeholder="Enter Initial" />
                                                </div>
                                            </Col>
                                            <Col md={4}>
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
                                                    <Input type="select" name="gender">
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Trans</option>
                                                    </Input>
                                                </div>
                                            </Col>
                                            <Col md={5}>
                                                <div className="mb-3">
                                                    <Label>Address Line 1</Label>
                                                    <Input type="text" name="address1" placeholder="Street Line 1" />
                                                </div>
                                            </Col>

                                            <Col md={5}>
                                                <div className="mb-3">
                                                    <Label>Address Line 2</Label>
                                                    <Input type="text" name="address2" placeholder="Street Line 2" />
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>City</Label>
                                                    <Input type="text" name="city" placeholder="Enter City" />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>State</Label>
                                                    <Input type="text" name="state" placeholder="Enter State" />
                                                </div>
                                            </Col>

                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>Postal Code</Label>
                                                    <Input type="text" name="postalcode" placeholder="Enter Six digit Postal code" />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label>Phone</Label>
                                                    <Input type="text" name="phone" placeholder="Enter Phone" />
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                <div className="mb-3">
                                                    <Label>Emergency Contact</Label>
                                                    <Input type="text" name="emergency_contact" placeholder="Enter Alternate Phone" />
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>Expense Code</Label>
                                                    <Input type="select" name="expensecode">
                                                        <option>Salary</option>
                                                        <option>Hourly</option>
                                                    </Input>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label>Department</Label>
                                                    <Input type="select" name="department">
                                                        <option value="">Select Department</option>
                                                        {departments?.map((dept, index) => (
                                                            <option key={index} value={dept}>{dept}</option>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label>Supervisor</Label>
                                                    <Input type="select" name="supervisor">
                                                        <option value="">Select Supervisor</option>
                                                        {supervisors?.map((sup) => (
                                                            <option key={sup.empId} value={sup.empId}>
                                                                {sup.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </Col>

                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>Shift</Label>
                                                    <Input type="select" name="shift">
                                                        <option>1</option>
                                                        <option>2</option>
                                                        <option>3</option>
                                                    </Input>
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
                                                        className="form-control"
                                                        options={{
                                                            enableTime: true,
                                                            dateFormat: "Y-m-d H:i",
                                                        }}
                                                    />
                                                </div>
                                            </Col>



                                        </Row>

                                        <Row>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label>Type</Label>
                                                    <Input type="select" name="type">
                                                        <option>Temp Worker</option>
                                                        <option>Factory Worker</option>
                                                        <option>Staff</option>
                                                        <option>Management</option>
                                                    </Input>
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
                                </Form>
                            </Card>

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
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
