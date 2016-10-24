//TODO: Sync to DB
module.exports = function (requestData, req) {
    // console.log(requestData);
    // TODO: Update DB by pushing 'requestData.tutorials_completed' to player_data
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
                playerData.tutorial_state.push(requestData.tutorials_completed);
                playerData.contact_settings.send_marketing_emails = requestData.send_marketing_emails;
                playerData.contact_settings.send_push_notifications = requestData.send_push_notifications;

                playerData.save(function (err, updatedPlayerData) {
                    if (err) {
                        console.log({err: err});
                    }
                    resolve({
                        success: true,
                        player_data: JSON.parse(JSON.stringify(updatedPlayerData))
                    });
                });
            });
        });
    });
};