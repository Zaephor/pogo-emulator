var POGOProtos = require('pokemongo-protobuf');
var jwt = require('jwt-simple');
var _ = require('lodash');

// TODO: Interface into DB
module.exports = function (req, res, next) {
    var appRoot = req.app;
    // console.log({stage: 'authWriteStart'});

    var expire_timestamp_ms = ((new Date).getTime() + (1000 * 60 * 30)); // 30 minutes from now;
    var authStartPayload = {
        email: req.player.email,
        expire_timestamp_ms: expire_timestamp_ms
    };

    if (
        !_.isEmpty(req.requestEnvelope.auth_info) || // New session
        (!_.isEmpty(req.player.client) && req.player.client.source === 'request') || // Device Detected
        (req.requestEnvelope.auth_ticket.expire_timestamp_ms < (new Date).getTime()) // Session expired
    ) {
        if (!_.isEmpty(req.player.client)) {
            authStartPayload.client = req.player.client;
            authStartPayload.client.source = 'jwt';
        }

        res.responseEnvelope.auth_ticket = {
            start: new Buffer(jwt.encode(authStartPayload, appRoot.config.server.jwt.secret)),
            expire_timestamp_ms: expire_timestamp_ms,
            end: new Buffer("")
        }
    }

    // console.log({stage: 'authWriteEnd'});
    next();
};
