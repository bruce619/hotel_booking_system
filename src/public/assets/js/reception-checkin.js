function onTextReady(text) {
    console.log(text);
    const queryresult = JSON.parse(text);
    console.log(queryresult.result);

    /// remove unnecessary text and element
    document.querySelector('.recep h2').textContent = '';
    const oldDiv = document.querySelector('.details');
    oldDiv.remove();

    // page for successfully updated
    if(queryresult.result === 'success'){
        /// create result message
        const article = document.querySelector('article');
        article.className = 'update';
        const p = document.createElement('p');
        p.textContent = 'The updates have been sucessfully finished!';
        article.appendChild(p);
    } else {
        // page for failed
        const article = document.querySelector('article');
        article.className = 'update fail';
        const p = document.createElement('p');
        p.innerHTML = ' The updates have been failed.<br>Please try again.';
        article.appendChild(p);
    }

    /// create button to go back to top page
    const article = document.querySelector('article');
    const label = document.createElement('label');
    article.appendChild(label);
    const a = document.createElement('a');
    a.href = '/reception';
    a.className = 'recep-btn';
    a.textContent = 'Back to top';
    label.appendChild(a);
}

function onResponse(response) {
    return response.text();
}

function createData(bookRef) {
    const data = {
        bookRef: bookRef,
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
    const bookRef = document.getElementById('btnCheckin').value;
    // const bookRef = form.value;
    console.log(bookRef);
    const data = createData(bookRef);
    console.log(data);
    const fetchOptions = createOptions(data);
    console.log(fetchOptions);

    fetch('/reception/reception-checkin', fetchOptions)
    .then(onResponse)
    .then(onTextReady);
}

const formCheckIn = document.getElementById('checkIn');
formCheckIn.addEventListener('submit', processSubmit);