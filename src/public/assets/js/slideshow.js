// JS for Rooms
let room_slideIndex = 1;
room_showSlides(room_slideIndex);

// Next/previous controls
function room_plusSlides(n) {
  room_showSlides(room_slideIndex += n);
}

// Thumbnail image controls
function room_currentSlide(n) {
  room_showSlides(room_slideIndex = n);
}

function room_showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("room_slides");
  let dots = document.getElementsByClassName("room_demo");
  let captionText = document.getElementById("room_caption");
  if (n > slides.length) {room_slideIndex = 1}
  if (n < 1) {room_slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[room_slideIndex-1].style.display = "block";
  dots[room_slideIndex-1].className += " active";
  captionText.innerHTML = dots[room_slideIndex-1].alt;
}
//   JS for Facilities
let fac_slideIndex = 1;
fac_showSlides(fac_slideIndex);

// Next/previous controls
function fac_plusSlides(n) {
    fac_showSlides(fac_slideIndex += n);
}

// Thumbnail image controls
function fac_currentSlide(n) {
    fac_showSlides(fac_slideIndex = n);
}

function fac_showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("fac_slides");
  let dots = document.getElementsByClassName("fac_demo");
  let captionText = document.getElementById("fac_caption");
  if (n > slides.length) {fac_slideIndex = 1}
  if (n < 1) {fac_slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[fac_slideIndex-1].style.display = "block";
  dots[fac_slideIndex-1].className += " active";
  captionText.innerHTML = dots[fac_slideIndex-1].alt;
}

//   JS for Attractions
let att_slideIndex = 1;
att_showSlides(att_slideIndex);

// Next/previous controls
function att_plusSlides(n) {
    att_showSlides(att_slideIndex += n);
}

// Thumbnail image controls
function att_currentSlide(n) {
    att_showSlides(att_slideIndex = n);
}

function att_showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("att_slides");
  let dots = document.getElementsByClassName("att_demo");
  let captionText = document.getElementById("att_caption");
  if (n > slides.length) {att_slideIndex = 1}
  if (n < 1) {att_slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[att_slideIndex-1].style.display = "block";
  dots[att_slideIndex-1].className += " active";
  captionText.innerHTML = dots[att_slideIndex-1].alt;
}