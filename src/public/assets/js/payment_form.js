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

const payment_button = document.querySelector('#submit')


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


document.addEventListener('DOMContentLoaded', (e)=>{


  console.log(`This is my final data: ${localStorage.getItem("final")}`)
  console.log(`This is my final data type ${typeof(localStorage.getItem("final"))}`)

  const final = JSON.parse(localStorage.getItem("final"))

  console.log(`This is my final data: ${final}`)
  console.log(`This is my final data: ${typeof(final)}`)

  if (final.total_cost === 0){
    e.preventDefault()

    error_msg.textContent = 'You must select a room to be able to make a payment'

  }

  localStorage.setItem("final", JSON.stringify(final))

})


card_number.addEventListener('keypress', inputNumberOnly);


// using JS input event to format card expiry month and year
card_expiry.addEventListener("input", () => card_expiry.value = formatDate(card_expiry.value.replace("/", "")));

const formatDate = (val) => val.split("").reduce((seed, next, index) => {
  if (index !==0 && !(index % 2)) seed += "/";
    return seed + next
});

card_expiry.addEventListener('keypress', inputNumberOnly);



function processPaymentForm(e){

    e.preventDefault();

    let messages = []

    const final = JSON.parse(localStorage.getItem("final"))

    console.log(`This is final data total cost in processpaymentform ${final.total_cost}`)

    if (card_number.value.length !== 19){
      messages.push("card must be 16 digits");
    }

    if (card_expiry.value.length !== 5){
      messages.push("invalid expiry date. must be in the format mm/yy e.g 02/22")
    }

    if (final.total_cost === 0){
      messages.push('You must select a room to be able to make a payment');
    }

    if (messages.length > 0){
      e.preventDefault();
      error_msg.innerHTML = messages.join(', ')
    }


    function onTextReady(text){
      console.log(text);
      console.log(typeof(text));
      // pass data to payment/confirmation
      localStorage.setItem("data", text)
      window.location.href = '/payment/confirmation';
    }
  
  function onResponse(res){
      return res.text()
  }

    data = {
      "c_name": user_name.value,
      "c_email": email.value,
      "c_address": address.value,
      "c_cardtype": card_type.value,
      "c_cardno": card_number.value.replace(/\s/g, ''),
      "c_cardexp": card_expiry.value,
      "checkin": final.checkin,
      "checkout": final.checkout,
      "std_t": final.data.std_t,
      "std_d": final.data.std_d,
      "sup_t": final.data.sup_t,
      "sup_d": final.data.sup_d,
      "b_cost": final.total_cost
    }


  console.log(`Here is data in payment form ${data}`)

  // serialize the data
  const serializedData = JSON.stringify(data) 


    fetch('/payment/confirmation', {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: serializedData
  })
  .then(onResponse)
  .then(onTextReady)
  .catch((error) => {
      console.error('Error:', error);
    });



// end
}

payment_form.addEventListener("submit", processPaymentForm);






// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage