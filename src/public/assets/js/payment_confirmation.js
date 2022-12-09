// go back to the payment form page with the reset button
const button_reset = document.querySelector('#reset');

// check in
const check_in = document.querySelector('#checkin');

// check out
const check_out = document.querySelector('#checkout');

// total price
const total_price = document.querySelector('#price')

// standard twin
const std_t = document.querySelector('#standard-twin');

// standard double
const std_d = document.querySelector('#standard-double');

// superior twin
const sup_t = document.querySelector('#superior-twin');

// superior double
const sup_d = document.querySelector('#superior-double');


// select name
const c_name = document.querySelector('#name');

// select email
const c_email = document.querySelector('#email');

// address 
const c_address = document.querySelector('#address')

// select card-type
const c_cardtype = document.querySelector('#card_type');

// select card-number
const c_cardno = document.querySelector('#card_number');

// select expiry
const c_cardexp = document.querySelector('#expiry');

// grab error div
const error_msg = document.querySelector("#error");

// submit booking form
const conformation_form = document.querySelector('#confirmation_form');


// reset button handler
button_reset.addEventListener("click", ()=>{
    window.location.href = '/payment/form';
});


document.addEventListener("DOMContentLoaded", ()=>{

    console.log(localStorage.getItem("data"))
    console.log(typeof(localStorage.getItem("data")))

    // make sure the getItem store in localstorage isn't undefined
    if (typeof(localStorage.getItem) !== 'undefined'){
        
        const data = JSON.parse(localStorage.getItem("data"));
        
        console.log(data);
        console.log(`here is the check in data ${data.checkin.replace(/-/g, "/")}`);
        
        check_in.value = data.checkin
        check_out.value = data.checkout 
        total_price.textContent = data.b_cost 
        std_t.textContent = data.std_t
        std_d.textContent = data.std_d
        sup_t.textContent = data.sup_t
        sup_d.textContent = data.sup_d 
        c_name.value = data.c_name
        c_email.value = data.c_email
        c_address.value = data.c_address
        c_cardtype.value = data.c_cardtype
        c_cardno.value = data.c_cardno
        c_cardexp.value = data.c_cardexp
        }

})


function processPaymentConfirmation(e){

    e.preventDefault();
    
    let messages = []

    
    if (c_cardno.value.length !== 16){
        messages.push("card must be 16 digits");
    }
  
    if (c_cardexp.value.length !== 5){
        messages.push("invalid expiry date. must be in the format mm/yy e.g 02/22")
    }

    if (messages.length > 0){
        e.preventDefault();
        error_msg.textContent = messages.join(', ')
    };


    if (total_price.value == 0){
        messages.push('You must select a room to be able to make a payment');
        window.location.href = '/payment/form';
      }


    function randomGeneratedNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const booking_data = {
        "c_no": randomGeneratedNumber(13000, 30000),
        "c_name": c_name.value,
        "c_email": c_email.value,
        "c_address": c_address.value,
        "c_cardtype": c_cardtype.value,
        "c_cardexp": c_cardexp.value,
        "c_cardno": c_cardno.value,
        "b_cost": total_cost.textContent,
        "b_outstanding": 0,
        "b_notes": "",
        "b_ref": randomGeneratedNumber(14000, 30000),
        "checkin": check_in.value, 
        "checkout": check_out.value,
        "std_t": std_t.textContent, 
        "std_d": std_d.textContent,
        "sup_t": sup_t.textContent,
        "sup_d": sup_d.textContent
    }

    function onTextReady(text){
        console.log(text);
        console.log(typeof(text));
        // pass data to payment/confirmation
        localStorage.setItem("booking_data", text)
        window.location.href = '/payment/confirmed';   
    }
    
    function onResponse(res){
        return res.text();
    }

    const serializedBookingData = JSON.stringify(booking_data);


    fetch('/payment/confirmed', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: serializedBookingData
    })
    .then(onResponse)
    .then(onTextReady)
    .catch((error) => {
        console.error('Error:', error);
      });
  

// end function
}


conformation_form.addEventListener("submit", processPaymentConfirmation)


// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage