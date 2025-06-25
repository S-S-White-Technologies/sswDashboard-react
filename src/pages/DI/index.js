import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  UncontrolledTooltip,
  UncontrolledAlert,
  Tooltip,
} from "reactstrap";
import { Link, redirect } from "react-router-dom";
import classnames from "classnames";
import {  CenteredModalExample } from '../BaseUi/UiModals/UiModalCode';

import { ToastContainer, toast } from "react-toastify";

import api from "../../config/api";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//  FLAGS AND ICONS IMPORTED

import indiaflag from "../../assets/images/indiaflag.png";
import usflag from "../../assets/images/usflag.png";
import add from "../../assets/images/add.png";
import excel from "../../assets/images/excel.png";
import leftarrow from "../../assets/images/leftarrow.png";
import rightarrow from "../../assets/images/rightarrow.png";
import inspectall from "../../assets/images/inspectall.png";
import { current } from "@reduxjs/toolkit";
import { input } from "@testing-library/user-event/dist/cjs/event/input.js";
import { set } from "lodash";
import { clear } from "@testing-library/user-event/dist/cjs/utility/clear.js";

const DI = () => {
  document.title = "SSW Technologies Dashboard";
  const [placeholder, setPlaceholder] = useState("");
  const [inputJob, setInputJob] = useState("");
  const [inputOption, setInputOption] = useState("");
  const [PartNumber, setPartNumber] = useState("");
  const [AssemblyNumber, setAssemblyNumber] = useState("0");
  const [modal_center, setmodal_center] = useState(false);
  const [jobexisterror, setjobexisterror]= useState("");
  const [countrycode, setcountrycode]= useState("");

  function tog_center() {
        setmodal_center(!modal_center);
    }

useEffect(() => {

      console.log("Triggered")
      if(inputJob.length == 7 && inputOption == "1")
        {
          console.log("Trigger 2");
          setAssemblyNumber("3");
          console.log({AssemblyNumber});
          // const payload = {jobNum : inputJob, countrycode : countrycode};
          // getassemblynumber(payload);
          // console.log(`${payload}`);
          
        }
},[inputJob]);

  
  //   const getassemblynumber = async (payload) => {
  //   try {
  //       const response = await api.post("di/getassemblynumber", payload);
  //       if (response.status === 200 || response.status === 201) {
  //         // setPartNumber();
  //         // setAssemblyNumber(`${response.data}`);
  //         console.log("Trigger 3");
  //         console.log(`${response.data}`);
  //         setAssemblyNumber(response.data);
  //       } else {
  //         toast.error("Registration Error!");
  //       }
  //     } catch (error) {
  //       toast.error("Registration Error! Server not reachable.");
  //     }
  // };
    
    useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await api.get("di/getcountrycode");
        console.log("Country code ", response);
        if (response.status === 200 || response.status === 201) {
          setcountrycode(`${response.data}`);
          // toast.success(`Country code: ${countrycode}`);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    };
    fetchCountryCode();
  },[]
);

  useEffect(() => {
    setPartNumber("");
    setAssemblyNumber(""); // Clear Part Number on changes
  }, [inputJob, inputOption]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "1") {
      setPlaceholder("Enter Job Number");
      setInputJob("");
      setInputOption("1");
    } else if (value === "2") {
      setPlaceholder("Enter PO/Line Number");
      setInputJob(""); // Reset inputJob when switching to PO/Line Number
      setInputOption("2");
    } else {
      setPlaceholder("");
      setInputJob("");
    }
  };

  // const checkwithjob = async (payload) => {
  //   try {
  //       const response = await api.post("di/checkwithjob", payload);
  //       if (response.status === 200 || response.status === 201) {
  //         setPartNumber(`${response.data}`);
  //         setAssemblyNumber("0");
  //       } else {
  //         toast.error("Registration Error!");
  //       }
  //     } catch (error) {
  //       toast.error("Registration Error! Server not reachable.");
  //     }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputOption == "1") {
      if (inputJob.trim() === "") {
        toast.error("Enter Job Number", {
          autoClose: 2000,
        });
        return;
      }
      // if (!inputJob.trim()) {
      //   setShowTooltip(true);
      //   setTimeout(() => setShowTooltip(false), 2000);
      //   return;
      // }
      const payload = { jobNum: inputJob, assemblySeq: 0 };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    } else if (inputOption == "2") {
      // Handle PO/Line Number submission

      if (inputJob.trim() === "") {
        toast.error("Enter PO and Line Number", {
          autoClose: 2000,
        });
        return;
      }

      // Further validate that both sides are not empty
      const [po, line] = inputJob.split("/");
      if (!po || !line) {
        toast.error("Both PO and Line Number must be provided.", {
          autoClose: 2000,
        });
        return;
      }
      const payload = { PONum: po, POLine: line };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      try {
        const response = await api.post("di/checkwpo", payload);
        if (response.status === 200 || response.status === 201) {
          setjobexisterror(`A job number exists for this PO. You must enter the inspection under the job number. The job number is : ${response.data}`);
          tog_center();
        } else {
          toast.error("Registration Error!");
        }
      } catch (error) {
        toast.error("Registration Error! Server not reachable.");
      }
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Digital Inspection" pageTitle="Dashboards" />
          <Row>
            <Form
              onSubmit={handleSubmit}
              className="w-100 needs-validation"
              action="#"
            >
              <Card>
                <CardBody>
                  <div
                    className="d-flex align-items-center justify-content-start"
                    style={{
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      gap: "0.5rem", // space between elements
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {/* Select Option */}
                    <div style={{ width: "140px", flex: "0 0 auto" }}>
                      <select
                        className="form-select"
                        id="inputOption"
                        onChange={handleSelectChange}
                      >
                        <option>Select option</option>
                        <option value="1">Job Number</option>
                        <option value="2">PO/Line Number</option>
                      </select>
                    </div>

                    {/* Input Field */}
                    <div style={{ width: "150px", flex: "0 0 auto" }}>
                      <Input
                        type="text"
                        className="form-control"
                        id="inputJob"
                        name="inputJob"
                        placeholder={placeholder}
                        value={inputJob}
                        onChange={(e) => {
                          setInputJob(e.target.value)
                        }}
                      />
                      {/* <Tooltip
                        placement="top"
                        isOpen={showTooltip}
                        target="inputJob"
                        toggle={() => setShowTooltip(false)}
                      >
                        Job Number is required
                      </Tooltip> */}
                    </div>

                    {/* Assembly Number */}
                    <div style={{ width: "40px", flex: "0 0 auto" }}>
                      <Input
                        type="text"
                        className="form-control"
                        id="AssemblyNumber"
                        value={AssemblyNumber}
                        disabled
                      />
                    </div>

                    {/* Part Number */}
                    <div style={{ width: "180px", flex: "0 0 auto" }}>
                      <Input
                        type="text"
                        className="form-control"
                        id="PartNumber"
                        value={PartNumber}
                        disabled
                      />
                    </div>

                    {/* Buttons */}
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "0.5rem" }}
                    >
                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        type="submit"
                      >
                        <img
                          src={usflag}
                          alt="USA"
                          style={{ width: "18px", marginRight: "5px" }}
                        />
                        In Progress
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        type="submit"
                      >
                        <img
                          src={usflag}
                          alt="USA"
                          style={{ width: "18px", marginRight: "5px" }}
                        />
                        Quality
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        type="submit"
                      >
                        <img
                          src={indiaflag}
                          alt="India"
                          style={{ width: "18px", marginRight: "5px" }}
                        />
                        In Progress
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        type="submit"
                      >
                        <img
                          src={indiaflag}
                          alt="India"
                          style={{ width: "18px", marginRight: "5px" }}
                        />
                        Quality
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        id="inspectOneMore"
                      >
                        <img src={add} alt="Add" style={{ width: "17px" }} />
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        id="importExcel"
                      >
                        <img
                          src={excel}
                          alt="Excel"
                          style={{ width: "17px" }}
                        />
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        id="previousDNA"
                      >
                        <img
                          src={leftarrow}
                          alt="Prev"
                          style={{ width: "17px" }}
                        />
                      </Button>

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        id="nextDNA"
                      >
                        <img
                          src={rightarrow}
                          alt="Next"
                          style={{ width: "17px" }}
                        />
                      </Button>

                      <Input
                        type="text"
                        id="DNAdisplay"
                        className="form-control"
                        style={{ width: "75px" }}
                        disabled
                      />

                      <Button
                        color="primary"
                        outline
                        className="btn btn-soft-primary"
                        id="inspectAll"
                      >
                        <img
                          src={inspectall}
                          alt="Inspect All"
                          style={{ width: "20px" }}
                        />
                      </Button>
                      <ToastContainer />

                      {/* TOOLTIP FOR INPUT JOB NUMBER VALIDATION */}

                      {/* <Tooltip
                        placement="top"
                        isOpen={showTooltip}
                        target="inputJob"
                        toggle={() => setShowTooltip(false)} // clicking or focus again hides it
                      >
                        Job Number is required
                      </Tooltip> */}

                      {/* ALL THE UNCONTROLLED TOOLTIP COMPONENTS */}

                      <UncontrolledTooltip
                        placement="bottom"
                        target="AssemblyNumber"
                      >
                        Assembly Number
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="PartNumber"
                      >
                        Part Number
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="inspectOneMore"
                      >
                        Inspect one more piece
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="importExcel"
                      >
                        Import from Vision System Excel File
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="previousDNA"
                      >
                        Previous DNA
                      </UncontrolledTooltip>

                      <UncontrolledTooltip placement="bottom" target="nextDNA">
                        Next DNA
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="DNAdisplay"
                      >
                        Current DNA
                      </UncontrolledTooltip>

                      <UncontrolledTooltip
                        placement="bottom"
                        target="inspectAll"
                      >
                        Inspect all pieces
                      </UncontrolledTooltip>
{/* MODALS */}
<Modal
                isOpen={modal_center}
                toggle={() => {
                    tog_center();
                }}
                centered
            >
                <ModalHeader className="modal-title" />

                <ModalBody className="text-center p-5">
                    <lord-icon
                        src="https://cdn.lordicon.com/tdrtiskw.json"
                        trigger="loop"
                        colors="primary:#f7b84b,secondary:#405189"
                        style={{ width: "130px", height: "130px" }}>
                    </lord-icon>
                    <div className="mt-4">
                        <h4 className="mb-3">{jobexisterror}</h4>
                        <p className="text-muted mb-4" ></p>
                        <div className="hstack gap-2 justify-content-center">
                            <Button color="danger" onClick={() => setmodal_center(false)}>Close</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );

  //   return (
  //     <React.Fragment>
  //       <div className="page-content">
  //         <Container fluid>
  //           <BreadCrumb title="Digital Inspection" pageTitle="Dashboards" />
  //           <Row>
  //             <Form className="w-100">
  //               <Card>
  //                 <CardBody>
  //                   <Row className="d-flex flex-wrap align-items-end">
  //                     <Col style={{ width: "185px", flex: "0 0 auto" }}>
  //                       <div className="mb-3">
  //                         <select
  //                           className="form-select"
  //                           id="inputOption"
  //                           aria-label="Default select example"
  //                           onChange={handleSelectChange}
  //                         >
  //                           <option>Select option</option>
  //                           <option value="1">Job Number</option>
  //                           <option value="2">PO/Line Number</option>
  //                         </select>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "200px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-10px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         <Input
  //                           type="text"
  //                           className="form-control"
  //                           id="inputJob"
  //                           placeholder={placeholder}
  //                           title="Input Number"
  //                         />
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "70px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-10px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         <Input
  //                           type="text"
  //                           className="form-control"
  //                           id="AssemblyNumber"
  //                           defaultValue=""
  //                           disabled
  //                         />
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="AssemblyNumber"
  //                         >
  //                           Assembly Number
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "200px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-10px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         <Input
  //                           type="text"
  //                           className="form-control"
  //                           id="PartNumber"
  //                           defaultValue=""
  //                           disabled
  //                         />
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="PartNumber"
  //                         >
  //                           Part Number
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-10px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         {/* style={{ marginLeft: "-15px" }} */}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                         >
  //                           <img
  //                             src={usflag}
  //                             style={{ width: "20px", marginRight: "5px" }}
  //                             alt="USA Flag"
  //                           />
  //                           Quality
  //                         </Button>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-20px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         {" "}
  //                         {/*style={{ marginLeft: "-110px" }}*/}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                         >
  //                           <img
  //                             src={indiaflag}
  //                             style={{ width: "20px", marginRight: "5px" }}
  //                             alt="USA Flag"
  //                           />
  //                           Quality
  //                         </Button>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-20px",
  //                       }}
  //                     >
  //                       <div className="mb-3 hstack flex-wrap gap-2">
  //                         {" "}
  //                         {/*style={{ marginLeft: "-110px" }}*/}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                           id="inspectOneMore"
  //                         >
  //                           <div>
  //                             <img
  //                               src={add}
  //                               style={{ width: "17px" }}
  //                               alt="Plus Icon"
  //                             />
  //                           </div>
  //                         </Button>
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="inspectOneMore"
  //                         >
  //                           Inspect one more piece
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-75px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         {" "}
  //                         {/*style={{ marginLeft: "-110px" }}*/}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                           style={{
  //                             paddingTop: "0.45rem",
  //                             paddingBottom: "0.45rem",
  //                           }}
  //                           id="importExcel"
  //                         >
  //                           <div>
  //                             <img
  //                               src={excel}
  //                               style={{ width: "17px" }}
  //                               alt="Plus Icon"
  //                             />
  //                           </div>
  //                         </Button>
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="importExcel"
  //                         >
  //                           Import from Vision System Excel File
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-75px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         {" "}
  //                         {/*style={{ marginLeft: "-110px" }}*/}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                           style={{
  //                             paddingTop: "0.45rem",
  //                             paddingBottom: "0.45rem",
  //                           }}
  //                           id="previousDNA"
  //                         >
  //                           <div>
  //                             <img
  //                               src={leftarrow}
  //                               style={{ width: "17px" }}
  //                               alt="Left Arrow Icon"
  //                             />
  //                           </div>
  //                         </Button>
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="previousDNA"
  //                         >
  //                           Previous DNA
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "130px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-75px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         {" "}
  //                         {/*style={{ marginLeft: "-110px" }}*/}
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                           style={{
  //                             paddingTop: "0.45rem",
  //                             paddingBottom: "0.45rem",
  //                           }}
  //                           id="nextDNA"
  //                         >
  //                           <div>
  //                             <img
  //                               src={rightarrow}
  //                               style={{ width: "17px" }}
  //                               alt="Right Arrow Icon"
  //                             />
  //                           </div>
  //                         </Button>
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="nextDNA"
  //                         >
  //                           Next DNA
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "75px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-75px",
  //                       }}
  //                     >
  //                       {/*style={{ marginRight: "-10px" }}*/}
  //                       <div style={{ marginBottom: "0.85rem" }}>
  //                         <Input
  //                           type="text"
  //                           id="DNAdisplay"
  //                           className="form-control"
  //                           disabled
  //                         />
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="DNAdisplay"
  //                         >
  //                           Current DNA
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                     <Col
  //                       style={{
  //                         width: "80px",
  //                         flex: "0 0 auto",
  //                         marginLeft: "-15px",
  //                       }}
  //                     >
  //                       <div className="mb-3">
  //                         <Button
  //                           color="primary"
  //                           outline
  //                           className="btn btn-soft-primary"
  //                           style={{
  //                             paddingTop: "0.4rem",
  //                             paddingBottom: "0.4rem",
  //                           }}
  //                           id="inspectAll"
  //                         >
  //                           <div>
  //                             <img
  //                               src={inspectall}
  //                               style={{ width: "20px" }}
  //                               alt="Inspect All Icon"
  //                             />
  //                           </div>
  //                         </Button>
  //                         <UncontrolledTooltip
  //                           placement="bottom"
  //                           target="inspectAll"
  //                         >
  //                           Inspect All
  //                         </UncontrolledTooltip>
  //                       </div>
  //                     </Col>
  //                   </Row>
  //                 </CardBody>
  //               </Card>
  //             </Form>
  //           </Row>
  //         </Container>
  //       </div>
  //     </React.Fragment>
  //   );
};

export default DI;
