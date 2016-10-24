var Promise = require('bluebird');
var _ = require('lodash');
module.exports = function (requestData, req) {
    // console.log(req.app.pogorpc.game_master);
    var ItemTemplate = req.app.db.models.item_template;
    return new Promise(function(resolve){
        ItemTemplate
            .find({},function(err,itemTemplates){
                var cleanData = JSON.parse(JSON.stringify(itemTemplates));
                var timestamp_ms = (new Date(_.max(_.map(cleanData, _.property('createdAt'))))).getTime();
                // console.log(_.size(cleanData));
                resolve({
                    success: true,
                    item_templates: cleanData,
                    timestamp_ms: timestamp_ms
                });
            });
    });
};