function onTextReady(text) {
    console.log(text);
    // convert response from JSON text to Object 
    const resultObject = JSON.parse(text);
    console.log(resultObject);
    // get number of available rooms for each room type
    const results = resultObject.results;
    const std_d_available = results[0].count;
    const std_t_available = results[1].count;
    const sup_d_available = results[2].count;
    const sup_t_available = results[3].count;

    // insert number of available room to html file
    const pStd_t = document.getElementById('std_t');
    pStd_t.textContent = `Available Rooms: ${std_t_available}`;

    const pStd_d = document.getElementById('std_d');
    pStd_d.textContent = `Available Rooms: ${std_d_available}`;

    const pSup_t = document.getElementById('sup_t');
    pSup_t.textContent = `Available Rooms: ${sup_t_available}`;

    const pSup_d = document.getElementById('sup_d');
    pSup_d.textContent = `Available Rooms: ${sup_d_available}`;

}


function onResponse(response) {
    return response.text();
}

function createData(checkInDate, checkOutDate) {
    const data = {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
    };
    return JSON.stringify(data);
}

function createOptions(data) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    };
    return fetchOptions;
}

function processSubmit(e) {
    e.preventDefault();
    const divCheckDate = document.querySelector('.check__date'); 
    const checkInDate = divCheckDate.children[1];
    console.log(checkInDate.value);
    const checkOutDate = divCheckDate.children[2];
    console.log(checkOutDate.value);
    const data = createData(checkInDate.value.trim(), checkOutDate.value.trim());
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/booking/form', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const formBook = document.querySelector('.check__details-form');
formBook.addEventListener('submit', processSubmit);