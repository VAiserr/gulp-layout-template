import showMenu from "./showMenu.js";

// DOM elements
const burgerBtn = document.querySelector("#show-menu");
const navbarContainer = document.querySelector('#navbar-container');
const navbarMenu = document.querySelector(".navbar__menu");
const body = document.body;
const forms = document.querySelectorAll('form');

window.onload = (e) => {

    burgerBtn.addEventListener('click', showMenu);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767.8) {
            navbarMenu.classList.remove('active');
            navbarContainer.classList.remove('active');
            body.classList.remove('blocked');
        }
    });
    preventSubmitions(forms);
    
}

function preventSubmitions(forms) {
    for (let form of forms) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        })
    }
}