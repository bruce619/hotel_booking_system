document.addEventListener('DOMContentLoaded', ()=>{

    // go back to the payment form page with the reset button
    const button_reset = document.querySelector('#reset');
 
    button_reset.addEventListener("click", ()=>{
        window.location = '/payment/form';
    });

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


    // confirmation form


//     const button_booking = document.querySelector('#submit');

    if (typeof(localStorage) != "undefined"){
        let form_data = JSON.parse(localStorage.getItem("form_data"));
        user_name.value = form_data.user_name,
        email.value = form_data.email,
        address.value = form_data.address,
        card_type.value = form_data.card_type,
        card_number.value = form_data.card_number,
        card_expiry.value = form_data.card_expiry
    }
  
  });


  
  