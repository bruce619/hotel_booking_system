// getting room id 
// let rowrowindex;

// function getRoomID(i) {
//     console.log("Row index is: " + i.rowIndex);
//     rowrowindex = i.rowIndex;
//   }

function updateButton(x) {
    console.log("Button test also says Row Index is: " + x.parentNode.rowIndex);
    const roomNum = document.getElementById('#cleanRoster').rows[rowrowIndex].cell[0];
    console.log(roomNum);

}

function onTextReady(text){
    console.log('onTextReady Triggered');
    console.log(text);
    const data = JSON.parse(text);
    console.log(data);



    let output = '';
    data.results.forEach(element => {

        

        // console.log(element);
        output +=   `<tr onclick="getRoomID(this)"><td> ${element.r_no} </td>
                    <td> ${ element.r_status}hecked Out </td>
                    <td id=btn${element.r_no} class="buttonUpdate"><button class="tableButton" onclick="updateButton(this)">Complete</button></td></tr>`;
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



const showrooms = document.querySelector('#refresher');
showrooms.addEventListener('click', showRooms);