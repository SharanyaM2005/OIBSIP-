const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutButton = document.getElementById("logoutButton");


// ===============================
// PASSWORD HASHING
// ===============================

function arrayBufferToBase64(buffer) {

    const bytes = new Uint8Array(buffer);

    let binary = "";

    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}


function base64ToArrayBuffer(base64) {

    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}


function generateSalt() {

    const salt = new Uint8Array(16);

    crypto.getRandomValues(salt);

    return salt;
}


async function hashPassword(password, salt) {

    const encoder = new TextEncoder();

    const passwordData = encoder.encode(password);

    const keyMaterial =
        await crypto.subtle.importKey(
            "raw",
            passwordData,
            "PBKDF2",
            false,
            ["deriveBits"]
        );

    const hash =
        await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            256
        );

    return arrayBufferToBase64(hash);
}


// ===============================
// PASSWORD VALIDATION
// ===============================

function validatePassword(password) {

    const minimumLength = password.length >= 8;

    const hasUppercase = /[A-Z]/.test(password);

    const hasLowercase = /[a-z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    return (
        minimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );
}


// ===============================
// REGISTER
// ===============================

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        if (name.length < 2) {

            message.textContent =
                "Please enter a valid name.";

            message.className =
                "message error";

            return;
        }


        if (!validatePassword(password)) {

            message.textContent =
                "Password must contain 8+ characters, uppercase, lowercase and a number.";

            message.className =
                "message error";

            return;
        }


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.className =
                "message error";

            return;
        }


        const existingUser =
            JSON.parse(
                localStorage.getItem("secureAuthUser")
            );


        if (
            existingUser &&
            existingUser.email === email
        ) {

            message.textContent =
                "An account with this email already exists.";

            message.className =
                "message error";

            return;
        }


        const salt = generateSalt();

        const passwordHash =
            await hashPassword(
                password,
                salt
            );


        const user = {

            name: name,

            email: email,

            salt: arrayBufferToBase64(salt),

            passwordHash: passwordHash

        };


        localStorage.setItem(
            "secureAuthUser",
            JSON.stringify(user)
        );


        message.textContent =
            "Account created successfully! Redirecting...";

        message.className =
            "message success";


        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1500);

    });
}


// ===============================
// LOGIN
// ===============================

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        const storedUser =
            JSON.parse(
                localStorage.getItem("secureAuthUser")
            );


        if (!storedUser) {

            message.textContent =
                "No account found. Please register first.";

            message.className =
                "message error";

            return;
        }


        if (storedUser.email !== email) {

            message.textContent =
                "Invalid email or password.";

            message.className =
                "message error";

            return;
        }


        const salt =
            new Uint8Array(
                base64ToArrayBuffer(
                    storedUser.salt
                )
            );


        const passwordHash =
            await hashPassword(
                password,
                salt
            );


        if (
            passwordHash !==
            storedUser.passwordHash
        ) {

            message.textContent =
                "Invalid email or password.";

            message.className =
                "message error";

            return;
        }


        sessionStorage.setItem(
            "isLoggedIn",
            "true"
        );


        sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                name: storedUser.name,
                email: storedUser.email
            })
        );


        message.textContent =
            "Login successful! Redirecting...";

        message.className =
            "message success";


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 800);

    });
}


// ===============================
// PROTECTED DASHBOARD
// ===============================

if (
    window.location.pathname.endsWith(
        "dashboard.html"
    )
) {

    const isLoggedIn =
        sessionStorage.getItem(
            "isLoggedIn"
        );


    if (isLoggedIn !== "true") {

        window.location.href =
            "index.html";

    } else {

        const loggedInUser =
            JSON.parse(
                sessionStorage.getItem(
                    "loggedInUser"
                )
            );


        if (loggedInUser) {

            document.getElementById(
                "userName"
            ).textContent =
                loggedInUser.name;


            document.getElementById(
                "userEmail"
            ).textContent =
                loggedInUser.email;

        }

    }
}


// ===============================
// LOGOUT
// ===============================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "isLoggedIn"
            );

            sessionStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "index.html";

        }
    );
}