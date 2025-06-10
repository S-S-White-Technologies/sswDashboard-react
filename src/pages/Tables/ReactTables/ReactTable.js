import React, { useEffect, useMemo, useState } from 'react';
import TableContainer from "../../../Components/Common/TableContainerReactTable";
import TableContainerUser from "../../../Components/Common/TableContainerReactTableUser";
import { Link } from 'react-router-dom';
import FeatherIcon from "feather-icons-react";
import { Alert, Card, CardBody, Modal, ModalHeader, Container, ModalBody, ModalFooter, Button, Toast, ToastBody, Table, Spinner } from 'reactstrap';
import { CardHeader, Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import logoLight from "../../../assets/images/logofinal.png";
import progileBg from '../../../assets/images/profile-bg.jpg';
const DefaultTable = () => {
  const defaultTable =
    [
      { id: "10", name: "Tyrone", email: "tyrone@example.com", designation: "Senior Response Liaison", company: "Raynor, Rolfson and Daugherty", location: "Qatar" },
      { id: "09", name: "Cathy", email: "cathy@example.com", designation: "Customer Data Director", company: "Ebert, Schamberger and Johnston", location: "Mexico" },
      { id: "08", name: "Patsy", email: "patsy@example.com", designation: "Dynamic Assurance Director", company: "Streich Group", location: "Niue" },
      { id: "07", name: "Kerry", email: "kerry@example.com", designation: "Lead Applications Associate", company: "Feeney, Langworth and Tremblay", location: "Niger" },
      { id: "06", name: "Traci", email: "traci@example.com", designation: "Corporate Identity Director", company: "Koelpin - Goldner", location: "Vanuatu" },
      { id: "05", name: "Noel", email: "noel@example.com", designation: "Customer Data Director", company: "Howell - Rippin", location: "Germany" },
      { id: "04", name: "Robert", email: "robert@example.com", designation: "Product Accounts Technician", company: "Hoeger", location: "San Marino" },
      { id: "03", name: "Shannon", email: "shannon@example.com", designation: "Legacy Functionality Associate", company: "Zemlak Group", location: "South Georgia" },
      { id: "02", name: "Harold", email: "harold@example.com", designation: "Forward Creative Coordinator", company: "Metz Inc", location: "Iran" },
      { id: "01", name: "Jonathan", email: "jonathan@example.com", designation: "Senior Implementation Architect", company: "Hauck Inc", location: "Holy See" }
    ]
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (cellProps) => {
          return (
            <span className="fw-semibold">{cellProps.id}</span>
          )
        },
        disableFilters: true,
        filterable: false,
      },

      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Designation",
        accessor: "designation",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Company",
        accessor: "company",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "location",
        disableFilters: true,
        filterable: false,
      }
    ],
    []
  );

  return (
    <React.Fragment>
      <TableContainer
        columns={(columns || [])}
        data={(defaultTable || [])}
        isPagination={false}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={5}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search...'
      />
    </React.Fragment>
  );
};

const PaginationTable = () => {
  const paginationTable =
    [{ id: "#VL2111", name: "Jonathan", date: "07 Oct, 2021", total: "$24.05", status: "Paid" },
    { id: "#VL2110", name: "Harold", date: "07 Oct, 2021", total: "$26.15", status: "Paid" },
    { id: "#VL2109", name: "Shannon", date: "06 Oct, 2021", total: "$21.25", status: "Refund" },
    { id: "#VL2108", name: "Robert", date: "05 Oct, 2021", total: "$25.03", status: "Paid" },
    { id: "#VL2107", name: "Noel", date: "05 Oct, 2021", total: "$22.61", status: "Paid" },
    { id: "#VL2106", name: "Traci", date: "04 Oct, 2021", total: "$24.05", status: "Paid" },
    { id: "#VL2105", name: "Kerry", date: "04 Oct, 2021", total: "$26.15", status: "Paid" },
    { id: "#VL2104", name: "Patsy", date: "04 Oct, 2021", total: "$21.25", status: "Refund" },
    { id: "#VL2103", name: "Cathy", date: "03 Oct, 2021", total: "$22.61", status: "Paid" },
    { id: "#VL2102", name: "Tyrone", date: "03 Oct, 2021", total: "$25.03", status: "Paid" }]

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (cellProps) => {
          return (
            <Link to="#" className="fw-medium">{cellProps.id}</Link>
          )
        },
        disableFilters: true,
        filterable: false,
      },

      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Total",
        accessor: "total",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Status",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps) => {
          switch (cellProps.status) {
            case "Paid":
              return (<span className="badge badge-soft-success text-uppercase"> {cellProps.status}</span>)
            case "Refund":
              return (<span className="badge badge-soft-warning text-uppercase"> {cellProps.status}</span>)
            default:
              return (<span className="badge badge-soft-danger text-uppercase"> {cellProps.status}</span>)
          }
        },
      },
      {
        Header: "Actions",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps) => {
          return (
            <React.Fragment>
              Details
            </React.Fragment>
          )
        },
      },
    ],
    []
  );

  return (
    <React.Fragment >
      <TableContainer
        columns={(columns || [])}
        data={(paginationTable || [])}
        isPagination={true}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={5}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search Products...'
      />
    </React.Fragment >
  );
};

const SearchTable = ({ data }) => {
  const [searchTable, setSearchTable] = useState(data);

  useEffect(() => {
    setSearchTable(data);  // Update state when data prop changes
  }, [data]);
  // const searchTable =
  //   [
  //     { EmpId: "3300", Name: "Abha Magal", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Adam Gosik-Wolfe", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Adrianna Plotkin", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Akash Sharma", Status: "IN", ReturningAt: "3:30 PM" },
  //     { EmpId: "3300", Name: "Akash Shukla", Status: "IN", ReturningAt: "4:00 PM" },
  //     { EmpId: "3300", Name: "Amjad Daluol", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Angela Vo", Status: "IN", ReturningAt: "5:00 PM" },
  //     { EmpId: "3300", Name: "Atul Achaya", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Austin Stroh", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Brian Perkins", Status: "IN", ReturningAt: "3:45 PM" },
  //     { EmpId: "3300", Name: "Brian Sereno", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Christine Martin", Status: "IN", ReturningAt: "4:30 PM" },
  //     { EmpId: "3300", Name: "Cierra Carlstrom", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Eddy Casimir", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Edward Sittler", Status: "IN", ReturningAt: "4:15 PM" },
  //     { EmpId: "3300", Name: "Eric Benson", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Govind Govind", Status: "IN", ReturningAt: "5:00 PM" },
  //     { EmpId: "3300", Name: "Han Lin", Status: "IN", ReturningAt: "3:30 PM" },
  //     { EmpId: "3300", Name: "Henry Pivax", Status: "OUT", ReturningAt: "N/A" },
  //     { EmpId: "3300", Name: "Ivette Benitez", Status: "IN", ReturningAt: "4:00 PM" },
  //     { EmpId: "3300", Name: "Jan Korzonowicz", Status: "OUT", ReturningAt: "N/A" }
  //   ]

  const columns = useMemo(
    () => [
      {
        Header: "Emp ID",
        accessor: (cellProps) => {
          return (
            <span className="fw-semibold">{cellProps.empId}</span>
          )
        },
        disableFilters: true,
        filterable: false,
      },

      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        filterable: false,
        Cell: ({ value }) => {
          // Apply badge with class based on status
          const badgeClass = value === "IN" ? "bg-success" : "bg-danger";
          return <span className={`badge ${badgeClass}`}>{value}</span>;
        },
      },
      {
        Header: "ReturningAt",
        accessor: "returningAt",
        disableFilters: true,
        filterable: false,
      }

    ],
    []
  );




  return (
    <React.Fragment >
      <TableContainer
        columns={(columns || [])}
        data={(searchTable || [])}
        isPagination={true}
        isGlobalFilter={true}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={10}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search...'

      />

    </React.Fragment >
  );
};

const SearchTableEdit = ({ data }) => {

  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [searchTable, setSearchTable] = useState(data);
  const [modal_togView, setmodal_togView] = useState('');
  function tog_togView() {
    setmodal_togView(!modal_togView);
  }


  const handleEdit = (empId) => {
    console.log("Edit:", empId);
    // Navigate or open form to edit
  };
  const handleView = (empId) => {
    tog_togView()
  };

  const handleDelete = async (empId) => {
    if (!window.confirm("Are you sure you want to inactivate this user?")) return;

    try {
      const response = await axios.put(`https://localhost:7168/api/employee/inactivate/${empId}`);
      if (response.status === 200) {
        alert("User inactivated successfully!");

      }
    } catch (error) {
      console.error("Error inactivating user", error);
      alert("Failed to inactivate user.");
    }
  };



  useEffect(() => {
    setSearchTable(data);  // Update state when data prop changes
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Emp ID",
        accessor: (cellProps) => {
          return (
            <span className="fw-semibold">{cellProps.empId}</span>
          )
        },
        disableFilters: true,
        className: "text-center",
        filterable: false,
      },

      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Designation",
        accessor: "title",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Emp. Status",
        accessor: "status",
        disableFilters: true,
        filterable: false,

      },
      {
        Header: "Supervisor",
        accessor: "supervisor",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Action",
        accessor: "action",
        className: "text-center",
        Cell: ({ row }) => (
          <div className="hstack gap-3 fs-15">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // prevent page jump
                handleView(row.original.empId);
              }}
              className="link-info"
              title="View"
            >
              <i className="ri-eye-line"></i>
            </Link>

            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // prevent page jump
                handleEdit(row.original.empId);
              }}
              className="link-primary"
              title="Edit"
            >
              <i className="ri-settings-4-line"></i>
            </Link>

            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // prevent page jump
                handleDelete(row.original.empId);
              }}
              className="link-danger"
              title="Inactive"
            >
              <i className="ri-delete-bin-5-line"></i>
            </Link>
          </div>
        ),
      }



    ],
    []
  );




  return (
    <React.Fragment >
      <TableContainerUser
        columns={(columns || [])}
        data={(searchTable || [])}
        isPagination={true}
        isGlobalFilter={true}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={10}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search User...'

      />

      <Modal size="xl" isOpen={modal_togView} toggle={tog_togView}>
        <ModalHeader toggle={tog_togView}>

        </ModalHeader>
        <ModalBody>
          <Container fluid>
            <div className="position-relative mx-n4 mt-n4">
              <div className="profile-wid-bg profile-setting-img">
                <img src={progileBg} className="profile-wid-img" alt="" />
                <div className="overlay-content">
                  <div className="text-end p-3">
                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                      <Input id="profile-foreground-img-file-input" type="file"
                        className="profile-foreground-img-file-input" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Col xxl={3}>
                <Card className="mt-n5">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                        <img src={logoLight}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile" />
                      </div>
                      <h5 className="fs-16 mb-1">Anna Adame</h5>
                      <p className="text-muted mb-0">Lead Designer / Developer</p>
                    </div>
                  </CardBody>
                </Card>


              </Col>

              <Col xxl={9}>
                <Card className="mt-xxl-n5">
                  <CardHeader>
                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                      role="tablist">
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            tabChange("1");
                          }}>
                          <i className="fas fa-home"></i>
                          Personal Details
                        </NavLink>
                      </NavItem>

                    </Nav>
                  </CardHeader>
                  <CardBody className="p-4">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Form>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstnameInput" className="form-label">First
                                  Name</Label>
                                <Input type="text" className="form-control" id="firstnameInput"
                                  placeholder="Enter your firstname" defaultValue="Dave" />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastnameInput" className="form-label">Last
                                  Name</Label>
                                <Input type="text" className="form-control" id="lastnameInput"
                                  placeholder="Enter your lastname" defaultValue="Adame" />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label">Phone
                                  Number</Label>
                                <Input type="text" className="form-control"
                                  id="phonenumberInput"
                                  placeholder="Enter your phone number"
                                  defaultValue="+(1) 987 6543" />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">Email
                                  Address</Label>
                                <Input type="email" className="form-control" id="emailInput"
                                  placeholder="Enter your email"
                                  defaultValue="daveadame@velzon.com" />
                              </div>
                            </Col>

                            <Col lg={12}>
                              <div className="mb-3">
                                <Label htmlFor="skillsInput" className="form-label">Skills</Label>
                                <select className="form-select mb-3">
                                  <option >Select your Skill </option>
                                  <option value="Choices1">CSS</option>
                                  <option value="Choices2">HTML</option>
                                  <option value="Choices3">PYTHON</option>
                                  <option value="Choices4">JAVA</option>
                                  <option value="Choices5">ASP.NET</option>
                                </select>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="designationInput"
                                  className="form-label">Designation</Label>
                                <Input type="text" className="form-control"
                                  id="designationInput" placeholder="Designation"
                                  defaultValue="Lead Designer / Developer" />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="websiteInput1"
                                  className="form-label">Website</Label>
                                <Input type="text" className="form-control" id="websiteInput1"
                                  placeholder="www.example.com" defaultValue="www.velzon.com" />
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="cityInput" className="form-label">City</Label>
                                <Input type="text" className="form-control" id="cityInput"
                                  placeholder="City" defaultValue="California" />
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="countryInput" className="form-label">Country</Label>
                                <Input type="text" className="form-control" id="countryInput"
                                  placeholder="Country" defaultValue="United States" />
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="zipcodeInput" className="form-label">Zip
                                  Code</Label>
                                <Input type="text" className="form-control" minLength="5"
                                  maxLength="6" id="zipcodeInput"
                                  placeholder="Enter zipcode" defaultValue="90011" />
                              </div>
                            </Col>


                          </Row>
                        </Form>
                      </TabPane>

                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={tog_togView}>Close</Button>
        </ModalFooter>
      </Modal>

    </React.Fragment >
  );
};

const SortingTable = () => {
  const sortingTable =
    [
      { id: "10", name: "Tyrone", email: "tyrone@example.com", designation: "Senior Response Liaison", company: "Raynor, Rolfson and Daugherty", location: "Qatar" },
      { id: "09", name: "Cathy", email: "cathy@example.com", designation: "Customer Data Director", company: "Ebert, Schamberger and Johnston", location: "Mexico" },
      { id: "08", name: "Patsy", email: "patsy@example.com", designation: "Dynamic Assurance Director", company: "Streich Group", location: "Niue" },
      { id: "07", name: "Kerry", email: "kerry@example.com", designation: "Lead Applications Associate", company: "Feeney, Langworth and Tremblay", location: "Niger" },
      { id: "06", name: "Traci", email: "traci@example.com", designation: "Corporate Identity Director", company: "Koelpin - Goldner", location: "Vanuatu" },
      { id: "05", name: "Noel", email: "noel@example.com", designation: "Customer Data Director", company: "Howell - Rippin", location: "Germany" },
      { id: "04", name: "Robert", email: "robert@example.com", designation: "Product Accounts Technician", company: "Hoeger", location: "San Marino" },
      { id: "03", name: "Shannon", email: "shannon@example.com", designation: "Legacy Functionality Associate", company: "Zemlak Group", location: "South Georgia" },
      { id: "02", name: "Harold", email: "harold@example.com", designation: "Forward Creative Coordinator", company: "Metz Inc", location: "Iran" },
      { id: "01", name: "Jonathan", email: "jonathan@example.com", designation: "Senior Implementation Architect", company: "Hauck Inc", location: "Holy See" }
    ]

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Designation",
        accessor: "designation",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Company",
        accessor: "company",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Location",
        accessor: "location",
        disableFilters: true,
        filterable: true,
      }
    ],
    []
  );

  return (
    <React.Fragment >
      <TableContainer
        columns={(columns || [])}
        data={(sortingTable || [])}
        isPagination={true}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={5}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search Products...'
      />
    </React.Fragment >
  );
};

const LoadingStateTable = () => {

  const [display, setDisplay] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setDisplay(true)
    }, 3000);
  }, [])

  const loadingStateTable =
    [
      { id: "10", name: "Tyrone", email: "tyrone@example.com", designation: "Senior Response Liaison", company: "Raynor, Rolfson and Daugherty", location: "Qatar" },
      { id: "09", name: "Cathy", email: "cathy@example.com", designation: "Customer Data Director", company: "Ebert, Schamberger and Johnston", location: "Mexico" },
      { id: "08", name: "Patsy", email: "patsy@example.com", designation: "Dynamic Assurance Director", company: "Streich Group", location: "Niue" },
      { id: "07", name: "Kerry", email: "kerry@example.com", designation: "Lead Applications Associate", company: "Feeney, Langworth and Tremblay", location: "Niger" },
      { id: "06", name: "Traci", email: "traci@example.com", designation: "Corporate Identity Director", company: "Koelpin - Goldner", location: "Vanuatu" },
      { id: "05", name: "Noel", email: "noel@example.com", designation: "Customer Data Director", company: "Howell - Rippin", location: "Germany" },
      { id: "04", name: "Robert", email: "robert@example.com", designation: "Product Accounts Technician", company: "Hoeger", location: "San Marino" },
      { id: "03", name: "Shannon", email: "shannon@example.com", designation: "Legacy Functionality Associate", company: "Zemlak Group", location: "South Georgia" },
      { id: "02", name: "Harold", email: "harold@example.com", designation: "Forward Creative Coordinator", company: "Metz Inc", location: "Iran" },
      { id: "01", name: "Jonathan", email: "jonathan@example.com", designation: "Senior Implementation Architect", company: "Hauck Inc", location: "Holy See" }
    ]

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Designation",
        accessor: "designation",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Company",
        accessor: "company",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Location",
        accessor: "location",
        disableFilters: true,
        filterable: true,
      }
    ],
    []
  );

  return (
    <React.Fragment >
      {display ? <TableContainer
        columns={(columns || [])}
        data={(loadingStateTable || [])}
        isPagination={true}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={5}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search Products...'
      /> : <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
    </React.Fragment >
  );
};

const HiddenColumns = () => {
  const sortingTable =
    [
      { id: "10", name: "Tyrone", email: "tyrone@example.com", designation: "Senior Response Liaison", company: "Raynor, Rolfson and Daugherty", location: "Qatar" },
      { id: "09", name: "Cathy", email: "cathy@example.com", designation: "Customer Data Director", company: "Ebert, Schamberger and Johnston", location: "Mexico" },
      { id: "08", name: "Patsy", email: "patsy@example.com", designation: "Dynamic Assurance Director", company: "Streich Group", location: "Niue" },
      { id: "07", name: "Kerry", email: "kerry@example.com", designation: "Lead Applications Associate", company: "Feeney, Langworth and Tremblay", location: "Niger" },
      { id: "06", name: "Traci", email: "traci@example.com", designation: "Corporate Identity Director", company: "Koelpin - Goldner", location: "Vanuatu" },
      { id: "05", name: "Noel", email: "noel@example.com", designation: "Customer Data Director", company: "Howell - Rippin", location: "Germany" },
      { id: "04", name: "Robert", email: "robert@example.com", designation: "Product Accounts Technician", company: "Hoeger", location: "San Marino" },
      { id: "03", name: "Shannon", email: "shannon@example.com", designation: "Legacy Functionality Associate", company: "Zemlak Group", location: "South Georgia" },
      { id: "02", name: "Harold", email: "harold@example.com", designation: "Forward Creative Coordinator", company: "Metz Inc", location: "Iran" },
      { id: "01", name: "Jonathan", email: "jonathan@example.com", designation: "Senior Implementation Architect", company: "Hauck Inc", location: "Holy See" }
    ]

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Designation",
        accessor: "designation",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Company",
        accessor: "company",
        disableFilters: true,
        filterable: true,
      }
    ],
    []
  );

  return (
    <React.Fragment >
      <TableContainer
        columns={(columns || [])}
        data={(sortingTable || [])}
        isPagination={true}
        // isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={5}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder='Search Products...'
      />
    </React.Fragment >
  );
};

export { DefaultTable, PaginationTable, SearchTable, SearchTableEdit, SortingTable, LoadingStateTable, HiddenColumns };