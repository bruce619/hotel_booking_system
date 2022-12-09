// go back to the payment form page with the reset button
const button_reset = document.querySelector('#reset');

// check in
const check_in = document.querySelector('#checkIN');

// check out
const check_out = document.querySelector('#checkOut');

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


// total_cost
// const total_cost = document.querySelector('#price')


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
        
        console.log(`I am in the payment confirmation page ${data}`);


        const r_nos_std_t = []
        const r_nos_std_d = []

        const r_nos_sup_t = []
        const r_nos_sup_d = []


        const db_results = data.results;

        const req_data = data.req_data;

        const r_std_t = req_data.std_t

        const r_std_d = req_data.std_d

        const r_sup_t = req_data.sup_t

        const r_sup_d = req_data.sup_d


        for(let i = 0; i < db_results.length; i++){
            if (db_results[i].r_class == 'std_t'){
                r_nos_std_t.push(db_results[i].r_no)
            } else if (db_results[i].r_class == 'std_d'){
                r_nos_std_d.push(db_results[i].r_no)
            } else if (db_results[i].r_class == 'sup_t'){
                r_nos_sup_t.push(db_results[i].r_no)
            } else if (db_results[i].r_class == 'sup_d'){
                r_nos_sup_d.push(db_results[i].r_no)
            } else {

            }
        }

            console.log(`here is the check in data ${req_data.checkin.replace(/-/g, "/")}`);
            
            check_in.value = req_data.checkin
            check_out.value = req_data.checkout 
            total_price.textContent = req_data.b_cost 
            std_t.textContent = req_data.std_t
            std_d.textContent = req_data.std_d
            sup_t.textContent = req_data.sup_t
            sup_d.textContent = req_data.sup_d 
            c_name.value = req_data.c_name
            c_email.value = req_data.c_email
            c_address.value = req_data.c_address
            c_cardtype.value = req_data.c_cardtype
            c_cardno.value = req_data.c_cardno
            c_cardexp.value = req_data.c_cardexp

        // end of if 
    }


    // end of event
})


function processPaymentConfirmation(e){

    e.preventDefault();


    // make sure the getItem store in localstorage isn't undefined
    if (typeof(localStorage.getItem) !== 'undefined'){

            const data = JSON.parse(localStorage.getItem("data"));
        
            console.log(`I am in the payment confirmation page ${data}`);


            const r_nos_std_t = []
            const r_nos_std_d = []

            const r_nos_sup_t = []
            const r_nos_sup_d = []


            const db_results = data.results;

            const req_data = data.req_data;

            const r_std_t = req_data.std_t

            const r_std_d = req_data.std_d

            const r_sup_t = req_data.sup_t

            const r_sup_d = req_data.sup_d


            // push into array
            for(let i = 0; i < db_results.length; i++){
                if (db_results[i].r_class == 'std_t'){
                    r_nos_std_t.push(db_results[i].r_no)
                } else if (db_results[i].r_class == 'std_d'){
                    r_nos_std_d.push(db_results[i].r_no)
                } else if (db_results[i].r_class == 'sup_t'){
                    r_nos_sup_t.push(db_results[i].r_no)
                } else if (db_results[i].r_class == 'sup_d'){
                    r_nos_sup_d.push(db_results[i].r_no)
                } else {
                        // do not push to any array
                }
            }

            
            console.log(`std_t ${r_nos_std_t}`);
            console.log(`std_d ${r_nos_std_d}`);
            console.log(`sup_t ${r_nos_sup_t}`);
            console.log(`sup_d ${r_nos_sup_d}`);

            // if (r_std_t > 0 && r_){
            //     const std_t_ = r_std_t[0];
            // }
            // if (r_std_d > 0){
            //     const std_d_ = r_std_d[0];
            // }
            // if (r_nos_sup_t > 0){
            //     const sup_t_ = r_nos_sup_t[0];
            // }
            // if (r_nos_sup_d > 0){
            //     const sup_d_ = r_nos_sup_d[0]
            // }

            const std_d_ = r_nos_std_d[3];
        
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


            if (req_data.b_cost === 0){
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
                "b_cost": total_price.textContent,
                "b_outstanding": 0,
                "b_notes": "",
                "b_ref": randomGeneratedNumber(14000, 30000),
                "r_no": std_d_,
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
        

      // end of if
    };


// end function
}


conformation_form.addEventListener("submit", processPaymentConfirmation)


// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage