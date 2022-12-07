

// const modalButton1 = document.getElementById("btn1");
// const modalButton2 = document.getElementById("btn2");
// const modalButton3 = document.getElementById("btn3");
// const modalButton4 = document.getElementById("btn4");
// const modalButton5 = document.getElementById("btn5");
// const modalButton6 = document.getElementById("btn6");
// const modalButton7 = document.getElementById("btn7");
// const modalButton8 = document.getElementById("btn8");
// Ray Code

const modalButton1 = document.getElementById("room1");
const modalButton2 = document.getElementById("room2");
const modalButton3 = document.getElementById("room3");
const modalButton4 = document.getElementById("room4");
// const modalButton5 = document.getElementById("btn5");
// const modalButton6 = document.getElementById("btn6");
// const modalButton7 = document.getElementById("btn7");
// const modalButton8 = document.getElementById("btn8");

const modals = document.querySelectorAll(".modal");
const modalCloseButtons = document.querySelectorAll(".modal-close");


modalButton1.addEventListener("click", event => toggleModal("modal1"));
modalButton2.addEventListener("click", event => toggleModal("modal2"));
modalButton3.addEventListener("click", event => toggleModal("modal3"));
modalButton4.addEventListener("click", event => toggleModal("modal4"));
// modalButton5.addEventListener("click", event => toggleModal("modal5"));
// modalButton6.addEventListener("click", event => toggleModal("modal6"));
// modalButton7.addEventListener("click", event => toggleModal("modal7"));
// modalButton8.addEventListener("click", event => toggleModal("modal8"));






modalCloseButtons.forEach(elem => {
  elem.addEventListener("click", event => toggleModal(event.currentTarget.closest(".modal").id));
});
modals.forEach(elem => {
  elem.addEventListener("click", event => {
    if(event.currentTarget === event.target) toggleModal(event.currentTarget.id);
  });
});


document.addEventListener("keydown", event => {
  if(event.keyCode === 27 && document.querySelector(".modal.modal-show")) {
    toggleModal(document.querySelector(".modal.modal-show").id);
  }
});

function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
console.log("placeholder")
  if(getComputedStyle(modal).display==="flex") { 
    modal.classList.add("modal-hide");
    setTimeout(() => {
      document.body.style.overflow = "initial"; 
      modal.classList.remove("modal-show", "modal-hide");
      modal.style.display = "none";      
    }, 200);
  }
  else {
    document.body.style.overflow = "hidden"; 
    modal.style.display = "flex";
    modal.classList.add("modal-show");
  }
}