//TODO: Include the item_templates_timestamp reference
module.exports = function (requestData, req) {
    req.player.client = {
        version: requestData.app_version,
        platform: requestData.platform,
        source: 'request'
    };
    return {
        "result": "SUCCESS",
        "item_templates_timestamp_ms": "1471650700946",
        "asset_digest_timestamp_ms": req.app.pogorpc.assets[req.player.client.platform.toLowerCase()].decode.timestamp_ms
    };
};