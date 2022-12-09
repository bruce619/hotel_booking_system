const env = process.env.NODE_ENV || 'development';

// import database configurations 
const config = require('./config.js')[env];

const express = require('express')
const app = express();
const port = 3000;

/// load PG library
const pg = require('pg');

const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

///This is a built-in middleware function in Express. 
///It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded());

app.use(express.static('public'));

// use json body parser by default
app.use(bodyParser.json());


/* landing page GET request */
app.get('/', (req, res) => {
    // res.send('Web Programming is fun! ')
    /// send the static file 
    res.sendFile('index.html', (err) => {
        if (err){
            console.log(err);
        }
    })
  });

  /* GET request*/
app.get('/hello', (req, res) => {
    res.send('GET: Hello!');
});

/* GET request with parameter */
app.get('/hello/:name', (req,res) => {
    const routeParams = req.params;
    const name = routeParams.name
    res.send('GET: Hello, ' + name);
});

/* GET data from database */
app.get('/users', async (req,res) => {
	try{
		let results;
		const pool = new pg.Pool(config);
		const client = await pool.connect();
		const q = 'select * from users;'
		await client.query(q, (err, results) => {
		  if (err) {
		    console.log(err.stack)
			errors = err.stack.split(" at ");
		    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		  } else {
			client.release();
		   // console.log(results); //
	   		data = results.rows;
	   		count = results.rows.length;
            res.json({ results:data, rows:count });
		  }
		});

	}catch(e){
		console.log(e);
	}	
});

/* POST request with parameter */
app.post('/hello',  (req,res) => {
    const body = req.body;
    const name = body.name;
    const email = body.email;
    res.send('POST: Name: ' + name + ', email: ' + email);
 });
 
 /* POST request by contact.html page */
app.post('/form', (req,res) => {
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const message = body.message;
    res.send(` POST by form.js - name = ${name}  , email = ${email} , message = ${message}`);
});

/* insert a new entry to users table */
app.post('/adduser', async (req, res) =>{
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const message = body.message;

	try{
		let results;
		const pool = new pg.Pool(config);
		const client = await pool.connect();
		const q = `insert into users values ((SELECT COALESCE(MAX(id),0) FROM users) + 1, '${name.trim()}', '${email.trim()}', '${message.trim()}'); select * from users; `;
		await client.query(q, (err, results) => {
		  if (err) {
		    console.log(err.stack)
			errors = err.stack.split(" at ");
		    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		  } else {
			client.release();
		   // console.log(results); //
	   		data = results[1].rows;
	   		count = results[1].rows.length;
            res.json({ results:data, rows:count });
		  }
		});

	}catch(e){
		console.log(e);
	}	

});

app.listen(port, () => {
    console.log(`My first app listening on port ${port}!`)
});