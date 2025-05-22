document.addEventListener("DOMContentLoaded", function () {
const loginForm = document.querySelector(".login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const messageArea = document.getElementById("login-message-area");

// Función para mostrar mensajes
function showMessage(message, isError = true) {
    messageArea.textContent = message;
    if (isError) {
        messageArea.classList.remove("success");
        messageArea.classList.add("error");
    } else {
        messageArea.classList.remove("error");
        messageArea.classList.add("success");
    }
    messageArea.style.display = message ? "block" : "none";
}

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    showMessage("");

    const userData = {
        username: usernameInput.value.trim(),
        password: passwordInput.value,
    };

    if (!userData.username || !userData.password) {
        showMessage("Por favor, ingrese usuario y contraseña.");
        return;
    }

    try {
        const loginButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.textContent = "Ingresando...";

        const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    loginButton.disabled = false;
    loginButton.textContent = originalButtonText;

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
    } else if (response.status !== 204) {
        const errorText = await response.text();
        console.error("Respuesta no JSON del servidor:", errorText);

        showMessage(
            response.statusText ||
            data?.message ||
            "Error en la respuesta del servidor."
        );
        return;
    }

    if (response.ok) {
        if (data && data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        localStorage.setItem('isLoggedIn', 'true');

        if (data && data.token) {
            localStorage.setItem('sessionToken', data.token);
        } else {
            localStorage.setItem('isLoggedIn', 'true'); 
        }
        const redirectTo = sessionStorage.getItem('redirectAfterLogin');
        if (redirectTo) {
            sessionStorage.removeItem('redirectAfterLogin');


        window.location.href = "../pages/index.html";
        let targetUrl = redirectTo;
            if (!redirectTo.startsWith('../pages/')) {
                targetUrl = `../pages/${redirectTo}`;
            }
            window.location.href = targetUrl;
        } else {
            window.location.href = "../pages/index.html";
        }
    } else {
        showMessage(data?.message || "Usuario o contraseña incorrectos.");
    }
    } catch (error) {
        console.error("Error de conexión o script:", error);
        showMessage("Error al intentar iniciar sesión. Verifique su conexión.");
        const loginButton = loginForm.querySelector('button[type="submit"]');
        if (loginButton.disabled) {
        loginButton.disabled = false;
        loginButton.textContent = loginButton.dataset.originalText || "Login";
    }
    }
    });
});
