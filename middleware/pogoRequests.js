var POGOProtos = require('pokemongo-protobuf');
var Promise = require('bluebird');
var _ = require('lodash');
var changeCase = require('change-case');

module.exports = function (req, res, next) {
    var appRoot = req.app;
    // console.log({stage: 'requestsStart'});

    Promise
        .each(req.requestEnvelope.requests, function (requestObject) {
            var requestFormatted = changeCase.pascalCase(requestObject.request_type);
            // console.log({requestObject: requestObject});
            if (_.isUndefined(appRoot.pogorpc.request[requestObject.request_type])) {
                console.log('Request undefined: ' + requestObject.request_type);
            } else {
                var decoded = null;
                if (!_.isEmpty(requestObject.request_message)) {
                    decoded = parseProtobuf(requestObject.request_message, "POGOProtos.Networking.Requests.Messages." + requestFormatted + "Message");
                    // console.log({decoded:decoded});
                }

                var outcome = Promise.resolve(appRoot.pogorpc.request[requestObject.request_type](decoded, req));
                // var outcome = appRoot.pogorpc.request[requestObject.request_type](decoded, req);
                // console.log({outcome:Promise.resolve(outcome)});
                return outcome.then(function (result) {
                    switch (requestObject.request_type) { // override for buffered replies
                        case 'GET_ASSET_DIGEST':
                            // res.responseEnvelope.returns.push(outcome);
                            return res.responseEnvelope.returns.push(result);
                            break;
                        default: // Default outcome should be an object
                            return res.responseEnvelope.returns.push(
                                // POGOProtos.serialize(outcome, "POGOProtos.Networking.Responses." + requestFormatted + "Response")
                                POGOProtos.serialize(result, "POGOProtos.Networking.Responses." + requestFormatted + "Response")
                            );
                            break;
                    }
                });
            }
        })
        .then(function () {
            console.log(JSON.stringify({
                player: req.player.email,
                requests: _.flatMap(req.requestEnvelope.requests, function (x) {
                    return x.request_type;
                })
            }));
            next();
        });
};

function parseProtobuf(buffer, schema) {
    try {
        return POGOProtos.parseWithUnknown(new Buffer(buffer), schema);
        // return {};
    } catch (e) {
        console.log(e);
        return {};
    }
}