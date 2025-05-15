/* FUNCIONES */
window.checkAuthAndProtectPage = checkAuthAndProtectPage;
window.handleLogout = handleLogout;
window.updateLoginLogoutButton = updateLoginLogoutButton;


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

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('isLoggedIn');
    alert('Has cerrado sesión.');
    window.location.href = 'Login.html';
}

function updateLoginLogoutButton() {
    const loginOptionLi = document.getElementById('login');
    if (!loginOptionLi) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLink = loginOptionLi.querySelector('a');

    let loginPageUrl = 'Login.html';
    if (window.location.pathname.includes('/pages/')) {
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

    if (window.location.pathname.endsWith('Login.html') || window.location.pathname.endsWith('/pages/Login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');
        if (redirectPage) {
            sessionStorage.setItem('redirectAfterLogin', redirectPage);
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('Login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');
        if (redirectPage) {
            sessionStorage.setItem('redirectAfterLogin', redirectPage);
        }
    }

});