var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');
var pem = require('pem');

/* GET */
router.all('/pac', generatePAC);
router.all('/ca.*', sendCertificates);
// router.all('/pac2', generatePAC2);

function generatePAC(req, res, next) {
    var appRoot = req.app;
    res.render('proxy/pac', {
        hosts: Object.keys(appRoot.dns.domains).join('|'),
        ip: appRoot.config.ip,
        port: appRoot.config.server.proxy.port
    });
}

function sendCertificates(req, res, next) {
    var appRoot = req.app;
    // fs.readFile(appRoot.config.server.proxy.sslCaDir + "/certs/ca.pem", function (error, data) {
    //     pem.getFingerprint(data,'sha1', function (err, fingerprint) {
    //         console.log({err: err, fingerprint: fingerprint});
    //     });
    // });

    res.download(appRoot.config.server.proxy.sslCaDir + "/certs/ca.pem",'ca.crt');
}

module.exports = router;
