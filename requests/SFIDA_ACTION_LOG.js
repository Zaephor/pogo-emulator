//TODO: Sync to DB
module.exports = function (requestData, req) {
    return new Promise(function (resolve) {
        resolve({
            result: 'SUCCESS',
            log_entries: [
                {
                    timestamp_ms: (new Date()).getTime(),
                    sfida: true,
                    catch_pokemon: {
                        result: 'POKEMON_CAPTURED',
                        pokemon_id: 'MEW',
                        combat_points: 9001,
                        pokemon_data_id: 0
                    }
                },
                {
                    timestamp_ms: (new Date()).getTime(),
                    sfida: true,
                    catch_pokemon: {
                        result: 'POKEMON_CAPTURED',
                        pokemon_id: 'MISSINGNO',
                        combat_points: 9001,
                        pokemon_data_id: 0
                    }
                }
            ]
        });
    });
};