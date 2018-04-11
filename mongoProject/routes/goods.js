var express = require('express');
var router = express.Router();
const encry = require('../otherModel/encrypted');
const mon = require('../otherModel/mongoConnect');

router.get('/',(req,res,next)=>{
    // 
    res.send('refresh');
    console.log(res)
})
module.exports = route;