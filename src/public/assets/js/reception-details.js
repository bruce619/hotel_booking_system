
function onTextReady(text) {
    const oldScript = document.querySelector('script');
    oldScript.remove();

    const script = document.createElement('script');
    script.src ='/js/reception-checkin.js';
    script.setAttribute('defer', true);
    const head = document.querySelector('head');
    head.appendChild(script);

    const detailObject = JSON.parse(text);
    console.log(detailObject);
    const results = detailObject.results;
    let i = 0;
    let elements = results[i];
    console.log(results);
    console.log(results.length);

    // change reception page to reception-results page
    document.querySelector('h2').textContent = "Booking details";

    // erase indication message
    document.querySelector('p.recep-indication').textContent = "";

    // add new class name to div element
    const div = document.getElementById('recep-contents');
    div.className = 'recep-contents details';

    // remove search form
    const oldform = document.getElementById('resultForm');
    oldform.remove();

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
    tdBasic2.textContent = `${elements.checkin}`;
    tr2.appendChild(tdBasic2);
    const tdBasic3 = document.createElement('td');
    tdBasic3.id = 'check-out';
    tdBasic3.textContent = `${elements.checkout}`;
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
    thRoomHead3.textContent = 'Room status';
    const thRoomHead4 = document.createElement('th');
    trRoom1.appendChild(thRoomHead4);
    thRoomHead4.textContent = 'Notes';

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
        tdRoom2.textContent = `${elements.r_class}`;
        trRoom2.appendChild(tdRoom2);
        const tdRoom3 = document.createElement('td');
        tdRoom3.id = 'room-status';
        tdRoom3.textContent = `${elements.r_status}`;
        trRoom2.appendChild(tdRoom3);
        const tdRoom4 = document.createElement('td');
        tdRoom4.id = 'room-notes';
        tdRoom4.textContent = `${elements.r_notes}`;
        trRoom2.appendChild(tdRoom4);
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
    const thCustomerHead3 = document.createElement('th');
    trCustomer.appendChild(thCustomerHead3);
    thCustomerHead3.textContent = 'Email address';
    const thCustomerHead4 = document.createElement('th');
    trCustomer.appendChild(thCustomerHead4);
    thCustomerHead4.textContent = 'Address';

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
    const tdCustomer3 = document.createElement('td');
    tdCustomer3.id = 'email-address';
    tdCustomer3.textContent = `${elements.c_email}`;
    trCustomer2.appendChild(tdCustomer3);
    const tdCustomer4 = document.createElement('td');
    tdCustomer4.id = 'address';
    tdCustomer4.textContent = `${elements.c_address}`;
    trCustomer2.appendChild(tdCustomer4);

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
    a.href = '/';
    a.className = 'recep-btn';
    a.textContent = 'Back';
    labelBack.appendChild(a);

    /// button to update checkin
    const formIn = document.createElement('form');
    formIn.action = '/checkin';
    formIn.method = 'POST';
    formIn.name = 'checkIn';
    divBtn.appendChild(formIn);

    const labelCheckin = document.createElement('label');
    formIn.appendChild(labelCheckin);

    const pCheckin = document.createElement('p');
    pCheckin.className = 'recep-form-p-submit';
    labelCheckin.appendChild(pCheckin);

    const btnCheckin = document.createElement('button');
    btnCheckin.type = 'submit';
    btnCheckin.value = `${elements.b_ref}`;
    btnCheckin.textContent = 'Check In';
    pCheckin.appendChild(btnCheckin);

    /// button to update payment&checkout
    const formOut = document.createElement('form');
    formOut.action = '/checkout';
    formOut.method = 'POST';
    formOut.name = 'checkOut';
    divBtn.appendChild(formOut);

    const labelPayOut = document.createElement('label');
    formOut.appendChild(labelPayOut);

    const pPayOut = document.createElement('p');
    pPayOut.className = 'recep-form-p-submit';
    labelPayOut.appendChild(pPayOut);

    const btnPayOut = document.createElement('button');
    btnPayOut.type = 'submit';
    btnPayOut.value = `${elements.b_ref}`;
    btnPayOut.textContent = 'Payment & Check Out';
    pPayOut.appendChild(btnPayOut);
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
    const form = document.forms.resultForm;
    const selectBook = form.selectBook;
    const bookRef = selectBook.value;
    console.log(bookRef);
    const data = createData(bookRef.trim());
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/recep-details', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const formDetails = document.querySelector('#resultForm');
formDetails.addEventListener('submit', processSubmit);