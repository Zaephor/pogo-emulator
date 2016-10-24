var Promise = require('bluebird');
//TODO: Sync to DB
module.exports = function (requestData, req) {
    var appRoot = req.app;
    console.log(req.player.email + ' chose '+ requestData.pokemon_id + ' as their starter.');
    var Player = appRoot.db.models.player;
    return new Promise(function(resolve){
        Player.acquireStarter(req.player.email,requestData.pokemon_id,function(pokemon_data){
            resolve({
                result: 'SUCCESS',
                pokemon_data: pokemon_data,
                capture_award: {}
            });
        });
    });
    // return {
    //     result: 'SUCCESS',
    //     pokemon_data: {},
    //     capture_award: {},
    // };
};
