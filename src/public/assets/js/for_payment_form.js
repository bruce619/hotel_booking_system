function processSubmit(e) {
    e.preventDefault();

    let messages = []


    // inputed number of rooms by room type
    let std_t_no = document.querySelector('#form_std_t').number_of_rooms.value;
    let std_d_no = document.querySelector('#form_std_d').number_of_rooms.value;
    let sup_t_no = document.querySelector('#form_sup_t').number_of_rooms.value;
    let sup_d_no = document.querySelector('#form_sup_d').number_of_rooms.value;

    // check in and check out dates
    const checkindate = document.querySelector('#checkin').value
    const checkoutdate = document.querySelector('#checkout').value

    // get available room numbers for each room type
    const av_std_t_no = document.querySelector('#std_t').textContent;
    const av_std_d_no = document.querySelector('#std_d').textContent;
    const av_sup_t_no = document.querySelector('#sup_t').textContent;
    const av_sup_d_no = document.querySelector('#sup_d').textContent;

    // grab the value of the availabale rom and turn convert it to integer
    const std_t_v = +av_std_t_no.charAt(av_std_t_no.length - 1)
    const std_d_v = +av_std_d_no.charAt(av_std_d_no.length - 1)
    const sup_t_v = +av_sup_t_no.charAt(av_sup_t_no.length - 1)
    const sup_d_v = +av_sup_d_no.charAt(av_sup_d_no.length - 1)

    // grab error div
    const error_msg = document.querySelector("#error");

    console.log(std_t_no);
    console.log(std_d_no);
    console.log(sup_t_no);
    console.log(sup_d_no);
    console.log(checkindate);
    console.log(checkoutdate);

    const message = "Invalid entry. You selected number of rooms is more than the available rooms";

    if (std_t_no > std_t_v){
        messages.push(message)
    }

    if (std_d_no > std_d_v){
        messages.push(message)
    }

    if (sup_t_no > sup_t_v){
        messages.push(message)
    }

    if (sup_d_no > sup_d_v){
        messages.push(message)
    }

    if (std_t_no === '0' && std_d_no === '0' && sup_t_no === '0' && sup_d_no === '0'){
        messages.push('You must select a room to be able to make a payment')
    }

    if (messages.length > 0){
        e.preventDefault();
        error_msg.innerHTML = messages.join(', ')
    } else {

        let data = {
            "std_t": std_t_no,
            "std_d": std_d_no,
            "sup_t": sup_t_no,
            "sup_d": sup_d_no
        }
    
        total_cost = (data.std_t * 62) + (data.std_d * 65) + (data.sup_t * 72) + (data.sup_d * 77)
    
        final = {
                "data": data,
                "total_cost": total_cost,
                "checkin": checkindate,
                "checkout": checkoutdate
            }
    
        const serializedData = JSON.stringify(final) 
    
        fetch('/available/rooms', {  
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: serializedData
        })
        .then((response) => response.json())
        .then((final) => {
        console.log('Success:', final);
        localStorage.setItem("final", serializedData);
        window.location.href = '/payment/form' // page where data recieve
        })
        .catch((error) => {
        console.error('Error:', error);
        });    

    }

// end of event
}

const form_available = document.querySelector('#form_available');
form_available.addEventListener('submit', processSubmit);

// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage