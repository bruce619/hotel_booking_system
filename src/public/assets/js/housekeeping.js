// wrap data 
function createData(roomNum) {
    const data = {
        roomNum: roomNum,
    };
    console.log(`JSONifying ${roomNum}`);
    return JSON.stringify(data);
    
}

function createOptions(data){
    const fetchOptions ={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    }
    console.log(fetchOptions);
    return fetchOptions;
}

function handleCompleteClick(roomNum){
    console.log(roomNum);
    const data = createData(roomNum);
    const fetchOptions = createOptions(data)
    fetch('http://localhost:3000/clean' , fetchOptions)
    console.log('fetch sent');
    // .then(onResponse)
    // .then(onTextReady);
}

function onTextReady(text){
    console.log('onTextReady Triggered');
    console.log(text);
    const data = JSON.parse(text);
    console.log(data);



    let output = '';
    data.results.forEach(element => {

        

        // console.log(element);
        output +=   `<tr><td> ${element.r_no} </td>
                    <td> ${ element.r_status}hecked Out </td>
                    <td class="buttonUpdate"><button class="tableButton" onClick={handleCompleteClick(${element.r_no})}>Complete</button></td></tr>`;
    }) 
    // output += '</tr>'
 
    // const results = document.querySelector('#roster');
    // results.innerHTML = 
    // ` <h3> Results </h3>
    //   <h6> rows count: ${data.rows} </h6>
    //   <ul> ${output} </ul>
    // `;

    const roster = document.querySelector('#roster');
    roster.innerHTML =
    ` <h3>Cleaning Roster</h3>
    <br>
    <table id="cleanRoster" class="roster">
        <tr>
          <th class="roomID">Room</th>
          <th>Status</th>
          <th>Update</th>
          ${output}
        `

    
}

function onResponse(response){
    console.log('onResponse Triggered');
    return response.text();
    console.log('onResponse OK');
}


// function refreshCleaner(e){
//     console.log('refreshCleaner triggered');
//     fetch('http://localhost:3000/housekeeping/update')
//     .then(onResponse)
//     .then(onTextReady);
//     console.log('onTextReady OK');


// }

// const refresher = document.querySelector('#refresher');
// refresher.addEventListener('click', refreshCleaner);

function showRooms(e){
    fetch('http://localhost:3000/housekeeping/update')
    .then(onResponse)
    .then(onTextReady);

}

function loadPage(){
    console.log('page loaded')
    showRooms();
    
}

// const showrooms = document.querySelector('#refresher');
// showrooms.addEventListener('click', showRooms);

window.onload = loadPage