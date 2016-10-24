var express = require('express');
var router = express.Router();
var _ = require('lodash');

// TODO: Can use this and the captcha interface to build a server controller....
// TODO: Or check if the player is human... >.<

router.all('/test*', testCaptcha);
router.all('/welcome*', welcomeCaptcha);

function testCaptcha(req, res, next) {
    // req.query.language : en
    // req.query.cb : unixtime stamp @ ms level
    var appRoot = req.app;
    res.render('captcha/test');
}

function welcomeCaptcha(req,res,next){
    res.render('captcha/welcome');
}
module.exports = router;
