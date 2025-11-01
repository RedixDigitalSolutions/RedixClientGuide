// Global fallback Google Drive folder for clients missing their own
window.globalRedixGoogleDriveFolder = "https://drive.google.com/drive/folders/1Ns5jA2_FrAyEPY9kF4jGtvTsB_U5X6gw?usp=sharing";

// Populate this array with your real clients and links.
window.CLIENTS = [
    {
        id: "Frita",
        name: "Frita",
        photo: "assets/frita.png",
        social: {
            tiktok: "https://www.tiktok.com/@fastfoodfrita",
            instagram: "https://www.instagram.com/fastfoodfrita/",
            facebook: "https://www.facebook.com/FastFoodFrita"
        },
        drive: "https://drive.google.com/drive/folders/11mdLeMn23Q2bBrRFLF03iSki12vaDINs?usp=sharing",
        resources: ""
    },
    {
        id: "Zendyani",
        name: "Zendyani",
        photo: "assets/zend.jpg",
        social: {
            tiktok: "https://www.tiktok.com/@zenddd_yeni",
            instagram: "https://www.instagram.com/zenddd_yeni/"
            // threads exists but is intentionally ignored in this UI spec
        },
        drive: "https://drive.google.com/drive/folders/14dWwxNRxIOV1grKkYu_su8L3BzHbfw71?usp=sharing",
        resources: ""
    },
    {
        id: "dante",
        name: "dante",
        photo: "assets/dante.png",
        social: {
            tiktok: "https://www.tiktok.com/@dantechebbi",
            instagram: "https://www.instagram.com/dantechebbi/"
        },
        drive: "https://drive.google.com/drive/folders/1a7BDXL5JAavcpUPX08iOrDsp4O0XJ7_F?usp=sharing",
        resources: ""
    },
    {
        id: "mino",
        name: "mino",
        photo: "assets/mino.png",
        social: {
            tiktok: "https://www.tiktok.com/@twistmindzone",
            instagram: "https://www.instagram.com/twist_mind_zone/"
        },
        drive: "https://drive.google.com/drive/folders/1jC9QYQEJGDd74QvO-ovGe4pdkgkV69Qn?usp=sharing",
        resources: ""
    },
    {
        id: "Moatez",
        name: "Moatez",
        photo: "assets/Moatez.png",
        social: {
            tiktok: "https://www.tiktok.com/@drmoetazalhousayni",
            instagram: "https://www.instagram.com/dr_moetaz_alhousayni/"
        },
        drive: "https://drive.google.com/drive/folders/1QcbnZSFzzNfGdVZJOMDhCLk_AG6FTz6n?usp=sharing",
        resources: ""
    }
];


// ---- Auth config ----
window.AUTH_CONFIG = {
    enabled: true,
    sessionKey: "redix_auth_v1",
    accounts: [
        {
            username: "pexa",
            // SHA-256 of "Pexaui@1234"
            passSha256: "a646f7b8b78e67f4e64f70ca80e1fbce556eb03810b3782151ac501b1875e140"
        },
        {
            username: "moemen",
            // SHA-256 of "Elmon@1234"
            passSha256: "829882535a69384a042bb871ae3c3ea20f586ed700551ea9ae1ddb8004cf431b"
        },
        {
            username: "hamza",
            // SHA-256 of "Khlaf@1234"
            passSha256: "c176db1001d499b30cef7d6a51b75920559406797405fabb41b86509e2a0a41f"
        }
    ]
};

// ---- Sales & Proposals links ----
window.LINKS = {
    sales: [
        { title: "Travel Agency demo", url: "https://redixdigitalsolutions.github.io/travel-agency" },
        { title: "Furniture demo", url: "https://redixdigitalsolutions.github.io/redix-furniture" },
        { title: "Fashion portfolio", url: "https://redixdigitalsolutions.github.io/redixfashionportfolio" }
    ],
    proposals: [
        { title: "Orle proposal", url: "https://redixdigitalsolutions.github.io/OrleProposal" },
        { title: "iStore proposal", url: "https://istore-proposal.redixsolutions.pro/" }
    ]
};
