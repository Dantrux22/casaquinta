
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nave-1');
  
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
      menuToggle.querySelector('span:nth-child(1)').classList.toggle('hide');
      menuToggle.querySelector('span:nth-child(2)').classList.toggle('show');
    });
  
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
        menuToggle.querySelector('span:nth-child(1)').classList.remove('hide');
        menuToggle.querySelector('span:nth-child(2)').classList.remove('show');
      });
    });
  });
  

// Galeria

const flechaIzquierda = document.getElementById('flecha-izquierda');
const flechaDerecha = document.getElementById('flecha-derecha');
const fotosImagenes = document.querySelector('.fotos-imagenes');

flechaIzquierda.addEventListener('click', () => {
  fotosImagenes.scrollBy({
    top: 0,
    left: -300,
    behavior: 'smooth'
  });
});

flechaDerecha.addEventListener('click', () => {
  fotosImagenes.scrollBy({
    top: 0,
    left: 300,
    behavior: 'smooth'
  });
});
