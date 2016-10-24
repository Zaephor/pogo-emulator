//TODO: Check on how the hash logic works, see if there are extra settings to add here
var crypto = require('crypto');
module.exports = function (requestData, req) {
    var response = {
        // error: null,
        hash: crypto.createHash('md5').update(JSON.stringify(req.app.config.pogo.game)).digest("hex"),
        settings: req.app.config.pogo.game
    };
    // console.log(response);
    return response;
};