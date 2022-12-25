export default function showMenu(e) {
    let menu = document.querySelector('.navbar__menu');
    let container = document.querySelector('#navbar-container');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        container.classList.remove('active');
    } else {
        menu.classList.add('active');
        container.classList.add('active');
    }
}