import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);
    const [isTimeandAttendance, setIsTimeandAttendance] = useState(false)

    // Apps
    const [isEmail, setEmail] = useState(false);
    const [isSubEmail, setSubEmail] = useState(false);
    const [isEcommerce, setIsEcommerce] = useState(false);
    const [isProjects, setIsProjects] = useState(false);
    const [isTasks, setIsTasks] = useState(false);
    const [isCRM, setIsCRM] = useState(false);
    const [isCrypto, setIsCrypto] = useState(false);
    const [isInvoices, setIsInvoices] = useState(false);
    const [isSupportTickets, setIsSupportTickets] = useState(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
    const [isJobs, setIsJobs] = useState(false);
    const [isJobList, setIsJobList] = useState(false);
    const [isCandidateList, setIsCandidateList] = useState(false);

    // Authentication
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState(false);
    const [isLockScreen, setIsLockScreen] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [isVerification, setIsVerification] = useState(false);
    const [isError, setIsError] = useState(false);

    // Pages
    const [isProfile, setIsProfile] = useState(false);
    const [isLanding, setIsLanding] = useState(false);

    // Charts
    const [isApex, setIsApex] = useState(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState(false);
    const [isLevel2, setIsLevel2] = useState(false);

    const [iscurrentState, setIscurrentState] = useState("Dashboard");

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove("twocolumn-panel");
        if (iscurrentState !== "Dashboard") {
            setIsDashboard(false);
        }
        if (iscurrentState !== "Apps") {
            setIsApps(false);
        }
        if (iscurrentState !== "Auth") {
            setIsAuth(false);
        }
        if (iscurrentState !== "Pages") {
            setIsPages(false);
        }
        if (iscurrentState !== "BaseUi") {
            setIsBaseUi(false);
        }
        if (iscurrentState !== "AdvanceUi") {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== "Forms") {
            setIsForms(false);
        }
        if (iscurrentState !== "Tables") {
            setIsTables(false);
        }
        if (iscurrentState !== "Charts") {
            setIsCharts(false);
        }
        if (iscurrentState !== "Icons") {
            setIsIcons(false);
        }
        if (iscurrentState !== "Maps") {
            setIsMaps(false);
        }
        if (iscurrentState !== "MuliLevel") {
            setIsMultiLevel(false);
        }
        if (iscurrentState !== "MuliLevel") {
            setIsTimeandAttendance(false);
        }
        if (iscurrentState === "Widgets") {
            history("/widgets");
            document.body.classList.add("twocolumn-panel");
        }
        if (iscurrentState !== "Landing") {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel,
        isTimeandAttendance,
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "General SS White",
            icon: "bx bxs-dashboard",
            link: "/#",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState("Dashboard");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "timeandattendance",
                    label: "Time and Attendance",
                    link: "/time-and-attendance",
                    //dashboard-crypto
                    // parentId: "dashboard",
                    // stateVariables: isDashboard,
                    // isChildItem: true,

                    // click: function (e) {
                    //     e.preventDefault();
                    //     setEmail(!isEmail);
                    // },
                    stateVariables: isEmail,
                    childItems: [


                        {
                            id: 1,
                            label: "In for the Day",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 2,
                            label: "Out for the Day",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 3,
                            label: "Out for Lunch",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 4,
                            label: "Break for Lunch",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 5,
                            label: "Out for Business",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 6,
                            label: "Back From Business",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 7,
                            label: "Out for Personal Break",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 8,
                            label: "Back from Personal Break",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 9,
                            label: "My Missisng Punches",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 10,
                            label: "My Time Punch Records",
                            link: "/#",
                            parentId: "timeandattendance",
                        },
                        {
                            id: 11,
                            label: "Who's in the Building?",
                            link: "/who-in-the-building",
                            parentId: "timeandattendance",
                        },

                    ]
                },
                {
                    id: "taskmanagement",
                    label: "Task Management",
                    link: "/apps-tasks-list-view",
                    parentId: "dashboard",
                    // isChildItem: true,
                    // click: function (e) {
                    //     e.preventDefault();
                    //     setIsCRM(!isCRM);
                    // },
                    stateVariables: isCRM,
                    childItems: [
                        {
                            id: 1,
                            label: "My Tasks",
                            link: "/#",
                            parentId: "taskmanagement",
                        },
                        {
                            id: 2,
                            label: "Create New Tasks",
                            link: "/#",
                            parentId: "taskmanagement",
                        },
                        {
                            id: 3,
                            label: "End of the Day Review",
                            link: "/#",
                            parentId: "taskmanagement",
                        },
                        {
                            id: 4,
                            label: "Find Task by Task ID",
                            link: "/#",
                            parentId: "taskmanagement",
                        },
                        {
                            id: 5,
                            label: "View My Task Reporting By Date",
                            link: "/#",
                            parentId: "taskmanagement",
                        },
                        {
                            id: 6,
                            label: "View Tasks I have Assigned",
                            link: "/#",
                            parentId: "taskmanagement",
                        },


                    ]

                },
                {
                    id: "epo",
                    label: "Expense Purchase Order (EPO)",
                    link: "/dashboard",
                    parentId: "dashboard",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsEcommerce(!isEcommerce);
                    },
                    stateVariables: isEcommerce,
                    childItems: [
                        {
                            id: 1,
                            label: "Create New EPO",
                            link: "/#",
                            parentId: "epo",
                        },
                        {
                            id: 2,
                            label: "Edit EPO",
                            link: "/#",
                            parentId: "epo",
                        },
                        {
                            id: 3,
                            label: "Find EPO By Number",
                            link: "/#",
                            parentId: "epo",
                        },
                        {
                            id: 4,
                            label: "My EPOs",
                            link: "/#",
                            parentId: "epo",
                        },
                        {
                            id: 5,
                            label: "EPOs Not Ready For Payment",
                            link: "/#",
                            parentId: "epo",
                        },
                    ]
                },
                {
                    id: "project",
                    label: "Project Approval System",
                    link: "/dashboard-crypto",
                    parentId: "dashboard",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsCrypto(!isCrypto);
                    },
                    stateVariables: isCrypto,
                    childItems: [
                        {
                            id: 1,
                            label: "Create New Project",
                            link: "/#",
                            parentId: "project",
                        },
                        {
                            id: 2,
                            label: "My Project",
                            link: "/#",
                            parentId: "project",
                        },
                        {
                            id: 3,
                            label: "View All Approved Projects",
                            link: "/#",
                            parentId: "project",
                        },

                    ]
                },
                {
                    id: "personalattendance",
                    label: "Personal Attendance Change",
                    link: "/dashboard-projects",
                    parentId: "dashboard",
                },
                {
                    id: "documentmanagement",
                    label: "Document Management System",
                    link: "/dashboard-nft",
                    parentId: "dashboard",
                },
                {
                    id: "job",
                    label: "Job",
                    badgeName: "New",
                    badgeColor: "success",
                    link: "/dashboard-job",
                    parentId: "dashboard",
                },
            ],
        },
        // {
        //     id: "apps",
        //     label: "Apps",
        //     icon: "bx bx-layer",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsApps(!isApps);
        //         setIscurrentState("Apps");
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isApps,
        //     subItems: [
        //         {
        //             id: "calendar",
        //             label: "Calendar",
        //             link: "/apps-calendar",
        //             parentId: "apps",
        //         },
        //         {
        //             id: "chat",
        //             label: "Chat",
        //             link: "/apps-chat",
        //             parentId: "apps",
        //         },
        //         {
        //             id: "mailbox",
        //             label: "Email",
        //             link: "/#",
        //             parentId: "apps",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setEmail(!isEmail);
        //             },
        //             stateVariables: isEmail,
        //             childItems: [
        //                 {
        //                     id: 1,
        //                     label: "Mailbox",
        //                     link: "/apps-mailbox",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 2,
        //                     label: "Email Templates",
        //                     link: "/#",
        //                     parentId: "apps",
        //                     isChildItem: true,
        //                     stateVariables: isSubEmail,
        //                     click: function (e) {
        //                         e.preventDefault();
        //                         setSubEmail(!isSubEmail);
        //                     },
        //                     childItems: [
        //                         {
        //                             id: 2,
        //                             label: "Basic Action",
        //                             link: "/apps-email-basic",
        //                             parentId: "apps",
        //                         },
        //                         {
        //                             id: 3,
        //                             label: "Ecommerce Action",
        //                             link: "/apps-email-ecommerce",
        //                             parentId: "apps",
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //         {
        //             id: "appsecommerce",
        //             label: "Ecommerce",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsEcommerce(!isEcommerce);
        //             },
        //             parentId: "apps",
        //             stateVariables: isEcommerce,
        //             childItems: [
        //                 {
        //                     id: 1,
        //                     label: "Products",
        //                     link: "/apps-ecommerce-products",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 2,
        //                     label: "Product Details",
        //                     link: "/apps-ecommerce-product-details",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 3,
        //                     label: "Create Product",
        //                     link: "/apps-ecommerce-add-product",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 4,
        //                     label: "Orders",
        //                     link: "/apps-ecommerce-orders",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 5,
        //                     label: "Order Details",
        //                     link: "/apps-ecommerce-order-details",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 6,
        //                     label: "Customers",
        //                     link: "/apps-ecommerce-customers",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 7,
        //                     label: "Shopping Cart",
        //                     link: "/apps-ecommerce-cart",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 8,
        //                     label: "Checkout",
        //                     link: "/apps-ecommerce-checkout",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 9,
        //                     label: "Sellers",
        //                     link: "/apps-ecommerce-sellers",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 10,
        //                     label: "Seller Details",
        //                     link: "/apps-ecommerce-seller-details",
        //                     parentId: "apps",
        //                 },
        //             ],
        //         },
        //         {
        //             id: "appsprojects",
        //             label: "Projects",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsProjects(!isProjects);
        //             },
        //             parentId: "apps",
        //             stateVariables: isProjects,
        //             childItems: [
        //                 {
        //                     id: 1,
        //                     label: "List",
        //                     link: "/apps-projects-list",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 2,
        //                     label: "Overview",
        //                     link: "/apps-projects-overview",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 3,
        //                     label: "Create Project",
        //                     link: "/apps-projects-create",
        //                     parentId: "apps",
        //                 },
        //             ],
        //         },
        //         {
        //             id: "tasks",
        //             label: "Tasks",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsTasks(!isTasks);
        //             },
        //             parentId: "apps",
        //             stateVariables: isTasks,
        //             childItems: [
        //                 {
        //                     id: 1,
        //                     label: "List View",
        //                     link: "/apps-tasks-list-view",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 2,
        //                     label: "Task Details",
        //                     link: "/apps-tasks-details",
        //                     parentId: "apps",
        //                 },
        //             ],
        //         },
        //         {
        //             id: "appscrm",
        //             label: "CRM",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsCRM(!isCRM);
        //             },
        //             parentId: "apps",
        //             stateVariables: isCRM,
        //             childItems: [
        //                 { id: 1, label: "Contacts", link: "/apps-crm-contacts" },
        //                 { id: 2, label: "Companies", link: "/apps-crm-companies" },
        //                 { id: 3, label: "Deals", link: "/apps-crm-deals" },
        //                 { id: 4, label: "Leads", link: "/apps-crm-leads" },
        //             ],
        //         },
        //         {
        //             id: "appscrypto",
        //             label: "Crypto",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsCrypto(!isCrypto);
        //             },
        //             parentId: "apps",
        //             stateVariables: isCrypto,
        //             childItems: [
        //                 { id: 1, label: "Transactions", link: "/apps-crypto-transactions" },
        //                 { id: 2, label: "Buy & Sell", link: "/apps-crypto-buy-sell" },
        //                 { id: 3, label: "Orders", link: "/apps-crypto-orders" },
        //                 { id: 4, label: "My Wallet", link: "/apps-crypto-wallet" },
        //                 { id: 5, label: "ICO List", link: "/apps-crypto-ico" },
        //                 { id: 6, label: "KYC Application", link: "/apps-crypto-kyc" },
        //             ],
        //         },
        //         {
        //             id: "invoices",
        //             label: "Invoices",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsInvoices(!isInvoices);
        //             },
        //             parentId: "apps",
        //             stateVariables: isInvoices,
        //             childItems: [
        //                 { id: 1, label: "List View", link: "/apps-invoices-list" },
        //                 { id: 2, label: "Details", link: "/apps-invoices-details" },
        //                 { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
        //             ],
        //         },
        //         {
        //             id: "supportTickets",
        //             label: "Support Tickets",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsSupportTickets(!isSupportTickets);
        //             },
        //             parentId: "apps",
        //             stateVariables: isSupportTickets,
        //             childItems: [
        //                 { id: 1, label: "List View", link: "/apps-tickets-list" },
        //                 { id: 2, label: "Ticket Details", link: "/apps-tickets-details" },
        //             ],
        //         },
        //         {
        //             id: "NFTMarketplace",
        //             label: "NFT Marketplace",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsNFTMarketplace(!isNFTMarketplace);
        //             },
        //             parentId: "apps",
        //             stateVariables: isNFTMarketplace,
        //             childItems: [
        //                 { id: 1, label: "Marketplace", link: "/apps-nft-marketplace" },
        //                 { id: 2, label: "Explore Now", link: "/apps-nft-explore" },
        //                 { id: 3, label: "Live Auction", link: "/apps-nft-auction" },
        //                 { id: 4, label: "Item Details", link: "/apps-nft-item-details" },
        //                 { id: 5, label: "Collections", link: "/apps-nft-collections" },
        //                 { id: 6, label: "Creators", link: "/apps-nft-creators" },
        //                 { id: 7, label: "Ranking", link: "/apps-nft-ranking" },
        //                 { id: 8, label: "Wallet Connect", link: "/apps-nft-wallet" },
        //                 { id: 9, label: "Create NFT", link: "/apps-nft-create" },
        //             ],
        //         },
        //         {
        //             id: "filemanager",
        //             label: "File Manager",
        //             link: "/apps-file-manager",
        //             parentId: "apps",
        //         },
        //         {
        //             id: "todo",
        //             label: "To Do",
        //             link: "/apps-todo",
        //             parentId: "apps",
        //         },
        //         {
        //             id: "job",
        //             label: "Jobs",
        //             link: "/#",
        //             parentId: "apps",
        //             badgeName: "New",
        //             badgeColor: "success",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsJobs(!isJobs);
        //             },
        //             stateVariables: isJobs,
        //             childItems: [
        //                 {
        //                     id: 1,
        //                     label: "Statistics",
        //                     link: "/apps-job-statistics",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 2,
        //                     label: "Job Lists",
        //                     link: "/#",
        //                     parentId: "apps",
        //                     isChildItem: true,
        //                     stateVariables: isJobList,
        //                     click: function (e) {
        //                         e.preventDefault();
        //                         setIsJobList(!isJobList);
        //                     },
        //                     childItems: [
        //                         {
        //                             id: 1,
        //                             label: "List",
        //                             link: "/apps-job-lists",
        //                             parentId: "apps",
        //                         },
        //                         {
        //                             id: 2,
        //                             label: "Grid",
        //                             link: "/apps-job-grid-lists",
        //                             parentId: "apps",
        //                         },
        //                         {
        //                             id: 3,
        //                             label: "Overview",
        //                             link: "/apps-job-details",
        //                             parentId: "apps",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     id: 3,
        //                     label: "Candidate Lists",
        //                     link: "/#",
        //                     parentId: "apps",
        //                     isChildItem: true,
        //                     stateVariables: isCandidateList,
        //                     click: function (e) {
        //                         e.preventDefault();
        //                         setIsCandidateList(!isCandidateList);
        //                     },
        //                     childItems: [
        //                         {
        //                             id: 1,
        //                             label: "List View",
        //                             link: "/apps-job-candidate-lists",
        //                             parentId: "apps",
        //                         },
        //                         {
        //                             id: 2,
        //                             label: "Grid View",
        //                             link: "/who-in-the-building",
        //                             parentId: "apps",
        //                         },
        //                     ],
        //                 },
        //                 {
        //                     id: 4,
        //                     label: "Application",
        //                     link: "/apps-job-application",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 5,
        //                     label: "New Job",
        //                     link: "/apps-job-new",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 6,
        //                     label: "Companies List",
        //                     link: "/apps-job-companies-lists",
        //                     parentId: "apps",
        //                 },
        //                 {
        //                     id: 7,
        //                     label: "Job Categories",
        //                     link: "/apps-job-categories",
        //                     parentId: "apps",
        //                 },
        //             ],
        //         },
        //         {
        //             id: "apiKey",
        //             label: "API Key",
        //             link: "/apps-api-key",
        //             parentId: "apps",
        //             badgeName: "New",
        //             badgeColor: "success",
        //         },
        //     ],
        // },
        {
            label: "departments",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "Accounting",
            icon: "bx bx-user-circle",
            link: "/accounting",

        },
        {
            id: "authentication",
            label: "Engineering",
            icon: "ri-tools-fill",
            link: "/engineering",

        },
        {
            id: "authentication",
            label: "Human Resource",
            icon: "ri-map-pin-user-fill",
            link: "/humanresource",

        },
        {
            id: "authentication",
            label: "Information Technology",
            icon: "ri-computer-fill",
            link: "/it",

        },
        {
            id: "authentication",
            label: "Planning",
            icon: "ri-send-plane-fill",
            link: "/planning",

        },
        {
            id: "authentication",
            label: "Production",
            icon: "ri-product-hunt-fill",
            link: "/production",

        },
        {
            id: "authentication",
            label: "Quality",
            icon: "ri-code-s-slash-fill",
            link: "/quality",

        },
        {
            id: "authentication",
            label: "Shukla",
            icon: "ri-bank-fill",
            link: "/shukla",

        },
        {
            id: "authentication",
            label: "Shipping",
            icon: "ri-space-ship-fill",
            link: "/shipping",

        },
        {
            id: "authentication",
            label: "Sales",
            icon: "mdi mdi-human-dolly",
            link: "/sales",

        },
        {
            id: "authentication",
            label: "Supervisor",
            icon: "mdi mdi-police-badge",
            link: "/supervisor",

        },
        {
            id: "authentication",
            label: "KPIs",
            icon: "mdi mdi-cloud-check",
            link: "/kpi",

        },
        {
            label: "apps",
            isHeader: true,
        },
        {
            id: "di",
            label: "Digital Inspection",
            icon: "ri-checkbox-circle-fill",
            link: "/di",

        },
        {
            id: "inspection",
            label: "Inspection",
            icon: "ri-clipboard-fill", // You can change icon to your preferred one
            link: "/mafia-inspection",
        },
        {
            id: "mafia",
            label: "Mafia Aux",
            icon: "ri-key-2-fill",
            link: "/mafia",

        },
       


    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
