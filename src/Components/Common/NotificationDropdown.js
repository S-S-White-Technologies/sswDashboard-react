import React, { useState, useEffect } from 'react';
import {
    Col, Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink,
    Row, TabContent, TabPane
} from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import api from "../../api";
import SimpleBar from "simplebar-react";

const NotificationDropdown = () => {
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => setIsNotificationDropdown(!isNotificationDropdown);

    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const userId = JSON.parse(sessionStorage.getItem("authUser"))?.uid;
    const userRole = JSON.parse(sessionStorage.getItem("authUser"))?.role;

    useEffect(() => {
        if (userId) fetchNotifications();
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get(`Notifications/${userId}`);
            setNotifications(res.data);
        } catch (err) {
            console.error("Notification fetch error:", err);
        }
    };

    const markAsRead = async (id) => {
        await api.put(`Notifications/markread/${id}`);
        fetchNotifications();
    };

    const handleNotificationClick = (notification) => {
        if (notification.link?.includes("/review/exempted/")) {
            const reviewId = notification.link.split("/").pop();
            markAsRead(notification.id);

            console.log("My Role :", userRole);
            let role = "employee";
            if (userRole === "Manager") role = "manager";
            else if (userRole === "HR Admin") role = "hr";

            navigate(`/review/exempted/${reviewId}?role=${role}`);
        }
    };

    return (
        <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
            <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle shadow-none">
                <i className='bx bx-bell fs-22'></i>
                {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                        {notifications.filter(n => !n.isRead).length}
                        <span className="visually-hidden">unread notifications</span>
                    </span>
                )}
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                <div className="dropdown-head bg-primary bg-pattern rounded-top">
                    <div className="p-3">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fs-16 fw-semibold text-white">Notifications</h6>
                            </Col>
                            <div className="col-auto dropdown-tabs">
                                <span className="badge badge-soft-light fs-13">
                                    {notifications.filter(n => !n.isRead).length} New
                                </span>
                            </div>
                        </Row>
                    </div>

                    <div className="px-2 pt-2">
                        <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => toggleTab('1')}
                                >
                                    All ({notifications.length})
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </div>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" className="py-2 ps-2">
                        <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                            {notifications.length === 0 ? (
                                <div className="text-center p-3 text-muted">No new notifications</div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="text-reset notification-item d-block dropdown-item position-relative">
                                        <div className="d-flex">
                                            <div className="avatar-xs me-3">
                                                <span className={`avatar-title bg-soft-${n.isRead ? 'secondary' : 'info'} text-${n.isRead ? 'secondary' : 'info'} rounded-circle fs-16`}>
                                                    <i className="bx bx-bell"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6
                                                    className={`mt-0 mb-2 fs-13 ${n.isRead ? 'text-muted' : 'fw-semibold'}`}
                                                    role="button"
                                                    onClick={() => handleNotificationClick(n)}
                                                >
                                                    {n.message}
                                                </h6>
                                                <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                    <span><i className="mdi mdi-clock-outline"></i> {moment(n.createdAt).fromNow()}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </SimpleBar>
                    </TabPane>
                </TabContent>
            </DropdownMenu>
        </Dropdown>
    );
};

export default NotificationDropdown;
