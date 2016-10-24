//TODO: Sync to DB
var _ = require('lodash');
module.exports = function (requestData, req) {
    var Player = req.app.db.models.player;
    var PlayerData = req.app.db.models.player_data;
    return new Promise(function (resolve) {
        if(_.isEmpty(requestData)){
            Player.findOne({where:{email:req.player.email}},function(err,playerMatch){
                if(_.isEmpty(playerMatch)){
                    resolve({
                        result: 'UNSET',
                        start_time: null,
                        badges: null
                    });
                } else {
                    playerMatch.player_data(function(err,PlayerDataResult){
                        if (err) {
                            console.log({err: err});
                        }
                        if (_.isEmpty(PlayerDataResult)) {
                            resolve({
                                result: 'UNSET',
                                start_time: null,
                                badges: null
                            });
                        } else {
                            resolve({
                                result: 'SUCCESS',
                                start_time: PlayerDataResult.creation_timestamp_ms,
                                badges: []
                            });
                        }
                    });
                }
            });
        }else {
            PlayerData.findOne({where: {username: requestData.player_name}}, function (err, PlayerDataResult) {
                if (err) {
                    console.log({err: err});
                }
                if (_.isEmpty(PlayerDataResult)) {
                    resolve({
                        result: 'UNSET',
                        start_time: null,
                        badges: null
                    });
                } else {
                    resolve({
                        result: 'SUCCESS',
                        start_time: PlayerDataResult.creation_timestamp_ms,
                        badges: []
                    });
                }
            });
        }
    });
};