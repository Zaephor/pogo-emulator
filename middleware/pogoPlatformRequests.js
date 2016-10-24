var POGOProtos = require('pokemongo-protobuf');
var Promise = require('bluebird');
var _ = require('lodash');
var changeCase = require('change-case');
var pcrypt = require('pcrypt');

module.exports = function (req, res, next) {
    var appRoot = req.app;
    // console.log({stage:'platformRequestsStart'});

    Promise
        .each(req.requestEnvelope.platform_requests, function (requestObject) {
            var requestFormatted = changeCase.pascalCase(requestObject.type);
            // console.log({requestObject: requestObject, requestFormatted: requestFormatted});
            if (_.isUndefined(appRoot.pogorpc.platform_request[requestObject.type])) {
                console.log('Platform Request undefined: ' + requestObject.type);
                return true;
            } else {
                var decoded = null;
                // if(!_.isEmpty(requestObject.request_message)){
                //     decoded = parseSecureProtobuf(requestObject.request_message, "POGOProtos.Networking.Platform.Requests." + requestFormatted + "Request");
                //     console.log({decoded:decoded});
                // }
                // console.log({
                //     decoded: decoded,
                //     message: "POGOProtos.Networking.Platform.Requests." + requestFormatted + "Request"
                // });

                res.responseEnvelope.platform_returns.push(
                    POGOProtos.serialize(appRoot.pogorpc.platform_request[requestObject.type](decoded, req),
                        "POGOProtos.Networking.Platform.Responses." + requestFormatted + "Response")
                );

                // res.responseEnvelope.platform_returns.push(appRoot.pogorpc.platform_request[requestObject.type](decoded, req.app));
            }
        })
        .then(function () {
            // console.log({stage:'platformRequestsEnd'});
            next();
        });
};

function parseSecureProtobuf(message, schema) {
    try {
        console.log(message);
        var buffer = pcrypt.decrypt(message);
        return POGOProtos.parseWithUnknown(new Buffer(buffer), schema);
    } catch (e) {
        console.log(e);
        return {};
    }
}