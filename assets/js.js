  //para scrollear suaave
  window.addEventListener("scroll", () => {
    var scrollPosition = window.scrollY; //obtengo posición de desplazamiento vertical
    var carouselSection = document.querySelector("#carousel"); //selecciono la sección del carrusel
    var nav = document.querySelector("nav"); //selecciono la barra de navegación
  
    // compruebo si la posición de desplazamiento es mayor que la posición superior del carrusel
    if (scrollPosition > carouselSection.offsetTop) {
      nav.parentElement.classList.add("scrolled"); //agrego una clase al contenedor de la barra de navegación para cambiar su estilo
    } else {
      nav.parentElement.classList.remove("scrolled"); //saco la clase del contenedor de la barra de navegación
    }
  });


  
  //////////////////////////CARRUSEL 3D/////////////////////////////////

  $(document).ready(function() {
    var carousel = $(".carousel"); //selecciono el carrusel
    var currdeg = 0; //almaceno el ángulo actual de rotación del carrusel
    var startX = 0; //almaceno la posición inicial del mouse en el eje X
    var startY = 0; //almaceno la posición inicial del mouse en el eje Y
    var distX = 0; //almaceno la distancia en píxeles que se movió el mouse en el eje X
    var distY = 0; //almaceno la distancia en píxeles que se movió el mouse en el eje Y
    var threshold = 50; //umbral de sensibilidad para distinguir entre desplazamiento horizontal y vertical
    var itemWidth = carousel.find(".item").width(); //ancho de cada elemento del carrusel
    var carouselWidth = carousel.width(); //ancho total del carrusel
    var itemAngle = 60; //ángulo de rotación por cada elemento del carrusel
    var isDragging = false; //indica si se está arrastrando actualmente el carrusel
    var containerClicked = false; //indica si se hizo clic o se tocó el carrusel
  
    //evento "mousedown touchstart": inicio del deslizamiento/ drag
    $(".carouselContainer").on("mousedown touchstart", function(e) {
      containerClicked = true; //indica q se hizo clic o se tocó el carrusel
      var touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
      startX = touch.clientX; //almaceno la posición inicial del mouse en el eje X
      startY = touch.clientY; //almaceno la posición inicial del mouse en el eje Y
      isDragging = false; //reinicio el estado del deslizamiento
    });
  
    //evento "mousemove touchmove": Mmvimiento del mouse durante el deslizamiento
    $(window).on("mousemove touchmove", function(e) {
      if (!containerClicked) return; //si no se hizo clic o se tocó el carrusel, no hace nada
  
      var touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
      distX = touch.clientX - startX; //calcula la distancia que se movió el mouse en el eje X
      distY = touch.clientY - startY; //calcula la distancia que se movió el mouse en el eje Y
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
        //si la distancia horizontal es mayor que la vertical y supera el umbral, activa el arrastre horizontal
        e.preventDefault();
        isDragging = true; //indica que se está arrastrando
        var rotateY = currdeg + (distX / carouselWidth) * itemAngle; //calcula el ángulo de rotación
        carousel.css({
          "-webkit-transform": "rotateY(" + rotateY + "deg)",
          "-moz-transform": "rotateY(" + rotateY + "deg)",
          "-o-transform": "rotateY(" + rotateY + "deg)",
          transform: "rotateY(" + rotateY + "deg)"
        });
      }
    });
  
    //evento "mouseup touchend": fin del arrastre/deslizamiento
    $(window).on("mouseup touchend", function(e) {
      if (!containerClicked) return; //si no se hizo clic o se tocó el carrusel, no hace nada
      containerClicked = false; //reinicia el estado del clic o toque en el carrusel
  
      if (isDragging) {
        //si se estaba arrastrando, actualiza el ángulo de rotación según el movimiento horizontal
        currdeg += Math.round(distX / carouselWidth) * itemAngle;
        isDragging = false; //reinicia el estado del arrastre
      } else {
        var clickX = e.clientX || e.originalEvent.changedTouches[0].clientX;
        var containerOffset = carousel.parent().offset().left;
        var clickOffset = clickX - containerOffset;
        var halfItemWidth = itemWidth / 2;
        if (clickOffset > halfItemWidth) {
          //si se hizo clic en la mitad derecha del elemento, retrocede al elemento anterior
          currdeg -= itemAngle;
        } else {
          //si se hizo clic en la mitad izquierda del elemento, avanza al siguiente elemento
          currdeg += itemAngle;
        }
      }
  
      carousel.css({
        "-webkit-transform": "rotateY(" + currdeg + "deg)",
        "-moz-transform": "rotateY(" + currdeg + "deg)",
        "-o-transform": "rotateY(" + currdeg + "deg)",
        transform: "rotateY(" + currdeg + "deg)"
      });
  
      updateActiveDot(); // actualiza el puntito q está activo en el paginador
    });
  
    //////////////////////eventos "click" de los botones anterior y siguiente/////////////////

    //evento "click" del botón "prev"- retrocede al elemento anterior
    $(".prev").on("click", function() {
      currdeg += itemAngle;
      updateCarousel();
    });

    //evento "click" del botón "next"- avanza al siguiente elemento
    $(".next").on("click", function() {
      currdeg -= itemAngle;
      updateCarousel();
    });
    
    //evento "click" de los puntitos del paginador
    $(".dot").on("click", function() {
      var dotIndex = $(this).data("index"); //obtengo el índice del punto seleccionado
      var targetDeg = -dotIndex * itemAngle; //calculo el ángulo de rotación objetivo
      currdeg = targetDeg; //establezco el ángulo de rotación actual
      updateCarousel(); //actualizo el carrusel
    });

    ///////////////////FUNCIÓN QUE actualiza el carrusel con la rotación y el estilo correspondientes////////
    /////////////////////////////// ES LAAAA FUNCIÓN1!!!!!!
    function updateCarousel() {
      carousel.css({
        "-webkit-transform": "rotateY(" + currdeg + "deg)",
        "-moz-transform": "rotateY(" + currdeg + "deg)",
        "-o-transform": "rotateY(" + currdeg + "deg)",
        transform: "rotateY(" + currdeg + "deg)"
      });

      updateActiveDot(); //actualiza el puntito activo en el paginador
    }

    function updateActiveDot() {
      //actualiza el punto activo en el paginador según la rotación actual del carrusel
      var totalItems = $(".carousel .item").length; //obtiene el número total de elementos
      var dotIndex = Math.abs(Math.round(currdeg / itemAngle)) % totalItems; //calcula el índice del puntito activo
      $(".dot").removeClass("active"); //saca la clase "active" de todos los puntos
      $(".dot[data-index='" + dotIndex + "']").addClass("active"); //agrega la clase "active" al puntito activo
    }
});

  


//PARA CUANDO QUIERO ABRIR UNA RECETA DESDE EL CARRUSEL
  $(document).ready(function() {
    //controlador de eventos para hacer clic en los enlaces del carrusel
    $(".item-content").on("click", function(e) {
      e.preventDefault();
  
      //obtengo el identificador de la sección a mostrar desde el atributo href del enlace
      var targetSection = $(this).attr("href");
  
      //muestro la hidden section
      $(targetSection).removeClass("hidden-section");
  
      //desplazo con scroll despacito hacia la sección
      $('html, body').animate({
        scrollTop: $(targetSection).offset().top
      }, 800);
    });
  
    //controlador de eventos para hacer clic en el enlace de "cerrar"
    $(".close-button").on("click", function(e) {
      e.preventDefault();
  
      //obtengo la sección actual
      var currentSection = $(this).closest("section");
  
      //la oculto agregándole hidden de vuelta
      currentSection.addClass("hidden-section");
  
      //me desplazo despacito hacia la sección del carrusel
      $('html, body').animate({
        scrollTop: $("#carousel").offset().top
      }, 800);
    });
  });
  
  ///////////////////////////FIN DEL CARRUSEL 3D/////////////////////////


  ////////////////MENÚ HAMBURGUESA///////////////////// 
  const menuButton = document.querySelector('.menu-button'); //selecciona el botón del menú hamburguesa
  const navbarContainer = document.querySelector('.navbar-container'); //selecciona el contenedor de la barra de navegación
  
  //evento de clic en el botón del menú hamburguesa
  menuButton.addEventListener('click', function() {
    navbarContainer.classList.toggle('open'); // clase 'open' en el contenedor de la barra de navegación
  });
  
  const navbarLinks = document.querySelectorAll('.navbar-container a'); //agarro todos los enlaces de la barra de navegación
  
  //sobre cada enlace de la barra de navegación
  navbarLinks.forEach(function(navbarLink) {
    navbarLink.addEventListener('click', function() {
      navbarContainer.classList.remove('open'); //saco la clase 'open' del contenedor de la barra de navegación al hacer clic en un enlace
    });
  });
