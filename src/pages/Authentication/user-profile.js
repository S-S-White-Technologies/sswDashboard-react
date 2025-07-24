import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../slices/thunks";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("admin@gmail.com");
  const [idx, setidx] = useState("1");

  const [userName, setUserName] = useState("Admin");
  const [userImage, setUserImage] = useState("/uploads/user-dummy-img.jpg");
  const { user, success, error } = useSelector(state => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error
  }));
  const [userDetails, setUserDetails] = useState({
    name: "Guest User",
    title: "User",

  });

  useEffect(() => {
    const authData = sessionStorage.getItem("authUser");
    if (authData) {

      const parsed = JSON.parse(authData);
      const imagePath = parsed?.imagePath;
      const name = parsed?.name || "Guest User";  // ✅ not parsed.data.name
      const email = parsed?.email || "emailnotfound@gmail.com";
      const uid = parsed?.uid || "1";
      //setUserImage(`http://172.16.50.19:7168${imagePath}`);
      setUserImage(`https://localhost:7168${imagePath}`);
      setUserDetails({ name, email, uid });
      setUserName(name);
      setemail(email);
      setidx(uid);
    }
  }, []);
  // useEffect(() => {
  //   if (sessionStorage.getItem("authUser")) {
  //     const obj = JSON.parse(sessionStorage.getItem("authUser"));

  //     if (!isEmpty(user)) {
  //       obj.data.name = user.name;
  //       sessionStorage.removeItem("authUser");
  //       sessionStorage.setItem("authUser", JSON.stringify(obj));
  //     }

  //     setUserName(obj.data.name);
  //     setemail(obj.data.email);
  //     setidx(obj.data.uid || "1");

  //     setTimeout(() => {
  //       dispatch(resetProfileFlag());
  //     }, 3000);
  //   }
  // }, [dispatch, user]);



  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name: userName || 'Admin',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">Username Updated To {userName}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={userImage}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || "Admin"}</h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="first_name"
                    // value={name}
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ""}
                    invalid={
                      validation.touched.first_name && validation.errors.first_name ? true : false
                    }
                  />
                  {validation.touched.first_name && validation.errors.first_name ? (
                    <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update User Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
