export default function showMenu(e) {
    let menu = document.querySelector('.navbar__menu');
    let container = document.querySelector('#navbar-container');
    let body = document.body;
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        container.classList.remove('active');
        body.classList.remove('blocked');
    } else {
        menu.classList.add('active');
        container.classList.add('active');
        body.classList.add('blocked');
    }
}