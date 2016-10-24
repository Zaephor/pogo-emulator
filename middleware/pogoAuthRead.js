var Promise = require('bluebird');
var jwt = require('jwt-simple');
var _ = require('lodash');
var S2 = require('s2-geometry').S2;

// TODO: Interface into DB
module.exports = function (req, res, next) {
    var appRoot = req.app;

    Promise
        .resolve()
        // .then(console.log({stage: 'authReadStart'}))
        .then(function () {
            if (!_.isEmpty(req.requestEnvelope.auth_info)) { // New session
                var ssoJwtPayload = jwt.decode(req.requestEnvelope.auth_info.token.contents, '', true); // Google/PTC JWT

                /* For next middleware processors */
                req.player = {
                    email: ssoJwtPayload.email,
                    location: {
                        latitude: req.requestEnvelope.latitude,
                        longitude: req.requestEnvelope.longitude,
                        accuracy: req.requestEnvelope.accuracy || -1
                    }
                };
                if (!_.isUndefined(req.requestEnvelope.latitude) && !_.isUndefined(req.requestEnvelope.longitude)) {
                    var coordkey = S2.latLngToKey(req.requestEnvelope.latitude, req.requestEnvelope.longitude, 15);
                    req.player.location.s2cell = S2.keyToId(coordkey);
                }
                return true;

            } else if (!_.isEmpty(req.requestEnvelope.auth_ticket)) { // Existing session
                var jwtPayload = jwt.decode(req.requestEnvelope.auth_ticket.start.toString(), appRoot.config.server.jwt.secret); // Our JWT
                /* For next middleware processors */
                req.player = {
                    email: jwtPayload.email,
                    client: jwtPayload.client,
                    location: {
                        latitude: req.requestEnvelope.latitude,
                        longitude: req.requestEnvelope.longitude,
                        accuracy: req.requestEnvelope.accuracy || -1,
                    },
                };
                if (!_.isUndefined(req.requestEnvelope.latitude) && !_.isUndefined(req.requestEnvelope.longitude)) {
                    var coordkey = S2.latLngToKey(req.requestEnvelope.latitude, req.requestEnvelope.longitude, 15);
                    req.player.location.s2cell = S2.keyToId(coordkey);
                }
                return true;
            } else {
                return true;
            }
        })
        .then(function () {
            return new Promise(function (resolve) {
                if (_.isEmpty(req.player)) {
                    resolve();
                } else {
                    var Player = appRoot.db.models.player;
                    Player.findOrCreate({
                        where: {email: req.player.email}
                        // }, req.player, function(err, playerResult,isNewPlayer) {
                    }, JSON.parse(JSON.stringify(req.player)), function (err, playerResult, isNewPlayer) {
                        if (err) {
                            console.log({err: err});
                        }
                        // console.log({playerResult: playerResult, err: err, isNewPlayer: isNewPlayer});
                        if (isNewPlayer) {
                            playerResult.player_stats.create({});
                            playerResult.player_camera.create({});
                            playerResult.player_currency.create({});
                            playerResult.player_captcha.create({
                                url: '/captcha/welcome',
                                token: 'exit'
                            });
                            playerResult.player_data.create({
                                creation_timestamp_ms: (new Date()).getTime(),
                                username: '',
                                tutorial_state: [],
                                avatar: {
                                    "skin": 0,
                                    "hair": 0,
                                    "shirt": 0,
                                    "pants": 0,
                                    "hat": 0,
                                    "shoes": 0,
                                    "gender": 'MALE',
                                    "eyes": 0,
                                    "backpack": 0
                                },
                                contact_settings: {
                                    send_marketing_emails: false,
                                    send_push_notifications: false
                                },
                                remaining_codename_claims: appRoot.config.pogo.player.name_changes,
                                max_pokemon_storage: appRoot.config.pogo.game.inventory_settings.base_pokemon,
                                max_item_storage: appRoot.config.pogo.game.inventory_settings.base_bag_items,
                                currencies: [
                                    {name: "POKECOIN", amount: 0}, {name: "STARDUST", amount: 0}
                                ]
                            });
                        }
                        req.player.id = playerResult.id;
                        resolve();
                    });
                }
            });
        })
        .then(function () {
            // console.log({stage: 'authReadEnd'});
            next();
        });
};
