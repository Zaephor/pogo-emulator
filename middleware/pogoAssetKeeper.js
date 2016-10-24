var _ = require('lodash');
var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
    var appRoot = req.app;
    var jwtPayload = jwt.decode(req.query.token, appRoot.config.server.jwt.secret); // Our JWT
    if(!_.isEmpty(jwtPayload) && !_.isUndefined(jwtPayload.expires) && (new Date).getTime() <= jwtPayload.expires){
        next();
    } else {
        res.status(401).send({status:401, message: 'Token expired'});
    }
};
