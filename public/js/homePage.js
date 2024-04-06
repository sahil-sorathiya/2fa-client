const menuIcon = document.getElementById('menu-icon')
const navbar = document.getElementById('navbar')
const dropdown = document.getElementById('drop')

menuIcon.addEventListener('click', (e) => {
    dropdown.classList.toggle('dropdown')
})