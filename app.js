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


// use html templates
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/src/templates/index.html')
// })


app.get('/', (req, res) => {
    res.sendFile(__dirname +'/src/templates/6-1reception.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});



// POST for Reception query 
app.post('/', jsonParser, async function (req, res) {
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

// POST for Reception-details query
app.post('/recep-details', jsonParser, async function (req, res) {
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

// POST for updating check in query
app.post('/recep-checkin', jsonParser, async function (req, res) {
    console.log("POSTrequest checkin");
    const body = req.body;
    console.log(req.body);
    const bookRef = body.bookRef;
    try {
        let results;
        const pool = new pg.Pool(config);
        const client = await pool.connect();
        const q = `update room set r_status = 'A' where r_no in (select r.r_no from room r, roombooking rb
             where r.r_no = rb.r_no and rb.b_ref = ${bookRef}`;
        await client.query(q, (err, results) => {
            if (err) {
                console.log(err.stack);
                errors = err.stack.split(" at ");
                res.json({ message: 'Sorry something went wrong. ' + errors[0] });
            } else {
                client.release();
                console.log(results);
                // data = results.rows;
                // res.json({ results: data });
            }
        });
    } catch (e) {
        console.log(e);
    }
}) ;




// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))


