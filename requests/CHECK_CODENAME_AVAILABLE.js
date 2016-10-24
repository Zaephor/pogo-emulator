//TODO: Sync to DB
var _ = require('lodash');
module.exports = function (requestData, req) {
    var PlayerModel = req.app.db.models.player;
    var PlayerDataModel = req.app.db.models.player_data;

    return new Promise(function(resolve){
        PlayerDataModel.findOne({where:{username:requestData.codename}},function(err,playerDataResults){
            console.log({err:err,playerDataResults:playerDataResults});
            if(_.isNull(playerDataResults) || _.isEmpty(playerDataResults)){
                PlayerModel.findById(req.player.id,function(err,playerResult){
                    playerResult.player_data(function(err,playerDataObject){
                        playerDataObject.username = requestData.codename;
                        playerDataObject.save(function (err, updatedPlayerData) {
                            if (err) {
                                console.log({err: err});
                            }
                            resolve({
                                codename: updatedPlayerData.username,
                                user_message: 'I dont know what this is for',
                                is_assignable: true,
                                status: 'SUCCESS'
                            });
                        });
                    });
                })
            } else {
                resolve({
                    codename: playerDataResults.username,
                    user_message: 'I dont know what this is for',
                    is_assignable: false,
                    status: 'CODENAME_NOT_AVAILABLE'
                });
            }
        })
    });
};