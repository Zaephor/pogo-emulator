var POGOProtos = require('pokemongo-protobuf');
module.exports = function (req, res, next) {
    // console.log({stage:'decodeStart'});
    req.requestEnvelope = POGOProtos.parseWithUnknown(req.rawBody, "POGOProtos.Networking.Envelopes.RequestEnvelope");
    res.responseEnvelope = {
        status_code: 1,
        request_id: req.requestEnvelope.request_id,
        api_url: null,
        platform_returns: [],
        auth_ticket: null,
        returns: [],
        error: null,
    };

    // console.log({stage:'decodeEnd'});
    next();
};
