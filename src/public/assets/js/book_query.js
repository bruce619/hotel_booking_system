/// for onload of available rooms
document.addEventListener("DOMContentLoaded", ()=>{
    // begining of event

        console.log('I am here')
        
        console.log(localStorage.getItem("results"))
        console.log(typeof(localStorage.getItem("results")));


        console.log('I am here 2')


        text = localStorage.getItem("results")

        const resultsObject = JSON.parse(text);

        console.log('I am here 3')

        console.log(`Here is the result object ${resultsObject}`)

        const checkin = document.querySelector('#checkin')
        const checkout = document.querySelector('#checkout')


        checkin.value = resultsObject.date.checkin
        checkout.value = resultsObject.date.checkout
        

        // get number of available rooms for each room type
        const results = resultsObject.results;
        console.log(results);
        console.log(results.length);
    
        let std_d_available_type;
        let std_t_available_type;
        let sup_d_available_type;
        let sup_t_available_type;
    
        let std_d_available;
        let std_t_available;
        let sup_d_available;
        let sup_t_available;

    const pStd_d = document.querySelector('#std_d');
    const inputStd_d = document.querySelector('#std_d_no');

    const pStd_t = document.querySelector('#std_t');
    const inputStd_t = document.querySelector('#std_t_no');

    const pSup_d = document.querySelector('#sup_d');
    const inputSup_d = document.querySelector('#sup_d_no');

    const pSup_t = document.querySelector('#sup_t');
    const inputSup_t = document.querySelector('#sup_t_no');

    // const arr = JSON.parse(text)
    // console.log(`This is my arr data class ${arr.results[0].r_class}`)
    // console.log(`This is my arr data count ${arr.results[0].count}`)


    // for error message
    let p = document.querySelector('.search_unavailable');
    p.innerHTML = '';

    if (results.length === 0){

        // error message when all rooms unavailable
          p.innerHTML = 'Sorry...we do not currently have any available rooms.<br>Change the dates and search again.'
    
    } else {


        /// input each number of available rooms by each room type 
        for (let i = 0; i < results.length; i++){
            if (results[i].r_class === 'std_d'){
                std_d_available_type = 'std_d';

                std_d_available = results[i].count;
                pStd_d.textContent = `Available Rooms: ${std_d_available}`;
                pStd_d.className = 'available';
                inputStd_d.disabled = false;

            } else if(results[i].r_class === 'std_t'){
                std_t_available_type = 'std_t';

                std_t_available = results[i].count;
                pStd_t.textContent = `Available Rooms: ${std_t_available}`;
                pStd_t.className = 'available'
                inputStd_t.disabled = false;
    
            } else if(results[i].r_class === 'sup_d'){
                sup_d_available_type = 'sup_d'

                sup_d_available = results[i].count;
                pSup_d.textContent = `Available Rooms: ${sup_d_available}`;
                pSup_d.className = 'available'
                inputSup_d.disabled = false;

            } else {
                sup_t_available_type = 'sup_t'

                sup_t_available = results[i].count;
                pSup_t.textContent = `Available Rooms: ${sup_t_available}`;
                pSup_t.className = 'available'      
                inputSup_t.disabled = false;
            }
        }

        /// the case for there are not available rooms
        if ( std_d_available_type === undefined ) {
            pStd_d.textContent = 'Available Rooms: 0';
            pStd_d.className = 'notavailable'
            inputStd_d.value = '0';
            inputStd_d.disabled = true;
        }

        if ( std_t_available_type === undefined ) {
            pStd_t.textContent = 'Available Rooms: 0';
            pStd_t.className = 'notavailable';
            inputStd_t.value = '0';
            inputStd_t.disabled = true;
        }

        if ( sup_d_available_type === undefined ) {
            pSup_d.textContent = 'Available Rooms: 0';
            pSup_d.className = 'notavailable';
            inputSup_d.value = '0';
            inputSup_d.disabled = true;
        }

        if ( sup_t_available_type === undefined ) {
            pSup_t.textContent = 'Available Rooms: 0';
            pSup_t.className = 'notavailable';
            inputSup_t.value = '0';
            inputSup_t.disabled = true;
        }

    }

})
