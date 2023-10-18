const maria = require('mysql')

var host_number = '172.16.6.216'

const conn = maria.createConnection({
    host: host_number,
    port:3306,
    user:'tester',
    password:'5340',
    database:'myproject'
})

module.exports = conn