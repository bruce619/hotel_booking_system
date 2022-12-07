// grab the form fields

// select name
const name = document.querySelector('#name');

// select email
const email = document.querySelector('#email');

// select card-type
const card_type = document.querySelector('#card-type');

// select card-number
const card_number = document.querySelector('#card-number');

// select expiry
const card_expiry = document.querySelector('#expiry');


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