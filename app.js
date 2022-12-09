// Configure Node to run in development mode
const env = process.env.NODE_ENV ||'development';

// Import database configurations
const config = require('./config.js')[env];

// Imports
const express = require('express');
const app = express();
const port = 3000;

// load body parser library
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// load PG library
const pg = require('pg');

// use static files: css, js, img
app.use(express.static('src/public/assets'))
// css
app.use('/css', express.static(__dirname + 'src/public/assets/css'))
// js
app.use('/js', express.static(__dirname + 'src/public/assets/js'))
// img
app.use('/img', express.static(__dirname + 'src/public/assets/img'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/templates/index.html')
})

// use html templates
app.get('/payment/form', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_form.html')
});

// index
app.get('/modal', (req, res) => {
    res.sendFile(__dirname + '/src/templates/modal.html')
})

app.get('/payment/confirmation', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmation.html')
});

app.get('/payment/confirmed', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmed.html')
});

// my booking reference page
app.get('/booking/reference', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/my_booking_ref.html')
});

// page shows the available rooms users can book from search
app.get('/available/rooms', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/search_query_results.html')
})

// page for housekeeping
app.get('/housekeeping', (req, res) => {
    res.sendFile(__dirname + '/src/templates/housekeeping.html')
})


// GET price data from database and reflect "booking-query-results.html" file
app.get('/available/rooms/price', jsonParser, async function (req, res) {
    console.log("GET reauest");
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `SELECT * FROM hotelbooking.rates ORDER BY r_class;`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong. price ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                data = results.rows;
                res.json({  results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// POST for search available room booking query without room type requests]
app.post('/available/rooms', jsonParser, async function (req, res) {
    console.log("POSTrequest booking");
    const body = req.body;
    console.log(req.body);
    const checkInDate = body.checkInDate;
    const checkOutDate = body.checkOutDate;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
            //--modified

        const q = `select r.r_class, r.r_no
        from hotelbooking.room r
        where r.r_no
        not in (
            select rb.r_no
            from hotelbooking.roombooking rb
            where 
            rb.b_ref not in (select rb.b_ref
                from hotelbooking.roombooking
                where '${checkInDate}' <= rb.checkout and '${checkOutDate}' <= rb.checkin))
            order by r.r_class;`
        // const q = `select r.r_class, count(*)
        //             from hotelbooking.room r
        //             where r.r_no
        //             not in (
        //                 select rb.r_no
        //                 from hotelbooking.roombooking rb
        //                 where 
        //                 rb.b_ref not in (select rb.b_ref
        //                     from hotelbooking.roombooking
        //                     where '${checkInDate}' <= rb.checkout and '${checkOutDate}' <= rb.checkin))
        //             group by r.r_class
        //             order by r.r_class;`
            //modified--
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.search ' + errors[0] });
            } else {
                client.release();
                console.log(`Here is the result of my query  ${results.rows[0].r_class}`)
                // console.log(results);
                data = results.rows;
                res.json({  results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// reception page--
app.get('/reception', (req, res) => {
    res.sendFile(__dirname +'/src/templates/reception.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});

// POST for Reception query--
app.post('/reception', jsonParser, async function (req, res) {
        console.log("POSTrequest");
        const body = req.body;
        console.log(req.body);
        const bookRef = body.bookRef;
        const name = body.name;
        const email = body.email;
        const roomNo = body.roomNo;
        try {
            let results;
            const pool = new pg.Pool(config);
            const client = await pool.connect();
            let q;
            if(bookRef !== ""){
                console.log(bookRef)
                q = `select b.b_ref, cu.c_name, cu.c_email, rb.r_no from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb where b.c_no = cu.c_no and b.b_ref = rb.b_ref and b.b_ref = ${bookRef};`;
            } else if(roomNo !== "") {
                q = `select b.b_ref, cu.c_name, cu.c_email, rb.r_no from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb where b.c_no = cu.c_no and b.b_ref = rb.b_ref and rb.r_no = ${roomNo} order by b.b_ref;`;
            } else if(name !== ""){
                q = `select b.b_ref, cu.c_name, cu.c_email, rb.r_no from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb where b.c_no = cu.c_no and b.b_ref = rb.b_ref and cu.c_name ILIKE '%${name}%' order by b.b_ref;`;
            } else if(email !== ""){
                q = `select b.b_ref, cu.c_name, cu.c_email, rb.r_no from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb where b.c_no = cu.c_no and b.b_ref = rb.b_ref and cu.c_email = '${email}' order by b.b_ref;`;
            }
            await client.query(q, (err, results) => {
                if (err) {
                    console.log(err.stack);
                    errors = err.stack.split(" at ");
                    res.json({ message: 'Sorry something went wrong. ' + errors[0] });
                } else {
                    client.release();
                    console.log(results);
                    data = results.rows;
                    res.json({ results: data });
                }
            });
        } catch (e) {
            console.log(e);
        }
    }) ;

// POST for Reception-details query--
app.post('/reception/details', jsonParser, async function (req, res) {
    console.log("POSTrequest detail");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `select b.b_ref, rb.checkin, rb.checkout, rb.r_no, r.r_class, r.r_status, r.r_notes, 
                    cu.c_no, cu.c_name, cu.c_email, cu.c_address,  b.b_cost, b.b_outstanding, b.b_notes
                   from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb, hotelbooking.room r
                   where b.c_no = cu.c_no and b.b_ref = rb.b_ref and rb.r_no = r.r_no and b.b_ref = ${bookRef};`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry something went wrong. ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                data = results.rows;
                res.json({ results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// POST for Reception updating room status to 'O'(Occupied = check-in)--
app.post('/reception/checkin', jsonParser, async function (req, res) {
    console.log("POSTrequest checkin");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `update hotelbooking.room set r_status = 'O' where r_no in (select r.r_no from hotelbooking.room r, hotelbooking.roombooking rb
             where r.r_no = rb.r_no and rb.b_ref = ${bookRef});`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.checkin ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                res.json({  result: 'success', message: 'successfully updated' });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// POST for Reception updating room status to "C"(check-out) and outstanding value to "zero"--
app.post('/reception/checkout', jsonParser, async function (req, res) {
    console.log("POSTrequest checkout");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `update hotelbooking.room set r_status = 'C' where r_no in (select r.r_no from hotelbooking.room r, hotelbooking.roombooking rb
             where r.r_no = rb.r_no and rb.b_ref = ${bookRef});
             update hotelbooking.booking set b_outstanding = 0 where b_ref = ${bookRef};`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.checkout ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                res.json({  result: 'success', message: 'successfully updated' });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// POST for my booking reference query--
app.post('/booking/reference', jsonParser, async function (req, res) {
    console.log("POSTrequest my booking reference");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        let q;
        console.log(bookRef)
        q = `select b.b_ref, rb.checkin, rb.checkout, rb.r_no, r.r_class, r.r_status, r.r_notes, 
             cu.c_no, cu.c_name, cu.c_email, cu.c_address,  b.b_cost, b.b_outstanding, b.b_notes
             from hotelbooking.booking b, hotelbooking.customer cu, hotelbooking.roombooking rb, hotelbooking.room r
             where b.c_no = cu.c_no and b.b_ref = rb.b_ref and rb.r_no = r.r_no and b.b_ref = ${bookRef};`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry something went wrong. ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                data = results.rows;
                res.json({ results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// GET room infomation data for cleaners
app.get('/housekeeping/search', jsonParser, async function (req, res) {
    console.log("GET rquest housekeeping");
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `SELECT r_no, r_status FROM hotelbooking.room WHERE r_status = 'C' ORDER BY r_no;`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong. housekeeping ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                data = results.rows;
                res.json({  results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;


app.post('/payment/form', jsonParser, async function (req, res) {
    console.log("POSTrequest room no");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        let q;
        console.log(bookRef)
        q = `select r.r_class, r.r_no
        from hotelbooking.room r
        where r.r_no
        not in (
            select rb.r_no
            from hotelbooking.roombooking rb
            where 
            rb.b_ref not in (select rb.b_ref
                from hotelbooking.roombooking
                where '${checkInDate}' <= rb.checkout and '${checkOutDate}' <= rb.checkin))
            order by r.r_class;`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry something went wrong. ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                data = results.rows;
                res.json({ results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;











// fetch clean data housekeeping
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

// update room status to A HOUSEKEEPING
app.post('/clean', jsonParser, async function (req, res) {
    console.log("POSTrequest CLEAN");
    const body = req.body;
    console.log(req.body);
    const roomNum = body.roomNum;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `UPDATE hotelbooking.room SET r_status = 'A' WHERE r_no = ${roomNum}`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.checkout ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                res.json({  result: 'success', message: 'successfully updated' });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;

// Update room status to A housekeeping
// app.post('/clean', async (req, res) =>{
//     console.log('post running');
//     const body = req.body;
//     console.log(body);
//     const roomNum = body.roomNum;
//     console.log(`variable received ${roomNum} in app.js`);
    

// 	try{
// 		let results;
// 		const pool = new pg.Pool(config);
// 		const client = await pool.connect();
// 		const q = `UPDATE hotelbooking.room SET r_status = 'A' WHERE r_no = ${roomNum}`;
// 		await client.query(q, (err, results) => {
// 		  if (err) {
// 		    console.log(err.stack)
// 			errors = err.stack.split(" at ");
// 		    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
// 		  } else {
// 			client.release();
// 		    console.log(results); //;
// 		  }
// 		});

// 	}catch(e){
// 		console.log(e);
// 	}	

// });


// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))