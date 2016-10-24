//TODO: Sync to DB
module.exports = function (requestData, req) {
    // console.log(requestData);
    var Player = req.app.db.models.player;
    return new Promise(function (resolve) {
        Player.findById(req.player.id, function (err, playerResult) {
            if (err) {
                console.log({err: err});
            }
            playerResult.player_data(function (err, playerData) {
                if (err) {
                    console.log({err: err});
                }
                if (playerData.username == requestData.codename) { // Already using this name
                    resolve({
                        codename: playerData.username,
                        user_message: 'I dont know what this is for',
                        is_assignable: false,
                        status: 'CURRENT_OWNER',
                        updated_player: JSON.parse(JSON.stringify(playerData))
                    });
                } else if (!/^[a-zA-Z0-9]+$/.test(requestData.codename)) { // Non-alphanumer characters
                    resolve({
                        codename: playerData.username,
                        user_message: 'I dont know what this is for',
                        is_assignable: false,
                        status: 'CODENAME_NOT_VALID',
                        updated_player: JSON.parse(JSON.stringify(playerData))
                    });
                } else {
                    //TODO: Check for duplicate usernames and prevent update if name is taken
                    // Valid
                    playerData.username = requestData.codename;
                    playerData.remaining_codename_claims -= 1;
                    playerData.save(function (err, updatedPlayerData) {
                        if (err) {
                            console.log({err: err});
                        }
                        resolve({
                            codename: playerData.username,
                            user_message: 'I dont know what this is for',
                            is_assignable: true,
                            status: 'SUCCESS',
                            updated_player: JSON.parse(JSON.stringify(updatedPlayerData))
                        });
                    });
                }
            });
        });
    });
};