var Promise = require('bluebird');
var _ = require('lodash');
//TODO: Sync to DB
module.exports = function (requestData, req) {
    var PlayerModel = req.app.db.models.player;

    return new Promise(function (resolve) {
        PlayerModel
            .findOne({where: {email: req.player.email}}, function (err, player) {
                player.player_data(function (err, playerData) {
                    player.player_captcha.create({
                        url: '/captcha/test',
                        token: 'exit'
                    }, function (err, captcha) {
                        resolve({
                            status: true,
                            player_data: JSON.parse(JSON.stringify(playerData))
                        });
                    });
                });
            });
    });
};