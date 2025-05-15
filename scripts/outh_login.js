function checkAuthAndProtectPage() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['Customer_Services.html', 'Inventary.html', 'Products.html'];


    let loginPageUrl = 'Login.html'; 
    if (window.location.pathname.includes('/pages/')) {
    } else if (window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/pages/')) {
        loginPageUrl = 'pages/Login.html';
    }

    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        alert('Debes iniciar sesión para acceder a esta página.');
        
        window.location.href = loginPageUrl;
        return false;
    }
    return true;
}

// Función para manejar el Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionToken'); // Si usas token
    localStorage.removeItem('isLoggedIn');
    alert('Has cerrado sesión.');
    window.location.href = 'Login.html'; // O 'index.html'
}

// Función para actualizar la UI del menú (botón Login/Logout)
function updateLoginLogoutButton() {
    const loginOptionLi = document.getElementById('login');
    if (!loginOptionLi) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLink = loginOptionLi.querySelector('a');

    let loginPageUrl = 'Login.html'; // Ajustar como arriba
    if (window.location.pathname.includes('/pages/')) {
        // Ya estamos en pages, Login.html debería estar al mismo nivel
    } else if (window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/pages/')) {
        loginPageUrl = 'pages/Login.html';
    }

    if (isLoggedIn) {
        const logoutLink = loginOptionLi.querySelector('a');
        logoutLink.textContent = 'Log-out';
        logoutLink.href = '#'; 
        logoutLink.onclick = function(event) {
            event.preventDefault(); 
            handleLogout();
        };
    } else {
        const loginLink = loginOptionLi.querySelector('a');
        loginLink.textContent = 'Log-in';
        loginLink.href = 'Login.html';
        loginLink.onclick = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateLoginLogoutButton === 'function') {
        updateLoginLogoutButton();
    }


    // Esta parte es específica para cuando se carga la página Login.html
    if (window.location.pathname.endsWith('Login.html') || window.location.pathname.endsWith('/pages/Login.html')) { // Ser más específico
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');
        if (redirectPage) {
            sessionStorage.setItem('redirectAfterLogin', redirectPage);
        }
    }
});


window.checkAuthAndProtectPage = checkAuthAndProtectPage;
window.handleLogout = handleLogout;
window.updateLoginLogoutButton = updateLoginLogoutButton;


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('Login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');
        if (redirectPage) {
            // guara sesio para rediccionar a la pagina
            sessionStorage.setItem('redirectAfterLogin', redirectPage);
        }
    }

});