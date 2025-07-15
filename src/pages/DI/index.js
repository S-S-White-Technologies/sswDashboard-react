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
import { CenteredModalExample } from "../BaseUi/UiModals/UiModalCode";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../../config/api";
import axios from "axios";

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
import { click } from "@testing-library/user-event/dist/cjs/convenience/click.js";

const DI = () => {
  document.title = "SSW Technologies Dashboard";
  const [placeholder, setPlaceholder] = useState("");
  const [inputJob, setInputJob] = useState("");
  const [inputOption, setInputOption] = useState("");
  const [PartNumber, setPartNumber] = useState("");
  const [PartOptions, setPartOptions] = useState([]);
  const [AssemblyNumber, setAssemblyNumber] = useState(0);
  const [AssemblyOptions, setAssemblyOptions] = useState([]);
  const [modal_center, setmodal_center] = useState(false);
  const [modaloneerror, setmodaloneerror] = useState("");
  const [countrycode, setcountrycode] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [clickedbutton, setClickedButton] = useState("");
  const [wavenumber, setWaveNumber] = useState("");
  const [partquantity, setPartQuantity] = useState("");
  const [vantagenumber, setVantageNumber] = useState("");
  const [origquantity, setOriginalQuantity] = useState("");

  const [revmajor, setRevMajor] = useState();
  const [revMinor, setRevMinor] = useState();

  function tog_center() {
    setmodal_center(!modal_center);
  }
  const navigate = useNavigate(); 
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FOR GETTING DEPARTMENT ID !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    const authData = sessionStorage.getItem("authUser");
    console.log("Auth User Data : ", authData);
    if (authData) {
      const parsed = JSON.parse(authData);

      const name = parsed?.name || "Guest User"; // ✅ not parsed.data.name
      const title = parsed?.title || "User";
      const department = parsed?.department || 0;
      setUserDetails({ name, title, department });
    }
  }, []);

  useEffect(() => {
    // console.log({inputJob});
    if (inputJob.length >= 3 && inputOption == "1") {
      // console.log("Trigger 2");
      // setAssemblyNumber("1");
      // console.log({ AssemblyNumber });
      const payload1 = { jobNum: inputJob, countrycode: countrycode };
      getassemblynumber(payload1);
      // console.log(`${payload1}`);
    } else if (inputJob.includes("\\") && inputOption == "2") {
      const [po, line] = inputJob.split("\\");
      if (line != "") {
        console.log("Trigger for PO Line", { po, line });
        // setAssemblyNumber("1");

        // const payload2 = {poNum : po, poLine:line, countrycode : countrycode};
        setTimeout(() => setAssemblyNumber("0"));
        // console.log("Assembly set");
        // console.log("Input Length :", inputJob.length);
        // console.log("Asseambly :", AssemblyNumber);
      }
    }
  }, [inputJob]);

  // !!!!!!!!!!!!!!!!!!  ONCE ASSEMBLY NUMBER IS UPDATED, THE PART NUMBER IS FETCHED AUTOMATICALLY !!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    console.log("AssemblyNumber updated:", AssemblyNumber);
    if (inputOption == "1") {
      const payload = {
        jobNum: inputJob,
        countrycode: countrycode,
        assemblyseq: AssemblyNumber,
      };
      getpartnumber(payload);
      // console.log(payload);
    } else if (AssemblyNumber == "0" && inputOption == "2") {
      const [po, line] = inputJob.split("\\");
      const payload = { poNum: po, poLine: line, countrycode: countrycode };
      // console.log(payload);
      // console.log(AssemblyNumber);
      getpartnumber(payload);
      // console.log(payload);
    }
  }, [AssemblyNumber]);

  const getassemblynumber = async (payload) => {
    try {
      const response = await api.post("di/get-assembly-number", payload);
      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        if (Array.isArray(data)) {
          setAssemblyOptions(data);
          setAssemblyNumber(data[0]); // default selection
        } else {
          setAssemblyOptions([]);
          setAssemblyNumber(data); // set single number
        }
      } else {
        toast.error("Registration Error here!");
      }
    } catch (error) {
      setAssemblyNumber(0);
      // toast.error("Registration Error! Server not reachable here 123.");
    }
  };

  const getpartnumber = async (payload) => {
    if (inputOption == 1) {
      try {
        const response = await api.post(
          "di/get-part-wchildren-for-job",
          payload
        );
        if (response.status === 200 || response.status === 201) {
          const data = response.data;
          // console.log("Response Check ", data);
          // if (Array.isArray(data)) {
          if (Array.isArray(data)) {
            setPartOptions(data);
            setPartNumber(data[0]);
          } else {
           setPartOptions([]);
           setPartNumber("");
          }

          // } else {
          //   setPartOptions([]);
          //   setPartNumber(data); // set single number
          // }
        } else {
          toast.error("Registration Error!");
        }
      } catch (error) {
        // toast.error(error.response.data);
        // toast.error("Registration Error! Server not reachable here 123123.");
      }
    } else if (inputOption == 2) {
      try {
        const response = await api.post(
          "di/get-part-wchildren-for-po-line",
          payload
        );
        if (response.status === 200 || response.status === 201) {
          const data = response.data;
          // if (Array.isArray(data)) {
          setPartOptions(data);
          setPartNumber(data[0]); // default selection
          // } else {
          //   setPartOptions([]);
          //   setPartNumber(data); // set single number
          // }
        } else {
          toast.error(response.data);
          return;
        }
      } catch (error) {
        // toast.error(error.response.data);
        // toast.error("Registration Error! Server not reachable.");
      }
    }
  };

  const getquantity = async () => {
    if (inputOption == "1") {
      try {
        const payload = {
          jobNum: inputJob,
          countrycode: countrycode,
          assemblySeq: AssemblyNumber,
        };
        // console.log("PINGED HERE: ", payload);
        const response = await api.post("di/get-quantity-job", payload);
        if (response.status === 200 || response.status === 201) {
          // console.log({
          //   "This is what is being set for quantity number:": response,
          // });
          if (response.data == 0) {
            setmodaloneerror(
              "Epicor reports Quantity of 0, please contact Technical Support, x1776"
            );
            tog_center();
            return;
          }
          setPartQuantity(`${response.data}`);
          // toast.success(`Country code: ${countrycode}`);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    } else if (inputOption == "2") {
      try {
        const [po, line] = inputJob.split("\\");
        if (!po || !line) {
          toast.error("Both PO and Line Number must be provided.", {
            autoClose: 2000,
          });
          return;
        }
        const payload = { PONum: po, POLine: line, countrycode: countrycode };
        const response = await api.post("di/get-quantity-poline", payload);
        if (response.status === 200 || response.status === 201) {
          // console.log({ "This is what is being set :": response });
          if (response.data == 0) {
            setmodaloneerror(
              "Epicor reports Quantity of 0, please contact Technical Support, x1776"
            );
            tog_center();
            return;
          }
          setPartQuantity(`${response.data}`);
          // toast.success(`Country code: ${countrycode}`);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    }
  };

  const getvantagerev = async () => {
    if (PartNumber != PartOptions[0]) {
      try {
        const payload = {
          partnum: PartNumber,
        };
        console.log("Submitting payload: ", JSON.stringify(payload, null, 2));
        const response = await api.post("di/get-latest-vantagerev", payload);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setVantageNumber(response);
          console.log("PINGED HERE ", response);
        }
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    } else if (inputOption == "1") {
      try {
        const payload = {
          jobnum: inputJob,
          assemblySeq: AssemblyNumber,
          countrycode: countrycode,
        };
        const response = await api.post("di/get-vantagerev-job", payload);
        if (response.status === 200 || response.status === 201) {
          if (Number.isInteger(Number(response.data))) {
            console.log({
              "This is what is being set for vantage number after success pf checking :":
                Number(response.data),
            });
            setVantageNumber(Number(response.data));
            return Number(response.data);
          } else {
            console.log(response.data);
            setmodaloneerror(
              "There is an error in determining the Rev # from Epicor for this job. Either the Rev # in Epicor could not be found OR the Rev # in Epicor has a letter attached to it (eg 3A - which is not compatible with MAFIA). Please contact the planning department to have them correct the Rev #. Reported Rev # from Epicor is  Rev #" +
                response.data
            );
            tog_center();
            return;
          }
        }
        // toast.success(`Country code: ${countrycode}`);
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    } else if (inputOption == "2") {
      try {
        const [po, line] = inputJob.split("\\");
        const payload = { poNum: po, poLine: line, countrycode: countrycode };
        console.log(payload);
        const response = await api.post("di/get-vantagerev-poline", payload);
        if (response.status === 200 || response.status === 201) {
          console.log({
            "This is what is being set for po line vantage rev :": response,
          });
          if (Number.isInteger(Number(response.data))) {
            // console.log("PINGED HERE ", response);

            setVantageNumber(Number(response.data));
            return Number(response.data);
          } else {
            console.log(response.data);
            setmodaloneerror(
              "There is an error in determining the Rev # from Epicor for this job. Either the Rev # in Epicor could not be found OR the Rev # in Epicor has a letter attached to it (eg 3A - which is not compatible with MAFIA). Please contact the planning department to have them correct the Rev #. Reported Rev # from Epicor is  Rev #" +
                response.data
            );
            tog_center();
            return;
          }
        }
        // setPartQuantity(`${response.data}`);
        // toast.success(`Country code: ${countrycode}`)
      } catch (error) {
        toast.error(`Error: ${error.message || "Unknown error"}`);
      }
    }
  };

  const getoriginalquantity = async () => {
    try {
      const payload = {
        jobnum: inputJob,
        wavenumber: wavenumber,
        assemblyseq: AssemblyNumber,
        partnum: PartNumber,
        originalpart: PartOptions[0],
      };
      console.log(payload);
      const response = await api.post("di/get-original-quantity", payload);
      if (response.status === 200 || response.status === 201) {
        // console.log({
        //   "Original Quantity API brings ": response,
        // });
        setOriginalQuantity(response.data);
      }
    } catch {}
  };

  const getminorrev = async (revMajorParam) => {
    try {
      console.log("type of rev major ", typeof revmajor);
      const payload = { partnum: PartNumber, revmajor: revMajorParam };
      console.log(payload);
      const response = await api.post("di/get-latest-minor-rev", payload);
      if (response.status == 200 || response.status == 201) {
        setRevMinor(Number(response.data));
        console.log("Value of the minor rev", response);
        return Number(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getlockedmajorrev = async () => {
    try {
      const payload = {
        jobnum: inputJob,
        assemblyseq: AssemblyNumber,
        partnum: PartNumber,
        originalpart: PartOptions[0],
      };
      const response = await api.post("di/get-locked-major-rev", payload);
      if (response.status == 200 || response.status == 201) {
        setRevMajor(Number(response.data));
        return Number(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getlockedminorrev = async () => {
    try {
      const payload = {
        jobnum: inputJob,
        assemblyseq: AssemblyNumber,
        partnum: PartNumber,
        originalpart: PartOptions[0],
      };
      const response = await api.post("di/get-locked-minor-rev", payload);
      if (response.status == 200 || response.status == 201) {
        setRevMinor(Number(response.data));
        return Number(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const insertHeader = async () => {
    try {
      const payload = {
        jobnum: inputJob,
        wavenumber: wavenumber,
        quantity: origquantity,
        revminor: revMinor,
        revmajor: revmajor,
        assemblyseq: AssemblyNumber,
        partnum: PartNumber,
        originalpart: PartOptions[0],
      };
      const response = await api.post("di/insert-header", payload);
      if (response.status == 200 || response.status == 201) {
        toast.success("Succesfully Added!");
      } else {
        setmodaloneerror(
          "Error in adding job header, please contact technical support, x1776."
        );
        tog_center();
        return;
      }
    } catch (error) {
      toast.error(error);
      // return false;
    }
  };

  const getqualityclosed = async () => {
    try {
      const payload = {
        jobnum: inputJob,
        assemblyseq: AssemblyNumber,
        partnum: PartNumber,
        originalpart: PartOptions[0],
      };
      const response = await api.post("di/get-quality-closed", payload);
      if (response.status == 200 || response.status == 201) {
        if (response.data) {
          setmodaloneerror(
            "This job has been closed. If you feel you have reached this message in error, please contact your supervisor or technical support at x1776."
          );
          tog_center();
          return;
        } else {
          console.log("FLOW COMPLETED WE ARE PINGED HERE.");
          ///////!!!!!!!!!!!!!!!!!!!!!!!!!!! TO ADDD FROM FROMINSPECT PAGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

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
  }, []);

  useEffect(() => {
    setAssemblyOptions([]);
    setAssemblyNumber(""); // Clear Part Number on changes
    setPartOptions([]);
    setPartNumber("");
  }, [inputOption, inputJob]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "1") {
      setPlaceholder("Enter Job Number");
      setInputJob("");
      setInputOption("1");
    } else if (value === "2") {
      setPlaceholder("Enter POLine Number");
      setInputJob(""); // Reset inputJob when switching to PO/Line Number
      setInputOption("2");
    } else {
      setPlaceholder("");
      setInputJob("");
    }
  };
  // useEffect(() => {
  //   const fetchMinorRev = async () => {
  //     if (Number.isInteger(revmajor)) {
  //       await getminorrev();
  //     }
  //   };

  //   fetchMinorRev();
  // }, [revmajor]);

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

  const handleSubmit = async (e, clickedButton, wavenumber) => {
    e.preventDefault();
    console.log({ clickedButton });
    console.log({ wavenumber });

  // console.log({ userDetails });

  if (userDetails.department == 59 && wavenumber == "1") {
    setmodaloneerror(
      "As a member of the Quality Department, please use the 'Quality' inspection type instead."
    );
    tog_center();
    return;
  } else if (userDetails.department == 76 && wavenumber == "2") {
    setmodaloneerror(
      "As a member of the CNC Department, please use the 'In Process' inspection type instead."
    );
    tog_center();
    return;
  } else {
    // !!!!!!!!!!!!!!!!!!!! ALL PROCESSING AFTER CLICKING ON ANY OF THE BUTTONS !!!!!!!!!!!!!!!!!!!!!!
    if (inputOption == "2") {
      console.log("WE ARE REACHING HERE");
      const [po, line] = inputJob.split("\\");
      if (!po || !line) {
        toast.error("Both PO and Line Number must be provided.", {
          autoClose: 2000,
        });
        return;
      }
      const payload = { PONum: po, POLine: line, countrycode: countrycode };
      console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      try {
        const response = await api.post("di/get-jobnum-from-po-line", payload);
        if (
          (response.status === 200 || response.status === 201) &&
          response.data != ""
        ) {
          setmodaloneerror(
            `A job number exists for this PO. You must enter the inspection under the job number. The job number is : ${response.data}`
          );
          tog_center();
          return;
        }
      } catch (error) {
        // toast.error("Registration Error! Server not reachable.");
      }
    }

    await getquantity();
    await getvantagerev();

    let revmajortemp = await getvantagerev();
    let revminortemp = await getminorrev(revmajortemp);

    if ((await getoriginalquantity()) == 0) {
      revmajortemp = await getvantagerev();
      setRevMajor(revmajortemp);
      revminortemp = await getminorrev(revmajortemp);
      setRevMinor(revminortemp);
      //  setRevMinor(Number(await getminorrev()));
      console.log("Rev Minor :", revMinor);
      console.log(revmajor);
      if (inputJob == "0048451") {
        setRevMajor(4);
        setRevMinor(2);
      }
    } else {
      revmajortemp = await getlockedmajorrev();
      setRevMajor(revmajortemp);

      revminortemp = await getlockedminorrev();
      setRevMinor(revminortemp);

      if (revmajortemp == 0 || revminortemp == 0) {
        revmajortemp = await getvantagerev();
        setRevMajor(revmajortemp);
        revminortemp = await getminorrev(revmajortemp);
        setRevMinor(revminortemp);
      }
    }

    if ((revmajor == 0 || revMinor == 0) && inputJob == "0048451") {
      setmodaloneerror(
        "MAFIA Table for part " +
          PartNumber +
          " (Rev " +
          (revmajor ?? 0).toString()+
          ") has not been released or has been changed midway of job. Epicor says for this job number you need Rev #" +
         (revmajor ?? 0).toString() +
          ". Please contact the engineering department."
      );
      tog_center();
      return;
    } else {
      try {
        const payload = {
          partnum: PartNumber,
          revmajor: revmajor,
          revminor: revMinor,
        };
        const response = await api.post("di/get-mafia-table", payload);
        if (response.status == 200 || response.status == 201) {
          console.log(response);
        }
      } catch (error) {
       setmodaloneerror(
          "MAFIA Table for part " +
            PartNumber +
            " (Rev " +
            (revmajor ?? 0).toString() +
            ") has not been released or has been changed midway of job. Epicor says for this job number you need Rev #" +
            (revmajor ?? 0).toString() +
            ". Please contact the engineering department."
        );
        tog_center();
        return;
      }

      if (partquantity == 0) {
        // let quantity = origquantity;
        await insertHeader();
      }

      // console.log("WE ARE REACHING CHEPOINT 1");
      await getqualityclosed();
    }
  }

  // ✅ Navigate to InspectionSection on Quality click
  if (clickedButton === "USA" || clickedButton === "INDIA") {
    if (wavenumber === "2") {
      navigate("/mafia-inspection", {
        state: {
          jobNum: inputJob,
          waveNumber: wavenumber,
          revMajor: revmajor,
          revMinor: revMinor,
          seq: AssemblyNumber,
          lotNum: "", // if applicable
          enteredBy: userDetails?.name || "Unknown",
          partNum: PartNumber,
        },
      });
    }
  }

  // }
  // if (inputOption == "1") {
  // if (inputJob.trim() === "") {
  //   toast.error("Enter Job Number", {
  //     autoClose: 2000,
  //   });
  //   return;
  // }
  // // if (!inputJob.trim()) {
  // //   setShowTooltip(true);
  // //   setTimeout(() => setShowTooltip(false), 2000);
  // //   return;
  // // }
  // const payload = { jobNum: inputJob, assemblySeq: 0 };

  // console.log("Submitting payload:", JSON.stringify(payload, null, 2));

  // } else
  // if (inputOption == "2") {
  // Handle PO/Line Number submission
  // if (inputJob.trim() === "") {
  //   toast.error("Enter PO and Line Number", {
  //     autoClose: 2000,
  //   });
  //   return;
  // }
  // // Further validate that both sides are not empty
  // const [po, line] = inputJob.split("/");
  // if (!po || !line) {
  //   toast.error("Both PO and Line Number must be provided.", {
  //     autoClose: 2000,
  //   });
  //   return;
  // }
  // const payload = { PONum: po, POLine: line, countrycode: countrycode };
  // console.log("Submitting payload:", JSON.stringify(payload, null, 2));
  // try {
  //   const response = await api.post("di/get-jobnum-from-po-line", payload);
  //   if (response.status === 200 || response.status === 201) {
  //     setmodaloneerror(
  //       `A job number exists for this PO. You must enter the inspection under the job number. The job number is : ${response.data}`
  //     );
  //     tog_center();
  //     return;
  //   } else {
  //     toast.error("Registration Error!");
  //   }
  // } catch (error) {
  //   toast.error("Registration Error! Server not reachable.");
  // }
  // }
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
                        <option value="2">PO\Line Number</option>
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
                          setInputJob(e.target.value);
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
                      {AssemblyOptions.length > 1 ? (
                        <select
                          className="form-control"
                          id="AssemblyNumber"
                          style={{ backgroundColor: "#d4edda" }} // light green
                          value={AssemblyNumber}
                          onChange={(e) => setAssemblyNumber(e.target.value)}
                        >
                          {AssemblyOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          id="AssemblyNumber"
                          value={AssemblyNumber}
                          disabled
                        />
                      )}
                    </div>

                    {/* Part Number */}
                    <div style={{ width: "180px", flex: "0 0 auto" }}>
                      {Array.isArray(PartOptions) && PartOptions.length > 1  ? (
                        <select
                          className="form-control"
                          id="PartNumber"
                          style={{ backgroundColor: "#d4edda" }} // light green
                          value={PartNumber}
                          onChange={(e) => setPartNumber(e.target.value)}
                        >
                          {PartOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          id="PartNumber"
                          value={PartNumber}
                          disabled
                        />
                      )}
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
                        id="usainprog"
                       onClick={(e) => handleSubmit(e, "USA", "1")}
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
                        id="usaqual"
                        onClick={(e) => handleSubmit(e, "USA", "2")}
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
                        id="indiainprog"
                        onClick={(e) => handleSubmit(e, "INDIA", "1")}
                      
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
                        id="indiaqual"
                         onClick={(e) => handleSubmit(e, "INDIA", "2")}
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
                        {/* Selection */}
                        <ModalHeader className="modal-title" />

                        <ModalBody className="text-center p-5">
                          <lord-icon
                            src="https://cdn.lordicon.com/tdrtiskw.json"
                            trigger="loop"
                            colors="primary:#f7b84b,secondary:#405189"
                            style={{ width: "130px", height: "130px" }}
                          ></lord-icon>
                          <div className="mt-4">
                            <h4 className="mb-3">{modaloneerror}</h4>
                            <p className="text-muted mb-4"></p>
                            <div className="hstack gap-2 justify-content-center">
                              <Button
                                color="danger"
                                onClick={() => setmodal_center(false)}
                              >
                                Close
                              </Button>
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
