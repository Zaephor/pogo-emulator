//TODO: Sync to DB
var _ = require('lodash');
var Promise = require('bluebird');
var jwt = require('jwt-simple');
module.exports = function (requestData, req) {
    var appRoot = req.app;
    var baseURL = 'http://' + appRoot.config.ip + ':' + appRoot.config.server.web.port;
    var assetBase = '/pogoassets/' + req.player.client.platform.toLowerCase() + '/';
    console.log(requestData);
    console.log(req.app.pogorpc.assets.android.decode.digest[0]);
    console.log(_.find(req.app.pogorpc.assets.android.decode.digest, {asset_id: requestData.asset_id[0]}));
    return Promise
        .map(requestData.asset_id, function (assetCode) {
            var assetObject = _.find(req.app.pogorpc.assets.android.decode.digest, {asset_id: assetCode});
            var tokenString = "?token=" + jwt.encode({expires: (new Date).getTime() + (1000 * 60 * 2)}, appRoot.config.server.jwt.secret); // 2 minute cooldown
            return {
                asset_id: assetObject.asset_id,
                url: baseURL + assetBase + assetObject.bundle_name + tokenString,
                size: assetObject.size,
                checksum: assetObject.checksum,
            };
        })
        .then(function (results) {
            console.log({results: results});
            return {
                download_urls: results
            };
        });
};