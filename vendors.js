var express = require('express')
var router = express.Router()
var path = require('path')
router.use('/bootstrap', express.static(path.join('index.html',"../node_modules/bootstrap/dist")))

module.exports = bootst;