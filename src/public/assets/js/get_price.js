// get price data from database and reflect "search_query_results.html" file

function onTextReady(text) {
    console.log(text);

    const oldScript = document.querySelector('script');
    oldScript.remove();

    const script = document.createElement('script');
    script.src ='/js/booking_query.js';
    script.setAttribute('defer', true);
    const head = document.querySelector('head');
    head.appendChild(script);

    // convert response from JSON text to Object 
    const priceObject = JSON.parse(text);
    console.log(priceObject);

    // get price data for each room type
    const results = priceObject.results;
    const std_d_price = results[0].price;
    const std_t_price = results[1].price;
    const sup_d_price = results[2].price;
    const sup_t_price = results[3].price;

    // insert price data to html file
    const liStd_t = document.getElementById('std_t_price');
    liStd_t.textContent = `£${std_t_price} per night`;

    const liStd_d = document.getElementById('std_d_price');
    liStd_d.textContent = `£${std_d_price} per night`;

    const liSup_t = document.getElementById('sup_t_price');
    liSup_t.textContent = `£${sup_t_price} per night`;

    const liSup_d = document.getElementById('sup_d_price');
    liSup_d.textContent = `£${sup_d_price} per night`;
}

function onResponse(response) {
    return response.text();
}

function priceShow(e) {
    fetch('/booking/form/price')
    .then(onResponse)
    .then(onTextReady);
}

document.addEventListener('DOMContentLoaded', priceShow);