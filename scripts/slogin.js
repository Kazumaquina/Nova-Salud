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
      username: usernameInput.value.trim(), // Añadido trim() para limpiar espacios
      password: passwordInput.value, // La contraseña no se suele trimmear
    };

    if (!userData.username || !userData.password) {
        showMessage("Por favor, ingrese usuario y contraseña.");
        return;
    }

    try {
      // Deshabilitar el botón mientras se procesa para evitar múltiples envíos
        const loginButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.textContent = "Ingresando...";

        const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

      // Volver a habilitar el botón
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
          // Asegurarse que data y data.user existen
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data && data.token) {
          // Asegurarse que data y data.token existen
            localStorage.setItem("token", data.token);
        }

        window.location.href = "../pages/index.html"; // Redirección a Home
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
