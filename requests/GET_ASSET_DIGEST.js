module.exports = function (requestData, req) {
    req.player.client = {
        version: requestData.app_version,
        platform: requestData.platform,
        source: 'request'
    };
    // console.log(req.app.pogorpc.assets[req.player.client.platform.toLowerCase()].buffer);
    return req.app.pogorpc.assets[req.player.client.platform.toLowerCase()].buffer;
};