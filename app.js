// Configure Node to run in development mode
const env = process.env.NODE_ENV ||'development';

// Import database configurations
const config = require('./config.js')[env];

// Imports
const express = require('express')
const app = express()
const port = 3000

// load body parser library
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// load PG library
const pg = require('pg');

// use static files: css, js, img
app.use(express.static('/src/public/assets'));

// app.use(express.urlencoded());

// css
app.use('/css', express.static(__dirname + '/src/public/assets/css'));
// js
app.use('/js', express.static(__dirname + '/src/public/assets/js'));
// img
app.use('/img', express.static(__dirname + '/src/public/assets/img'));



// page for housekeeping
app.get('/housekeeping', (req, res) => {
    res.sendFile(__dirname + '/src/templates/housekeeping.html')
})

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

// use html templates
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/templates/index.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});

app.post('/', jsonParser, (req, res)=>{
    const body = req.body
    const name = body.name
    const email = body.email
    const message = body.message

    res.send(`POST: Name: ' + ${name} + ', Email: ' + ${email} + ', message: ' + ${message}`)
});

// GET for payment form
app.get('/payment/form', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_form.html', (err)=>{
        if (err){
            console.log(err);
        };
    });
});

// POST for payment form 
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
});

// GET for payment confirmation
app.get('/payment/confirmation', (req, res) => {
       res.sendFile(__dirname + '/src/templates/payment_confirmation.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});


// POST for payment confirmation
app.post('/payment/confirmation', jsonParser, async function (req, res) {
    console.log(`Confirmation POST ${req.body.c_name}`);
    console.log(`Confirmation POST Typeof ${typeof(req.body)}`);
    const body = req.body;
    req_data = {
        "c_name": body.c_name,
        "c_email": body.c_email,
        "c_address": body.c_address,
        "c_cardtype": body.c_cardtype,
        "c_cardno": body.c_cardno,
        "c_cardexp": body.c_cardexp,
        "checkin": body.checkin,
        "checkout": body.checkout,
        "std_t": body.std_t,
        "std_d": body.std_d,
        "sup_t": body.sup_t,
        "sup_d": body.sup_d,
        "b_cost": body.b_cost
    }

    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        let q;
        q = `select r.r_class, r.r_no
        from hotelbooking.room r
        where r.r_no
        not in (
            select rb.r_no
            from hotelbooking.roombooking rb
            where 
            rb.b_ref not in (select rb.b_ref
                from hotelbooking.roombooking
                where '${req_data.checkin}' <= rb.checkout and '${req_data.checkout}' <= rb.checkin))
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
                console.log(data)
                res.json({ results: data, req_data: req_data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;


// GET for payment confirmed
app.get('/payment/confirmed', jsonParser, (req, res) => {
    console.log("GET confirmed: " + req.body);
    res.sendFile(__dirname + '/src/templates/payment_confirmed.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});

// POST for payment confirmed
app.post('/payment/confirmed', jsonParser, async function (req, res) {
    console.log(`Confirmation POST ${req.body.c_name}`);
    console.log(`Confirmation POST Typeof ${typeof(req.body)}`);
    const body = req.body;
    req_data = {
        "c_no": body.c_no,
        "c_name": body.c_name,
        "c_email": body.c_email,
        "c_address": body.c_address,
        "c_cardtype": body.c_cardtype,
        "c_cardexp": body.c_cardexp,
        "c_cardno": body.c_cardno,
        "b_cost": body.b_cost,
        "b_outstanding": body.b_outstanding,
        "b_notes": "",
        "b_ref": body.b_ref,
        "checkin": body.checkin,
        "checkout": body.checkout,
        "std_t": body.std_t,
        "std_d": body.std_d,
        "sup_t": body.sup_t,
        "sup_d": body.sup_d
    }

    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `insert into customer values (${req_data.c_no}, ${req_data.c_name}, ${req_data.c_email}, ${req_data.c_address}, 
            ${req_data.c_cardtype}, ${req_data.c_cardexp}, ${req_data.c_cardno}); 
            insert into booking (${req_data.b_ref}, ${req_data.c_no}, ${req_data.b_cost}, ${req_data.b_outstanding}, ${req_data.b_notes}); 
            insert into roombooking ('', ${req_data.b_ref}, ${req_data.checkin}, ${req_data.checkout})`
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong. price ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                res.send(JSON.stringify(req_data));
            }
        });
    } catch (e) {
        console.log(`${e} error found`)
    }
});


// my bookings (reference) page
app.get('/booking/reference', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/my_booking_ref.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});

// POST for my booking reference query--
app.post('/booking/reference', jsonParser, async function (req, res) {
    console.log("POST request my booking reference");
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
             where b.c_no = cu.c_no and b.b_ref = rb.b_ref and rb.r_no = r.r_no and b.b_ref = ${bookRef};`
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


// page shows the available rooms users can book from search
app.get('/available/rooms', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/search_query_results.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});

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

// POST for search available room booking query without room type requests
app.post('/available/rooms', jsonParser, async function (req, res) {
    console.log("POST request booking");
    const body = req.body;
    console.log(`This is the body ${req.body}`);
    const checkInDate = body.checkInDate;
    const checkOutDate = body.checkOutDate;

    console.log(`Here is the check in ${body.checkInDate}`)
    console.log(`Here is the check out ${body.checkOutDate}`)
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
            //--modified
        const q = `select r.r_class, count(*)
        from hotelbooking.room r
        where r.r_no
        not in (
            select rb.r_no
            from hotelbooking.roombooking rb
            where 
            rb.b_ref not in (select rb.b_ref
                from hotelbooking.roombooking
                where '${checkInDate}' <= rb.checkout and '${checkOutDate}' <= rb.checkin))
        group by r.r_class
        order by r.r_class;`
        //modified--
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.search ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                date = {
                    "checkin": checkInDate,
                    "checkout": checkOutDate
                }
                data = results.rows;
                res.json({  results: data, date: date });
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

// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))