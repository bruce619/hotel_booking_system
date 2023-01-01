const search_booking = document.querySelector('.check__details-form');


function sendAvailableRooms(e){
    e.preventDefault();

    function onTextReady(text){
        console.log(`This is my text data ${text}`)
        console.log(`This is my text data type ${typeof(text)}`)
        localStorage.setItem('results', text)
        window.location.href = '/available/rooms';
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


    const divCheckDate = document.querySelector('.check__date'); 
    const checkInDate = divCheckDate.children[1];
    console.log(checkInDate.value);
    const checkOutDate = divCheckDate.children[2];
    console.log(checkOutDate.value);
    const data = createData(checkInDate.value.trim(), checkOutDate.value.trim());
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);


    fetch('/available/rooms', fetchOptions)
    .then(onResponse)
    .then(onTextReady)
    .catch((error) => {
      console.error('Error:', error);
    });



// end of function
}


search_booking.addEventListener("submit", sendAvailableRooms);