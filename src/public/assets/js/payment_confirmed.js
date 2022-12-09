document.addEventListener("DOMContentLoaded", ()=>{

    // booking ref num
    const book_ref = document.querySelector('.ref__number');

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


    console.log(localStorage.getItem("booking_data"))
    console.log(typeof(localStorage.getItem("booking_data")))


    // make sure the getItem store in localstorage isn't undefined
    if (typeof(localStorage.getItem) !== 'undefined'){
        
        const data = JSON.parse(localStorage.getItem("booking_data"));

        book_ref.textContent = data.b_ref
        total_price.textContent = data.b_cost
        user_name.value = data.c_name
        email.value = data.c_email
        address.value = data.c_address
        card_type.value = data.c_cardtype
        card_number.value = data.c_cardno
        card_expiry.value = data.c_cardexp
        std_t.textContent = data.std_t
        std_d.textContent = data.std_d
        sup_t.textContent = data.std_t
        sup_d.textContent = data.sup_d
        check_in.value = data.checkin
        check_out.value = data.checkout

    }


// end of event
})

// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage