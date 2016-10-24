var Promise = require('bluebird');
var _ = require('lodash');
//TODO: Sync to DB
module.exports = function (requestData, req) {
    var PlayerModel = req.app.db.models.player;
    return new Promise(function (resolve) {
        PlayerModel
            .findOne({where: {email: req.player.email}}, function (err, player) {
                if (!_.isEmpty(player) && !_.isUndefined(player)) {
                    player.player_captcha({order: 'createdAt ASC', limit: 1}, function (err, captcha) {
                        var clean = JSON.parse(JSON.stringify(captcha));
                        if (_.isEmpty(captcha) || _.isUndefined(captcha) || _.size(clean) === 0) { // no pending captchas...
                            resolve({
                                success: true
                            });
                        } else if (clean[0].token === requestData.token) {
                            player.player_captcha.destroy(clean[0].id);
                            resolve({
                                success: true
                            });
                        } else {
                            resolve({
                                success: false
                            });
                        }
                    });
                } else {
                    resolve({
                        success: true
                    });
                }
            });
    });
};