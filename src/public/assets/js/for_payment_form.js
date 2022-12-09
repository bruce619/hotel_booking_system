function processSubmit(e) {
    e.preventDefault();

    // inputed number of rooms by room type
    let std_t_no = document.querySelector('#form_std_t').number_of_rooms.value;
    let std_d_no = document.querySelector('#form_std_d').number_of_rooms.value;
    let sup_t_no = document.querySelector('#form_sup_t').number_of_rooms.value;
    let sup_d_no = document.querySelector('#form_sup_d').number_of_rooms.value;

    console.log(std_t_no);
    console.log(std_d_no);
    console.log(sup_t_no);
    console.log(sup_d_no);

    // inputed check in & check out date
    const divCheckDate = document.querySelector('.check__date'); 
    const checkInDate = divCheckDate.children[1];
    const checkindate = checkInDate.value;

    const checkOutDate = divCheckDate.children[2];
    const checkoutdate = checkOutDate.value;

    console.log(checkindate);
    console.log(checkoutdate);

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
    window.location = '/payment/form' // page where data recieve
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

const form_available = document.querySelector('#form_available');
form_available.addEventListener('submit', processSubmit);

// code referenced from : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage