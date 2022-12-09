


function onResponse(response){
    console.log('onResponse Triggered');
    return response.text();
    console.log('onResponse OK');
}
function showRooms(e){
    fetch('http://localhost:3000/housekeeping/update')
    .then(onResponse)
    .then(onTextReady);

}

const showrooms = document.querySelector('#refresher');
showrooms.addEventListener('click', showRooms);

// listen for any button press 
const cleanupdate = document.getElementsByClassName('.buttonUpdate');
cleanupdate.addEventListener('click', cleanUpdate);