var _ = require('lodash');
var Promise = require('bluebird');

module.exports.importGameMaster = importGameMaster;
module.exports.importAssetData = importAssetData;

function importGameMaster(dataObject, db) {
    if (dataObject.success === true) {
        var ItemTemplate = db.models.item_template;
        // console.log(JSON.stringify(dataObject));
        // _.forEach(dataObject.item_templates,function(item){
        //     console.log(item.template_id);
        // });
        Promise
            .each(dataObject.item_templates, function (item) {
                // console.log(dataObject.timestamp_ms);
                item.createdAt = new Date(parseInt(dataObject.timestamp_ms));
                // console.log(item.createdAt);
                return new Promise(function (resolve) {
                    ItemTemplate
                        .findOrCreate({where: {template_id: item.template_id}}, item, function (err, templateResult) {
                            resolve(templateResult);
                        });
                });
            });
    }
};

function importAssetData(dataObject, platform, db) {

};
