//TODO: Sync to DB
var Promise = require('bluebird');
var _ = require('lodash');
module.exports = function (requestData, req) {
    if (_.isEmpty(requestData)) {
        requestData = {};
    }
    if (_.isEmpty(requestData.last_timestamp_ms)) {
        requestData.last_timestamp_ms = 0;
    }
    var Player = req.app.db.models.player;
    return new Promise(function (resolve) {
        Player.findById(req.player.id, function (err, playerResult) {
            Promise
                .props({
                    pokemon_data: new Promise(function (resolve) {
                        playerResult.player_pokemon_data({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                Promise
                                    .map(cleanData, function (itemEntry) {
                                        return {
                                            modified_timestamp_ms: (new Date(itemEntry.updatedAt)).getTime(),
                                            deleted_item: null,
                                            inventory_item_data: {
                                                pokemon_data: itemEntry
                                            }
                                        };
                                    })
                                    .then(function (x) {
                                        resolve(x)
                                    });
                            }
                        });
                    }),
                    item: new Promise(function (resolve) {
                        playerResult.player_item({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                Promise
                                    .map(cleanData, function (itemEntry) {
                                        return {
                                            modified_timestamp_ms: (new Date(itemEntry.updatedAt)).getTime(),
                                            deleted_item: null,
                                            inventory_item_data: {
                                                item: itemEntry
                                            }
                                        };
                                    })
                                    .then(function (x) {
                                        resolve(x)
                                    });
                            }
                        });
                    }),
                    pokedex_entry: new Promise(function (resolve) {
                        playerResult.player_pokedex_entry({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: 0,
                                    deleted_item: null,
                                    inventory_item_data: {
                                        pokedex_entry: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    stats: new Promise(function (resolve) {
                        playerResult.player_stats(function (err, data) {
                            if (_.isEmpty(data) || data.updatedAt.getTime() < requestData.last_timestamp_ms) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: (new Date(cleanData.updatedAt)).getTime(),
                                    deleted_item: null,
                                    inventory_item_data: {
                                        player_stats: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    currency: new Promise(function (resolve) {
                        playerResult.player_currency(function (err, data) {
                            if (_.isEmpty(data) || data.updatedAt.getTime() < requestData.last_timestamp_ms) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: (new Date(cleanData.updatedAt)).getTime(),
                                    deleted_item: null,
                                    inventory_item_data: {
                                        player_currency: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    camera: new Promise(function (resolve) {
                        playerResult.player_camera(function (err, data) {
                            if (_.isEmpty(data) || data.updatedAt.getTime() < requestData.last_timestamp_ms) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: (new Date(cleanData.updatedAt)).getTime(),
                                    deleted_item: null,
                                    inventory_item_data: {
                                        player_camera: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    inventory_upgrades: new Promise(function (resolve) {
                        playerResult.player_inventory_upgrades({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: 0,
                                    deleted_item: null,
                                    inventory_item_data: {
                                        inventory_upgrades: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    applied_items: new Promise(function (resolve) {
                        playerResult.player_applied_items({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: 0,
                                    deleted_item: null,
                                    inventory_item_data: {
                                        applied_items: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    egg_incubators: new Promise(function (resolve) {
                        playerResult.player_egg_incubators({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: 0,
                                    deleted_item: null,
                                    inventory_item_data: {
                                        egg_incubators: cleanData
                                    }
                                });
                            }
                        });
                    }),
                    candy: new Promise(function (resolve) {
                        playerResult.player_candy({where: {creation_time_ms: {gt: requestData.last_timestamp_ms}}}, function (err, data) {
                            if (_.isEmpty(data)) {
                                resolve(null);
                            } else {
                                var cleanData = JSON.parse(JSON.stringify(data));
                                resolve({
                                    modified_timestamp_ms: 0,
                                    deleted_item: null,
                                    inventory_item_data: {
                                        candy: cleanData
                                    }
                                });
                            }
                        });
                    }),
                })
                .then(function (results) {
                    // console.log(results);
                    var inventory_items = _.filter(_.concat([], results.stats, results.camera, results.item, results.currency, results.pokemon_data));
                    // console.log(inventory_items);
                    // console.log(JSON.stringify(inventory_items));
                    resolve({
                        success: true,
                        inventory_delta: {
                            original_timestamp_ms: requestData.last_timestamp_ms,
                            new_timestamp_ms: _.max(_.map(inventory_items, _.property('modified_timestamp_ms'))),
                            inventory_items: inventory_items
                        },
                    });
                });
        });
    });
};