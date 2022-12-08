// select name
const user_name = document.querySelector('#name');

// select email
const email = document.querySelector('#email');

// address 
const address = document.querySelector('#address')

// select card-type
const card_type = document.querySelector('#card_type');

// select card-number
const card_number = document.querySelector('#card_number');

// select expiry
const card_expiry = document.querySelector('#expiry');

// grab error div
const error_msg = document.querySelector("#error");

// payment form
const payment_form = document.querySelector('#payment_form');


// using JS input event to give spaces inbetween each 4 digit of debit card number
card_number.addEventListener("input", () => card_number.value = spaceNumber(card_number.value.replaceAll(" ", "")));

// function to space numbers
const spaceNumber = (num) => num.split("").reduce((seed, next, index) => {
  if (index !== 0 && !(index % 4)) seed += " ";
  return seed + next;
}, "");

// make sure only digit can be typed as card number
function inputNumberOnly(event){
  const char = String.fromCharCode(event.which);

  if (!(/[0-9]/.test(char))){
    event.preventDefault();
  }
  
};

card_number.addEventListener('keypress', inputNumberOnly);


// using JS input event to format card expiry month and year
card_expiry.addEventListener("input", () => card_expiry.value = formatDate(card_expiry.value.replace("/", "")));

const formatDate = (val) => val.split("").reduce((seed, next, index) => {
  if (index !==0 && !(index % 2)) seed += "/";
    return seed + next
});

card_expiry.addEventListener('keypress', inputNumberOnly);


payment_form.addEventListener("submit", (event) => {

  console.log(card_number.value)
  console.log(card_expiry.value)

  let messages = []

  if (card_number.value.length !== 19){
    messages.push("card must be 16 digits");
  }

  if (card_expiry.value.length !== 5){
    messages.push("invalid expiry date. must be in the format mm/yy e.g 02/22")
  }

  if (messages.length > 0){
    event.preventDefault();
    error_msg.innerHTML = messages.join(', ')
  }

  if (typeof(localStorage) != "undefined") {

    data = {
      "user_name": user_name.value,
      "email": email.value,
      "address": address.value,
      "card_type": card_type.value,
      "card_number": card_number.value.replace(/\s/g, ''),
      "card_expiry": card_expiry.value
    }

    localStorage.setItem("form_data", JSON.stringify(data));
  }

});