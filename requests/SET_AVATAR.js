//TODO: Sync to DB
var _ = require('lodash');
module.exports = function (requestData, req) {
    console.log(requestData);
    // TODO: Update DB by updating 'requestData.player_avatar' to player_data
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
                // Edit avatar
                playerData.avatar = _.defaultsDeep(JSON.parse(JSON.stringify(requestData.player_avatar)), JSON.parse(JSON.stringify(playerData.avatar)));
                playerData.save(function (err, updatedPlayerData) {
                    if (err) {
                        console.log({err: err});
                    }
                    resolve({
                        status: 'SUCCESS',
                        player_data: JSON.parse(JSON.stringify(updatedPlayerData))
                    });
                });
            });
        });
    });
};