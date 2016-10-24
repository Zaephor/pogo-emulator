var Promise = require('bluebird');
var fs = require("fs");
var pogo = require("pogo-asset-downloader");
var _ = require('lodash');

var config = require('./config/download.example.js');
config = _.defaultsDeep(require('./config/download.js'), config);

if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
    _.forEach(pogo.platforms, function (platformObj) {
        fs.mkdirSync('./assets/' + platformObj.name);
    });
}

pogo
    .login({
        provider: config.provider,
        username: config.username,
        password: config.password
    })
    .then(function () {
        return Promise
            .resolve(function () {
                console.log('[INFO] Obtaining game_master file');
                pogo
                    .getGameMaster()
                    .then(function (gameMaster) {
                        fs.writeFileSync('./assets/game_master', gameMaster.body);
                    });
            })
            .each(pogo.platforms, function (platform) {
                platform.version = config.version;
                pogo.setPlatform(platform);
                console.log('[INFO] Obtaining asset_digest file for '+platform.name);
                pogo
                    .getAssetDigest(platform)
                    .then(function (asset_digest) {
                        fs.writeFileSync('./assets/' + platform.name + '/asset_digest');
                    });
                return Promise.each(_.range(1, 152, 1), function (pokemonId) {
                    return new Promise(function (resolve) {
                        console.log('[INFO] Obtaining '+pokemonId+' asset file for '+platform.name);
                        pogo
                            .getAssetByPokemonId(pokemonId)
                            .then(function (downloads) {
                                downloads.map(function (item) {
                                    fs.writeFileSync('./assets/' + platform.name + '/' + item.name, item.body, resolve);
                                })
                            });
                    }).delay(config.delay);
                });
            });
    });