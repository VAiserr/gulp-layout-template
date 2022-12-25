import showMenu from "./showMenu.js"


const burgerBtn = document.querySelector("#show-menu")

window.onload = (e) => {

    burgerBtn.addEventListener('click', showMenu)
}