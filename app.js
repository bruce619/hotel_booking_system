// Imports
const express = require('express')
const app = express()
const port = 3000

// use static files: css, js, img
app.use(express.static('src/public/assets'))
// css
app.use('/css', express.static(__dirname + 'src/public/assets/css'))
// js
app.use('/js', express.static(__dirname + 'src/public/assets/js'))
// img
app.use('/img', express.static(__dirname + 'src/public/assets/img'))


// use html templates
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/templates/index.html')
})

app.get('/modal', (req, res) => {
    res.sendFile(__dirname + '/src/templates/modal.html')
})

app.get('/payment/form', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_form.html')
})

app.get('/payment/confirmation', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmation.html')
})

app.get('/payment/confirmed', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmed.html')
})

app.get('/housekeeping', (req, res) => {
    res.sendFile(__dirname + '/src/templates/housekeeping.html')
})

// declare env 
const env = process.env.NODE_ENV || 'development';

// import database configurations 
const config = require('./config.js')[env];

/// load PG library
const pg = require('pg');

/* GET data from database || HOUSEKEEPING */
app.get('/housekeeping/update', async (req,res) => {
	try{
		let results;
		const pool = new pg.Pool(config);
		const client = await pool.connect();
		const q = "select r_no, r_status from hotelbooking.room WHERE r_status = 'C' ORDER BY r_no;"
		await client.query(q, (err, results) => {
		  if (err) {
		    console.log(err.stack)
			errors = err.stack.split(" at ");
		    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		  } else {
			client.release();
		   console.log(results); //
	   		data = results.rows;
	   		count = results.rows.length;
            res.json({ results:data, rows:count });
		  }
		});

	}catch(e){
		console.log(e);
	}	
});

// Update room status to A || HOUSEKEEPING 
app.post('/clean', async (req, res) =>{
    console.log('post running');
    const body = req.body;
    console.log(body);
    const roomNum = body.roomNum;
    console.log(`variable received ${roomNum} in app.js`);
    

	try{
		let results;
		const pool = new pg.Pool(config);
		const client = await pool.connect();
		const q = `UPDATE hotelbooking.room SET r_status = 'A' WHERE r_no = ${roomNum}`;
		await client.query(q, (err, results) => {
		  if (err) {
		    console.log(err.stack)
			errors = err.stack.split(" at ");
		    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		  } else {
			client.release();
		    console.log(results); //;
		  }
		});

	}catch(e){
		console.log(e);
	}	

});


// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))