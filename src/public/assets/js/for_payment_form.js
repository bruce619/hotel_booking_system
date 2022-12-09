function processSubmit(e) {
    e.preventDefault();

    const std_t_no = document.querySelector('#form_std_t').number_of_rooms.value;
    const std_d_no = document.querySelector('#form_std_d').number_of_rooms.value;
    const sup_t_no = document.querySelector('#form_sup_t').number_of_rooms.value;
    const sup_d_no = document.querySelector('#form_sup_d').number_of_rooms.value;

    console.log(std_t_no);
    console.log(std_d_no);
    console.log(sup_t_no);
    console.log(sup_d_no);

    const divCheckDate = document.querySelector('.check__date'); 
    const checkInDate = divCheckDate.children[1];
    const checkindate = checkInDate.value;

    const checkOutDate = divCheckDate.children[2];
    const checkoutdate = checkOutDate.value;

    console.log(checkindate);
    console.log(checkoutdate);

    data = {
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
    window.location = '/payment/form'
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

const form_available = document.querySelector('#form_available');
form_available.addEventListener('submit', processSubmit);


// // ----------
// data = {
//     "std_t": 2,
//     "std_d": 1,
//     "sup_t": 0,
//     "sup_d": 0
// }

// total_cost = (data.std_t * 62) + (data.std_d * 65) + (data.sup_t * 72) + (data.sup_d * 77)

// final = {
//     "data": data,
//     "total_cost": total_cost,
//     "checkin": '12/2/2022'
//     "checkout": '12/7/2022'
// }