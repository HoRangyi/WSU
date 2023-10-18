const maria = require('mysql')

const conn = maria.createConnection({
    host: 'localhost',
    port:3308,
    user:'root',
    password:'root',
    database:'emproject'
})

module.exports = conn