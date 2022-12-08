document.addEventListener('DOMContentLoaded', ()=> {

    // go back to the payment form page with the reset button
const button_reset = document.querySelector('#reset');

button_reset.addEventListener("click", ()=>{
    window.location.href = '/payment/form';
});

    // select name
    const name = document.querySelector('#name');

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

    // submit booking form
    const conformation_form = document.querySelector('#confirmation_form');

    console.log(localStorage.getItem("data"))
    console.log(typeof(localStorage.getItem("data")))

    // make sure the getItem store in localstorage isn't undefined
    if (typeof(localStorage.getItem) !== 'undefined'){

        const data = JSON.parse(localStorage.getItem("data"));

        console.log(data);

        name.value = data.c_name
        email.value = data.c_email
        address.value = data.c_address
        card_type.value = data.c_cardtype
        card_number.value = data.c_cardno
        card_expiry.value = data.c_cardexp

    }


    console.log(`this is the new name ${name.value}`)


    conformation_form.addEventListener("submit", (e) => {
        e.preventDefault();

        let messages = []

            if (card_number.value.length !== 16){
                messages.push("card must be 16 digits");
            }
  
            if (card_expiry.value.length !== 5){
                messages.push("invalid expiry date. must be in the format mm/yy e.g 02/22")
            }
  
            if (messages.length > 0){
            e.preventDefault();
            error_msg.innerHTML = messages.join(', ')
            };

            function randomUserId(min, max){
                return Math.floor(Math.random() * (max - min + 1) + min)
            }

            function RandomFloat(min, max, decimals) {
                return Math.floor(Math.random() * (max - min) + min).toFixed(decimals);
            }

            const booking_data = {
            "c_no": randomUserId(13000, 30000),
            "c_name": name.value,
            "c_email": email.value,
            "c_address": address.value,
            "c_cardtype": card_type.value,
            "c_cardexp": card_expiry.value,
            "c_cardno": card_number.value,
            "b_cost": RandomFloat(62, 400, 2),
            "b_outstanding": 0,
            "b_notes": "",
            "b_ref": randomUserId(14000, 20000),
            "checkin": "20Dec2022",
            "checkout": "25Jan2023"
        }

    })



  });


//   conformation_form.addEventListener("submit", (event) => {

//     console.log(card_number.value)
//     console.log(card_expiry.value)
  
//     let messages = []


    
//     function onTextReady(text){
//         console.log(text);
//     }
    
//     function onResponse(res){
//         return res.text();
//     }

    
//     const serializedMessage = JSON.stringify(booking_data);
    
//     const fetchOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },

//         body: serializedMessage
//     }


//     fetch('/payment/confirmed', fetchOptions)
//     .then(onResponse)
//     .then(onTextReady);

// });