var Promise = require('bluebird');
//TODO: Sync to DB
module.exports = function (requestData, req) {
    var Player = req.app.db.models.player;
    return new Promise(function (resolve) {
        Player.findById(req.player.id, function (err, playerResult) {
            if (err) {
                console.log({err: err});
            }
            playerResult.player_data(function (err, playerData) {
                if (err) {
                    console.log({err: err});
                }
                resolve({
                    success: true,
                    player_data: JSON.parse(JSON.stringify(playerData))
                });
            });
        });
    });
};