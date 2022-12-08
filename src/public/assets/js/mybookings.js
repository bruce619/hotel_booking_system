
function onTextReady(text) {

    //arrange response data
    const detailObject = JSON.parse(text);
    const results = detailObject.results;
    let i = 0;
    let elements = results[i];
    // console.log(results);
    console.log(results.length);

    // change search page to results page
    document.querySelector('.mybook h2').textContent = "Booking details";

    // erase indication message
    document.querySelector('p.mybook-indication').textContent = "";

    // page for the case there is no matched data
    if(results.length === 0){

        /// create error message
        const article = document.querySelector('article.mybook');
        const p = document.createElement('p');
        p.className = 'mybook-unavailable';
        p.textContent = 'Sorry...Booking reference number does not exist.';
        article.insertBefore(p, formMybookings);
        
    } else {

    // page for the case there is  matched data
    /// convert roomtype data to appropriate name
    let roomType;
    if (`${elements.r_class}` === 'std_t') {
        roomType = 'Standard Twin'
    } else if (`${elements.r_class}` === 'std_d') {
        roomType = 'Standard Double'
    } else if (`${elements.r_class}` === 'sup_t') {
        roomType = 'Superior Twin'
    } else {
        roomType = 'Superior Double'
    } 

    /// format date string
    let checkinDateSt = new Date(`${elements.checkin}`) ;
    let checkinDateCv = checkinDateSt.toUTCString();
    let checkin = checkinDateCv.split(' ');
    let checkinDate = checkin[1]+' '+checkin[2]+' '+checkin[3];
    console.log(checkinDate);

    let checkoutDateSt = new Date(`${elements.checkout}`) ;
    let checkoutDateCv = checkoutDateSt.toUTCString();
    let checkout = checkoutDateCv.split(' ');
    let checkoutDate = checkout[1]+' '+checkout[2]+' '+checkout[3];
    console.log(checkoutDate);

    // remove search form
    const oldform = formMybookings;
    oldform.remove();

    // create new div element
    const div = document.createElement('div');
    div.className = 'mybook-contents details';
    const article = document.querySelector('article.mybook');
    article.appendChild(div);

    // create Basic information table
    const tableBasic = document.createElement('table');
    tableBasic.className = 'search-results';
    div.appendChild(tableBasic);

    const p = document.createElement('p');
    p.textContent = 'Basic information';
    tableBasic.appendChild(p);

    /// title row
    const tr1 = document.createElement('tr');
    tableBasic.appendChild(tr1);
    const thBasicHead1 = document.createElement('th');
    tr1.appendChild(thBasicHead1);
    thBasicHead1.textContent = 'Booking ref no';
    const thBasicHead2 = document.createElement('th');
    tr1.appendChild(thBasicHead2);
    thBasicHead2.textContent = 'Check In date';
    const thBasicHead3 = document.createElement('th');
    tr1.appendChild(thBasicHead3);
    thBasicHead3.textContent = 'Check Out date';

    /// contents row
    const tr2 = document.createElement('tr');
    tableBasic.appendChild(tr2);
    const tdBasic1 = document.createElement('td');
    tdBasic1.id = 'booking-ref'
    tdBasic1.textContent = `${elements.b_ref}`;
    tr2.appendChild(tdBasic1);
    const tdBasic2 = document.createElement('td');
    tdBasic2.id = 'check-in';
    tdBasic2.textContent = checkinDate;
    tr2.appendChild(tdBasic2);
    const tdBasic3 = document.createElement('td');
    tdBasic3.id = 'check-out';
    tdBasic3.textContent = checkoutDate;
    tr2.appendChild(tdBasic3);

    // create Room information table
    const tableRoom = document.createElement('table');
    tableRoom.className = 'search-results';
    div.appendChild(tableRoom);

    const pRoom = document.createElement('p');
    pRoom.textContent = 'Room information';
    tableRoom.appendChild(pRoom);

    /// title row
    const trRoom1 = document.createElement('tr');
    tableRoom.appendChild(trRoom1);
    const thRoomHead1 = document.createElement('th');
    trRoom1.appendChild(thRoomHead1);
    thRoomHead1.textContent = 'Room no';
    const thRoomHead2 = document.createElement('th');
    trRoom1.appendChild(thRoomHead2);
    thRoomHead2.textContent = 'Room type';
    const thRoomHead3 = document.createElement('th');
    trRoom1.appendChild(thRoomHead3);
    thRoomHead3.textContent = 'Notes';



    /// contents row
    for (let i = 0; i < results.length; i++){
        let elements = results[i];
        const trRoom2 = document.createElement('tr');
        tableRoom.appendChild(trRoom2);
        const tdRoom1 = document.createElement('td');
        tdRoom1.id = 'room-no'
        tdRoom1.textContent = `${elements.r_no}`;
        trRoom2.appendChild(tdRoom1);
        const tdRoom2 = document.createElement('td');
        tdRoom2.id = 'room-type';
        tdRoom2.textContent = roomType ;
        trRoom2.appendChild(tdRoom2);
        const tdRoom3 = document.createElement('td');
        tdRoom3.id = 'room-notes';
        tdRoom3.textContent = `${elements.r_notes}`;
        trRoom2.appendChild(tdRoom3);
    }

    // create Customer information table
    const tableCustomer = document.createElement('table');
    tableCustomer.className = 'search-results';
    div.appendChild(tableCustomer);

    const pCustomer = document.createElement('p');
    pCustomer.textContent = 'Customer information';
    tableCustomer.appendChild(pCustomer);

    /// title row
    const trCustomer = document.createElement('tr');
    tableCustomer.appendChild(trCustomer);
    const thCustomerHead1 = document.createElement('th');
    trCustomer.appendChild(thCustomerHead1);
    thCustomerHead1.textContent = 'Customer no';
    const thCustomerHead2 = document.createElement('th');
    trCustomer.appendChild(thCustomerHead2);
    thCustomerHead2.textContent = 'Customer name';
    // const thCustomerHead3 = document.createElement('th');
    // trCustomer.appendChild(thCustomerHead3);
    // thCustomerHead3.textContent = 'Email address';
    // const thCustomerHead4 = document.createElement('th');
    // trCustomer.appendChild(thCustomerHead4);
    // thCustomerHead4.textContent = 'Address';

    /// contents row
    const trCustomer2 = document.createElement('tr');
    tableCustomer.appendChild(trCustomer2);
    const tdCustomer1 = document.createElement('td');
    tdCustomer1.id = 'customer-no'
    tdCustomer1.textContent = `${elements.c_no}`;
    trCustomer2.appendChild(tdCustomer1);
    const tdCustomer2 = document.createElement('td');
    tdCustomer2.id = 'customer-name';
    tdCustomer2.textContent = `${elements.c_name}`;
    trCustomer2.appendChild(tdCustomer2);

    // create Payment information table
    const tablePayment = document.createElement('table');
    tablePayment.className = 'search-results';
    div.appendChild(tablePayment);

    const pPayment = document.createElement('p');
    pPayment.textContent = 'Payment information';
    tablePayment.appendChild(pPayment);

    /// title row
    const trPayment = document.createElement('tr');
    tablePayment.appendChild(trPayment);
    const thPaymentHead1 = document.createElement('th');
    trPayment.appendChild(thPaymentHead1);
    thPaymentHead1.textContent = 'Cost';
    const thPaymentHead2 = document.createElement('th');
    trPayment.appendChild(thPaymentHead2);
    thPaymentHead2.textContent = 'Outstanding';

    /// contents row
    const trPayment2 = document.createElement('tr');
    tablePayment.appendChild(trPayment2);
    const tdPayment1 = document.createElement('td');
    tdPayment1.id = 'cost'
    tdPayment1.textContent = `${elements.b_cost}`;
    trPayment2.appendChild(tdPayment1);
    const tdPayment2 = document.createElement('td');
    tdPayment2.id = 'outstanding';
    tdPayment2.textContent = `${elements.b_outstanding}`;
    trPayment2.appendChild(tdPayment2);

    // create Note div
    const divNotes = document.createElement('div');
    div.appendChild(divNotes);

    const pNotes = document.createElement('p');
    pNotes.id = 'booking-notes'
    pNotes.textContent = 'Notes';
    divNotes.appendChild(pNotes);

    /// contents box
    const pNotesContent = document.createElement('p');
    pNotesContent.className = 'booking-notes';
    pNotesContent.textContent = `${elements.b_notes}`;
    divNotes.appendChild(pNotesContent);

    // create button to back to top and to update checkin and payment&Checkout
    const divBtn = document.createElement('div');
    divBtn.className = 'btn-grid';
    div.appendChild(divBtn);
    
    /// button to back to top
    const labelBack = document.createElement('label');
    divBtn.appendChild(labelBack);

    const a = document.createElement('a');
    // **input path
    a.href = '';
    a.className = 'mybooking-btn';
    a.textContent = 'Back';
    labelBack.appendChild(a);

    /// button to change booking
    const formChange = document.createElement('form');
    formChange.action = '';
    formChange.method = 'POST';
    formChange.name = '';
    formChange.id = '';
    divBtn.appendChild(formChange);

    const labelChange = document.createElement('label');
    formChange.appendChild(labelChange);

    const btnChange = document.createElement('button');
    btnChange.type = 'submit';
    btnChange.className = 'recep-btn detail-btn';
    btnChange.value = `${elements.b_ref}`;
    btnChange.textContent = 'Change Booking';
    btnChange.id= ''
    labelChange.appendChild(btnChange);

}

}

function onResponse(response) {
    return response.text();
}

function createData(bookRef) {
    const data = {
        bookRef: bookRef
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
    const bookRef = document.querySelector('#booking-ref');
    const data = createData(bookRef.value.trim());
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/booking/reference', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const formMybookings = document.querySelector('#form');
formMybookings.addEventListener('submit', processSubmit);