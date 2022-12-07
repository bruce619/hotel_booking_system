
function onTextReady(text) {
    const oldScript = document.querySelector('script');
    oldScript.remove();

    const script = document.createElement('script');
    script.src ='/js/reception_details.js';
    script.setAttribute('defer', true);
    const head = document.querySelector('head');
    head.appendChild(script);

    // change reception page to reception-results page
    document.querySelector('.recep h2').textContent = "Search Results";

    // remove search form
    const oldform = document.getElementById('form');
    oldform.remove();

    // arrange response data
    const recepResultObject = JSON.parse(text);
    console.log(recepResultObject);
    const results = recepResultObject.results
    console.log(results);
    console.log(results.length);
    
    // page for the case there is no matched data
    if(results.length === 0){
        // erase indication message
        document.querySelector('p.recep-indication').textContent = "";

        // create error message
        const article = document.querySelector('article');
        article.className = 'recep recep-nodata';
        const p = document.createElement('p');
        p.innerHTML = "There is no data that matches to the search information.<br>Please try again.";
        article.appendChild(p);

        // create button to go back to top page
        const label1 = document.createElement('label');
        article.appendChild(label1);
        const a = document.createElement('a');
        a.href = "/reception";
        a.className = "recep-btn";
        a.textContent = "Back";
        label1.appendChild(a);

    } else {
    // page for the case there is matched data
        // change indication message
        document.querySelector('p.recep-indication').textContent = "Check the left side button and Check details.";

        // create new form to access details
        const article = document.querySelector('article');
        const div = document.createElement('div');
        div.className = 'recep-contents';
        div.id = 'recep-contents'
        article.appendChild(div);

        const newform = document.createElement('form');
        newform.action = '/recep_details'
        newform.method = 'POST';
        newform.name = 'resultForm'
        newform.id = 'resultForm';
        div.appendChild(newform);

        /// create result table
        const table = document.createElement('table');
        table.className = 'search-results';
        newform.appendChild(table);

        ////create title row
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

        for (let i = 0; i < results.length; i++){
            let elements = results[i];
            console.log(elements);

            //// create result row
            const tr2 = document.createElement('tr');
            tr2.id = "row1";
            table.appendChild(tr2);
            const td1 = document.createElement('td');
            tr2.appendChild(td1);
            ///// radio button for select row
            const input = document.createElement('input');
            input.type = "radio";
            input.name = "selectBook";
            input.id = "radio";
            input.value = `${elements.b_ref}`;
            td1.appendChild(input);
            ///// booking ref
            const td2 = document.createElement('td');
            td2.id = "booking-ref1";
            td2.textContent = `${elements.b_ref}`
            tr2.appendChild(td2);
            ///// customer name
            const td3 = document.createElement('td');
            td3.id = "customer-name1";
            td3.textContent = `${elements.c_name}`
            tr2.appendChild(td3);
            ///// email
            const td4 = document.createElement('td');
            td4.id = "email-address1";
            td4.textContent = `${elements.c_email}`
            tr2.appendChild(td4);
            ///// room no
            const td5 = document.createElement('td');
            td5.id = "room-no1";
            td5.textContent = `${elements.r_no}`
            tr2.appendChild(td5);
        }

        /// create button to go back to top page or access details
        const divButton = document.createElement('div');
        divButton.className = "btn-grid"
        newform.appendChild(divButton);

        //// button to go back to top page
        const label1 = document.createElement('label');
        divButton.appendChild(label1);

        const a = document.createElement('a');
        a.href = "/reception";
        a.className = "recep-btn";
        a.textContent = "Back";
        label1.appendChild(a);

        //// button to access details
        const label2 = document.createElement('label');
        divButton.appendChild(label2);

        const p = document.createElement('p');
        p.className = "recep-form-p-submit-v2";
        label2.appendChild(p);
        
        const inputSubmit = document.createElement('input');
        inputSubmit.type = "submit"
        inputSubmit.value = "Check Details";
        p.appendChild(inputSubmit);
    }   
}

function onResponse(response) {
    return response.text();
}

function createData(bookRef, name, email, roomNo) {
    const data = {
        bookRef: bookRef,
        name: name,
        email: email,
        roomNo: roomNo
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
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const roomNo = document.querySelector('#room-no');
    const data = createData(bookRef.value.trim(), name.value.trim(), email.value.trim(), roomNo.value.trim());
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/reception', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const form = document.querySelector('#form');
form.addEventListener('submit', processSubmit);