import showMenu from "./showMenu.js"

// DOM elements
const burgerBtn = document.querySelector("#show-menu");
const navbarContainer = document.querySelector('#navbar-container');
const navbarMenu = document.querySelector(".navbar__menu");

window.onload = (e) => {

    burgerBtn.addEventListener('click', showMenu);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767.8) {
            navbarMenu.classList.remove('active');
            navbarContainer.classList.remove('active');
            document.body.classList.remove('blocked');
        }
    });
    
}