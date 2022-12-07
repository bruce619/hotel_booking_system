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
// css
app.use('/css', express.static(__dirname + '/src/public/assets/css'));
// js
app.use('/js', express.static(__dirname + '/src/public/assets/js'));
// img
app.use('/img', express.static(__dirname + '/src/public/assets/img'));



// use html templates
app.get('/payment/form', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_form.html')
});

app.get('/payment/confirmation', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmation.html')
});

app.get('/payment/confirmed', (req, res) => {
    res.sendFile(__dirname + '/src/templates/payment_confirmed.html')
});

// my bookings (reference) page
app.get('/booking/reference', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/my_booking_ref.html')
});


// page shows the available rooms users can book from search
app.get('/available/rooms', (req, res)=>{
    res.sendFile(__dirname + '/src/templates/search_query_results.html')
})

// GET price data from database and reflect "search_query_results.html" file
app.get('/available/rooms/price', jsonParser, async function (req, res) {
    console.log("GET request");
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
});


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
        const q = `select r.r_class, count(*)
                    from hotelbooking.room r left join
                        (select rb.r_no, r.r_class, rb.checkin, rb.checkout
                        from hotelbooking.roombooking rb, hotelbooking.room r
                        where rb.r_no = r.r_no
                            and('${checkInDate}' between rb.checkin and rb.checkout 
                            or '${checkOutDate}' between rb.checkin and rb.checkout)
                        )as rq
                        on r.r_no = rq.r_no 
                    where rq.checkin is null
                    group by r.r_class
                    order by r.r_class;`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ result: 'fail', message: 'Sorry something went wrong.checkout ' + errors[0] });
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
});

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