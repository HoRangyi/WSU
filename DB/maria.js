const maria = require('mysql')

var host_number = '127.0.0.1'

const conn = maria.createConnection({
    host: host_number,
    port:3308,
    user:'root',
    password:'root',
    database:'emproject'
})

module.exports = conn