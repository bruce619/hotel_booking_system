const contact_name = document.querySelector('#contact_name');
const contact_email = document.querySelector('#contact_email')
const message = document.querySelector('#message')
const success = document.querySelector('#suc')
const error = document.querySelector('#error')
const contact_form = document.querySelector('#contactus')


function sendEmail(e){


    e.preventDefault();

    let messages = []

    if (contact_name.value.length === 0){
      messages.push("invalid contact name");
    }

    if (contact_email.value.length === 0){
      messages.push("Invalid entry. Must have an email")
    }

    if (message.value.length == 0){
        messages.push("Invalid. Must contain a message")
    }

    if (messages.length > 0){
      e.preventDefault();
      error.innerHTML = messages.join(', ')
    }

    function onTextReady(text){
        console.log(text);
        success.textContent = text;
    }
    
    function onResponse(res){
        return res.text()
    }

    data = {
      "name": contact_name.value,
      "email": contact_email.value,
      "message": message.value
    }

  
  const serializedData = JSON.stringify(data) 

  fetch('/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: serializedData
})
.then(onResponse)
.then(onTextReady)
.catch((error) => {
    console.error('Error:', error);
  });

}

contact_form.addEventListener("submit", sendEmail);


