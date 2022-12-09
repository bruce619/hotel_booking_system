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


app.get('/payment/form', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_form.html', (err)=>{
        if (err){
            console.log(err);
        };
    });
});


app.get('/payment/confirmation', (req, res) => {
       res.sendFile(__dirname + '/src/templates/payment_confirmation.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});

app.post('/payment/confirmation', jsonParser, (req, res) => {
    console.log(`Confirmation POST ${req.body.c_name}`);
    console.log(`Confirmation POST Typeof ${typeof(req.body)}`);
    const body = req.body;
    req_data = {
        "c_name": body.c_name,
        "c_email": body.c_email,
        "c_address": body.c_address,
        "c_cardtype": body.c_cardtype,
        "c_cardno": body.c_cardno,
        "c_cardexp": body.c_cardexp
    }
    res.send(JSON.stringify(req_data));
});

app.get('/payment/confirmed', jsonParser, (req, res) => {
    console.log("GET confirmed: " + req.body);
    res.sendFile(__dirname + '/src/templates/payment_confirmed.html', (err)=>{
        if (err){
            console.log(err);
        }
    })
});


app.post('/payment/confirmed', jsonParser, (req, res) => {
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
    res.send(JSON.stringify(req_data));
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
    console.log(req.body);
    const checkInDate = body.checkInDate;
    const checkOutDate = body.checkOutDate;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
            //--modified
        const q = `select r.r_class, count(*)
                    from hotelbooking.room r
                    where r.r_no in(
                        select DISTINCT(rb.r_no)
                        from hotelbooking.roombooking rb
                        where('${checkInDate}' < rb.checkout and '${checkOutDate}' < rb.checkin) )
                    group by r.r_class`;
            //modified--
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.search ' + errors[0] });
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

// reception page
app.get('/reception', (req, res) => {
    res.sendFile(__dirname +'/src/templates/reception.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});


// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))