
function onTextReady(text) {
    // const result = JSON.parse(text);
    // console.log(result);
    // let recepResultOb1 = {bookingRef:13001, customerName:'Kyoko Yamasaki', email:'ppp@uea.ac.uk', roomNo:101}
    const recepResultOb1 = JSON.parse(text);
    const elements = recepResultOb1.results[0];
    console.log(elements);

    // change reception page to reception-results page
    document.querySelector('h2').textContent = "Search Results";
    document.querySelector('p.recep-indication').textContent = "Check the left side button and Check details.";

    // remove search form
    const oldform = document.querySelector('form');
    oldform.remove();

    // create new form to access details
    const article = document.querySelector('article');
    const newform = document.createElement('div');
    newform.className = 'recep-contents';
    article.appendChild(newform);

    // create result table
    const table = document.createElement('table');
    table.className = 'search-results';
    newform.appendChild(table);

    //create title row
    const tr1 = document.createElement('tr');
    table.appendChild(tr1);
    const th1 = document.createElement('th');
    tr1.appendChild(th1);
    th1.textContent = "Select box";
    const th2 = document.createElement('th');
    tr1.appendChild(th2);
    th2.textContent = "Booking ref no";
    const th3 = document.createElement('th');
    tr1.appendChild(th3);
    th3.textContent = "Customer name";
    const th4 = document.createElement('th');
    tr1.appendChild(th4);
    th4.textContent = "Email address";
    const th5 = document.createElement('th');
    tr1.appendChild(th5);
    th5.textContent = "Room no";

    // create result row
    const tr2 = document.createElement('tr');
    tr2.id = "row1";
    table.appendChild(tr2);
    const td1 = document.createElement('td');
    tr2.appendChild(td1);
     // radio button for select row
    const input = document.createElement('input');
    input.type = "radio";
    input.name = "select-book";
    input.id = "radio";
    input.value = "row1";
    td1.appendChild(input);
    // booking ref
    const td2 = document.createElement('td');
    td2.id = "booking-ref1";
    td2.textContent = `${elements.b_ref}`
    tr2.appendChild(td2);
    // customer name
    const td3 = document.createElement('td');
    td3.id = "customer-name1";
    td3.textContent = `${elements.c_name}`
    tr2.appendChild(td3);
    // email
    const td4 = document.createElement('td');
    td4.id = "email-address1";
    td4.textContent = `${elements.c_email}`
    tr2.appendChild(td4);
    // room no
    const td5 = document.createElement('td');
    td5.id = "room-no1";
    td5.textContent = `${elements.r_no}`
    tr2.appendChild(td5);

    // button
    const div = document.createElement('div');
    div.className = "btn-grid"
    newform.appendChild(div);

    const label1 = document.createElement('label');
    div.appendChild(label1);

    const a = document.createElement('a');
    a.href = "6-1reception.html";
    a.className = "recep-btn";
    a.textContent = "Back";
    label1.appendChild(a);

    const label2 = document.createElement('label');
    div.appendChild(label2);

    const p = document.createElement('p');
    p.className = "recep-form-p-submit";
    label2.appendChild(p);
    
    const inputSubmit = document.createElement('input');
    inputSubmit.type = "submit"
    inputSubmit.value = "Check Details";
    p.appendChild(inputSubmit);
}

function onResponse(response) {
    return response.text();
}

function createData(bookRef) {
    const data = {
        bookRef: bookRef
        // name: name,
        // email: email,
        // roomNo: roomNo
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
    // const name = document.querySelector('#name');
    // const email = document.querySelector('#email');
    // const roomNo = document.querySelector('#room-no');
    // const data = createData(bookRef.value.trim(), name.value.trim(), email.value.trim(), roomNo.value.trim());
    const data = createData(bookRef.value);
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const form = document.querySelector('#form');
form.addEventListener('submit', processSubmit);