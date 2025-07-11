import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {

    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));
    const [userDetails, setUserDetails] = useState({
        name: "Guest User",
        title: "User",

    });

    useEffect(() => {
        const authData = sessionStorage.getItem("authUser");
        if (authData) {
            const parsed = JSON.parse(authData);

            const name = parsed?.name || "Guest User";  // ✅ not parsed.data.name
            const title = parsed?.title || "User";

            setUserDetails({ name, title });
        }
    }, []);

    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        const authUser = sessionStorage.getItem("authUser");
        if (authUser) {
            const obj = JSON.parse(authUser);
            let name = "Admin";

            if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
                name = obj?.username || user?.first_name || obj?.data?.first_name || "Admin";
            } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
                name = obj?.email || "Admin";
            } else {
                // For your actual login API
                name = obj?.data?.name || obj?.name || user?.name || "Admin";
            }

            setUserName(name);
        }
    }, [user]);


    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn shadow-none">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userDetails.name}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{userDetails.title}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">

                    <h6 className="dropdown-header">Welcome {userDetails.name}!</h6>
                    <DropdownItem href={process.env.PUBLIC_URL + "/profile"}><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Profile</span></DropdownItem>
                    {/* <DropdownItem href={process.env.PUBLIC_URL + "/apps-chat"}><i
                        className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Messages</span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "#"}><i
                        className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Taskboard</span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-faqs"}><i
                        className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Help</span></DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-profile"}><i
                        className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Balance : <b>$5971.67</b></span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-profile-settings"}><span
                        className="badge bg-soft-success text-success mt-1 float-end">New</span><i
                            className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Settings</span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "/auth-lockscreen-basic"}><i
                        className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span></DropdownItem> */}
                    <DropdownItem href={process.env.PUBLIC_URL + "/logout"}><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;