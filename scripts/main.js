const menu_option = document.getElementById("menu-option");
const button_option = document.querySelector('.button-menu-display img');

function openMenu() {
    menu_option.classList.toggle("show");
    button_option.classList.toggle("rotate");
}