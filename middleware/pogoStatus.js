var _ = require('lodash');

module.exports = function (req, res, next) {
    // console.log({stage:'statusStart'});
    if (res.responseEnvelope.status_code === 1) {
        if (_.isEmpty(req.params.loadbalance)) {
            if(!_.isEmpty(res.responseEnvelope.auth_ticket)){
                res.responseEnvelope.api_url = 'pgorelease.nianticlabs.com/plfe/' + (_.size(req.player.email) + _.size(res.responseEnvelope.auth_ticket.start));
            }

            if (!_.isEmpty(res.responseEnvelope.api_url) && !_.isEmpty(req.requestEnvelope.auth_info)) {
                res.responseEnvelope.status_code = 53; // 0.35.0 uses 53, newer accepts 2...?
            } else if (!_.isEmpty(res.responseEnvelope.api_url) && !_.isEmpty(req.requestEnvelope.auth_ticket)) {
                res.responseEnvelope.status_code = 2; // 0.35.0 uses 53, newer accepts 2...?
            }
        }
    }

    // console.log({stage:'statusEnd'});
    next();
};
