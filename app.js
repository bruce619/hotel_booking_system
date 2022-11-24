// Imports
const express = require('express')
const app = express()
const port = 3000

// use static files: css, js, img
app.use(express.static('/src/public/assets'))
// css
app.use('/css', express.static(__dirname + '/src/public/assets/css'))
// js
app.use('/js', express.static(__dirname + '/src/public/assets/js'))
// img
app.use('/img', express.static(__dirname + '/src/public/assets/img'))


// use html templates
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/templates/index.html')
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

// Listen to port 3000
app.listen(port, () => console.info(`hotel booking app listening on port ${port}`))