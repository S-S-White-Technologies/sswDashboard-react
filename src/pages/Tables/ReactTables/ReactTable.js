import React, { useEffect, useMemo, useState } from 'react';
import TableContainer from "../../../Components/Common/TableContainerReactTable";
import TableContainerUser from "../../../Components/Common/TableContainerReactTableUser";
import { Link } from 'react-router-dom';
import api from "../../../config/api"
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
  const [viewEmployee, setViewEmployee] = useState({});
  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [searchTable, setSearchTable] = useState(data);




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
  const [viewEmployee, setViewEmployee] = useState({});
  const [activeTab, setActiveTab] = useState("1");

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("registration/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  const [supervisorName, setSupervisorName] = useState("");

  useEffect(() => {
    const fetchSupervisor = async () => {
      if (viewEmployee.supervisor) {
        try {
          const res = await api.get(`registration/supervisor-name/${viewEmployee.supervisor}`);
          setSupervisorName(res.data.name);
        } catch (err) {
          console.error("Failed to fetch supervisor name:", err);
        }
      }
    };

    fetchSupervisor();
  }, [viewEmployee.supervisor]);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [searchTable, setSearchTable] = useState(data);
  const [modal_togView, setmodal_togView] = useState('');
  const [modal_togFirst, setmodal_togFirst] = useState('');
  const [modal_togSecond, setmodal_togSecond] = useState('');
  const [modal_togDelete, setmodal_togDelete] = useState('');
  const [modal_togDeleteSecond, setmodal_togDeleteSecond] = useState('');
  const [editEmployee, setEditEmployee] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  function tog_togView() {
    setmodal_togView(!modal_togView);

    if (modal_togView) {
      setIsEditMode(false);
      setEditEmployee({});
      setViewEmployee({});
    }


  }

  function tog_togFirst() {
    setmodal_togFirst(!modal_togFirst)
  }

  function tog_togSecond() {
    setmodal_togSecond(!modal_togSecond)
  }
  function tog_togDelete() {
    setmodal_togDelete(!modal_togDelete)
  }

  function tog_togDeleteSecond() {
    setmodal_togDeleteSecond(!modal_togDeleteSecond)
  }

  const handleView = async (empId) => {
    try {
      const response = await api.get(`registration/get-employee/${empId}`);
      if (response.status === 200) {
        setViewEmployee(response.data);
        tog_togView()
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };


  const handleEdit = async (empId) => {
    try {
      const response = await api.get(`registration/get-employee/${empId}`);
      if (response.status === 200) {
        setEditEmployee(response.data);
        setIsEditMode(true);
        tog_togView()
      }
    } catch (err) {
      console.error("Failed to load employee:", err);
    }
  };

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === viewEmployee.dept);
    return dept ? dept.description : viewEmployee.dept;
  };

  const handleDelete = async (empId) => {
    tog_togDelete()
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
              <i className="ri-pencil-fill align-bottom" />
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
                    <div className="card ribbon-box border shadow-none mb-lg-0">
                      <div className="card-body text-center">
                        <div className="ribbon-two ribbon-two-primary">
                          {isEditMode ? (
                            <span>
                              {editEmployee.empID || "Emp.ID"}
                            </span>
                          ) : (
                            <span>
                              {viewEmployee.empID || "Emp.ID"}
                            </span>
                          )}
                        </div>
                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                          <img src={logoLight}
                            className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                            alt="user-profile" />
                        </div>
                        {isEditMode ? (
                          <div>
                            <h5 className="fs-16 mb-1">{editEmployee.firstName} {editEmployee.lastName}</h5>
                            <p className="text-muted mb-0">{editEmployee.title}</p>
                          </div>
                        ) : (
                          <div>
                            <h5 className="fs-16 mb-1">{viewEmployee.firstName} {viewEmployee.lastName}</h5>
                            <p className="text-muted mb-0">{viewEmployee.title}</p>
                          </div>
                        )}

                      </div>
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

                            <Col lg={4}>
                              <Label>Firstname</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.firstName || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, firstName: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.firstName || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>

                            <Col lg={4}>
                              <Label>Lastname</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.lastName || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, lastName: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.lastName || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>Title</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.title || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, title: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.title || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>

                            <Col lg={6}>
                              <Label>Street Address 1</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.street1 || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, street1: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.street1 || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>

                            <Col lg={6}>
                              <Label>Street Address 2</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.street2 || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, street2: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.street2 || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>

                            <Col lg={6}>
                              <Label>Phone</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.phone || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.phone || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={6}>
                              <Label>Email Address</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.email || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.email || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>City</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.city || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, city: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.city || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>State</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.state || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, state: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.state || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>Country</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.country || "USA"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, country: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.country || "USA"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>Employee Status</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.empStatus || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, empStatus: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.empStatus || "N/A"}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>Expense Code</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={
                                    editEmployee.expenseCode === "IDL"
                                      ? "Salary"
                                      : editEmployee.expenseCode
                                        ? "Hourly"
                                        : ""
                                  }
                                  onChange={(e) => setEditEmployee({ ...editEmployee, expenseCode: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={
                                    viewEmployee.expenseCode === "IDL"
                                      ? "Salary"
                                      : viewEmployee.expenseCode
                                        ? "Hourly"
                                        : ""
                                  }
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={4}>
                              <Label>Shift Code</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={editEmployee.shift ?? 1}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, shift: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={viewEmployee.shift ?? 1}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={6}>
                              <Label>Department</Label>
                              {isEditMode ? (
                                <Input
                                  type="select"
                                  value={editEmployee.dept || "N/A"}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, dept: e.target.value })}
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.description}
                                    </option>
                                  ))}
                                </Input>
                              ) : (
                                <Input
                                  type="text"
                                  value={getDepartmentName(viewEmployee.dept)}
                                  readOnly
                                />
                              )}
                            </Col>
                            <Col lg={6}>
                              <Label>Supervisor</Label>
                              {isEditMode ? (
                                <Input
                                  type="text"
                                  value={supervisorName || editEmployee.supervisor}
                                  onChange={(e) => setEditEmployee({ ...editEmployee, supervisor: e.target.value })}
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={supervisorName || viewEmployee.supervisor}
                                  readOnly
                                />
                              )}
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
          <div className="modal-footer">

            {isEditMode ? (
              <div className="modal-footer">
                <Button color="primary" onClick={tog_togFirst}>Save changes</Button>
                <Link to="#" className="btn btn-link link-success fw-medium" onClick={tog_togView}><i className="ri-close-line me-1 align-middle"></i> Close</Link>
              </div>
            ) : (
              <div className="modal-footer">
                <Link to="#" className="btn btn-link link-success fw-medium" onClick={tog_togView}><i className="ri-close-line me-1 align-middle"></i> Close</Link>
              </div>
            )}
          </div>

        </ModalFooter>
      </Modal>


      {/* Modal Save changes */}

      <Modal
        isOpen={modal_togFirst}
        toggle={() => {
          tog_togFirst();
        }}
        id="firstmodal"
        centered
      >
        <ModalHeader className="modal-title" id="exampleModalToggleLabel" toggle={() => {
          tog_togFirst();
        }}>


        </ModalHeader>
        <ModalBody className="text-center p-5">
          <lord-icon
            src="https://cdn.lordicon.com/tdrtiskw.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#405189"
            style={{ width: "130px", height: "130px" }}>
          </lord-icon>
          <div className="mt-4 pt-4">
            <h4>Are You sure you want Save Changes?</h4>
            <p className="text-muted"> You are changing the Employee basic Details and Send to the Server! Kindly verify before sending. </p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="success" onClick={() => { tog_togSecond(); tog_togFirst(false); }}>
                Yes
              </Button>
              <Button color="danger" onClick={tog_togFirst}>
                No
              </Button>
            </div>

          </div>
        </ModalBody>
      </Modal>


      <Modal
        isOpen={modal_togSecond}
        toggle={() => {
          tog_togSecond();
        }}
        id="secondmodal"
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
            <h4 className="mb-3">Changes has been Done!</h4>
            <p className="text-muted mb-4">You have successfully change an employee Details. 🎉</p>
            <div className="hstack gap-2 justify-content-center">

              <Button color="light" onClick={() => tog_togSecond(false)}>Close</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>


      {/* <Modal
        isOpen={modal_togSecond}
        toggle={() => {
          tog_togSecond();
        }}
        id="secondmodal"
        centered
      >
        <ModalHeader className="modal-title" id="exampleModalToggleLabel2" toggle={() => {
          tog_togSecond();
        }}>
          Modal 2

        </ModalHeader>
        <ModalBody className="text-center p-5">
          <lord-icon
            src="https://cdn.lordicon.com/zpxybbhl.json"
            trigger="loop"
            colors="primary:#405189,secondary:#0ab39c"
            style={{ width: "150px", height: "150px" }}>
          </lord-icon>
          <div className="mt-4 pt-3">
            <h4 className="mb-3">Changes </h4>
            <p className="text-muted mb-4">Hide this modal and show the first with the button below Automatically Send your invitees a follow -Up email.</p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="danger" onClick={() => { tog_togFirst(); tog_togSecond(false); }}>
                Back to First
              </Button>
              <Button color="light" onClick={() => tog_togSecond(false)}>Close</Button>
            </div>
          </div>
        </ModalBody>

      </Modal> */}

      {/* Modal Save Changes End */}


      {/* Modal Inactive User First */}

      <Modal
        isOpen={modal_togDelete}
        toggle={() => {
          tog_togDelete();
        }}
        id="firstmodal"
        centered
      >
        <ModalHeader className="modal-title" id="exampleModalToggleLabel" toggle={() => {
          tog_togDelete();
        }}>


        </ModalHeader>
        <ModalBody className="text-center p-5">
          <lord-icon
            src="https://cdn.lordicon.com/tdrtiskw.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#405189"
            style={{ width: "130px", height: "130px" }}>
          </lord-icon>
          <div className="mt-4 pt-4">
            <h4>Are You sure you want Inactive this Employee?</h4>
            <p className="text-muted"> Employee has been Inactivated. </p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="success" onClick={() => { tog_togDeleteSecond(); tog_togDelete(false); }}>
                Yes
              </Button>
              <Button color="danger" onClick={tog_togDelete}>
                No
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal Inactive User First End */}



      {/* Inactive Employee */}

      <Modal
        isOpen={modal_togDeleteSecond}
        toggle={() => {
          tog_togDeleteSecond();
        }}
        centered
      >
        <ModalHeader className="modal-title" />

        <ModalBody className="text-center p-5">
          <lord-icon src="https://cdn.lordicon.com/hrqwmuhr.json"
            trigger="loop" colors="primary:#121331,secondary:#08a88a" style={{ width: "120px", height: "120px" }}>
          </lord-icon>
          <div className="mt-4">
            <h4 className="mb-3">Employee Successfully Inactivated!</h4>
            <p className="text-muted mb-4"> </p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="light" onClick={tog_togDeleteSecond}>Close</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Inactive Employee End */}

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