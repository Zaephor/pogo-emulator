var Promise = require('bluebird');
var _ = require('lodash');
//TODO: Have some fun with this...
module.exports = function (requestData, req) {
    var PlayerModel = req.app.db.models.player;
    return new Promise(function (resolve) {
        PlayerModel
            .findOne({where: {email: req.player.email}}, function (err, player) {
                if (!_.isEmpty(player) && !_.isUndefined(player)) {
                    player.player_captcha({order: 'createdAt ASC', limit: 1}, function (err, captcha) {
                        var clean = JSON.parse(JSON.stringify(captcha));
                        if (_.isEmpty(captcha) || _.isUndefined(captcha) || _.size(clean) === 0) {
                            resolve({show_challenge: false});
                        } else {
                            resolve({
                                show_challenge: true,
                                challenge_url: "http://" + req.app.config.ip + ':' + req.app.config.server.web.port + clean[0].url + '/' + clean[0].id
                            });
                        }
                    });
                } else {
                    resolve({
                        show_challenge: true,
                        challenge_url: "http://" + req.app.config.ip + ':' + req.app.config.server.web.port + '/captcha/welcome'
                    });
                }
            });
    });
};