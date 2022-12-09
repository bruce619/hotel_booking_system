
/* process the returned data */
function onTextReady(text){
    console.log(text);
    const results = document.querySelector('#results');
    results.textContent = text;
    results.className = "postRed";
}

/* first callback function */
function onResponse(response){	
	return response.text();
}

/* wrap up the data */
function createData(name, email, message ) {
    const data = {
        name: name,
        email: email,
        message: message
    };
    return JSON.stringify(data);
}

/* create send meta data */
function createOptions(data){
    const fetchOptions ={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    }
    
    return fetchOptions;
}



/* process onSubmit event */
function processSubmit(e) {
    e.preventDefault();
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const message = document.querySelector('#message');
    const data = createData(name.value.trim(), email.value.trim(), message.value.trim());
    const fetchOptions = createOptions(data);
    
    fetch('http://localhost:3000/adduser' , fetchOptions)
    .then(onResponse)
    .then(onTextReady);
  
}



const form = document.querySelector('#form');
form.addEventListener('submit', processSubmit);


