//TODO: Include the item_templates_timestamp reference
var _ = require('lodash');
var Promise = require('bluebird');
module.exports = function (requestData, req) {
    // console.log({requestData: requestData});
    /*
     {cell_id:[int],since_timestamp_ms:[int],latitude:0.0,longitude:0.0
     */
    if (false) {
        var S2cell = req.app.db.models.s2cell;
        return new Promise(function (resolve) {
            Promise
                .map(requestData.cell_id, function (cell, idx) {
                    return new Promise(function (r) {
                        S2cell
                            .findOne({where: {cell_id: cell}}, function (err, curCell) {
                                curCell.spawn_points();
                            });
                    });
                })
                .then(function (cells) {
                    resolve({
                        status: 'SUCCESS',
                        map_cells: cells
                    });
                });
        });
    } else {
        return {
            status: 'SUCCESS',
            map_cells: [
                {
                    s2_cell_id: 0,
                    current_timestamp_ms: 0,
                    forts: [],
                    spawn_points: [],
                    deleted_objects: [],
                    is_truncated_list: false,
                    fort_summaries: [],
                    decimated_spawn_points: [],
                    catchable_pokemons: [], //1 step or none
                    wild_pokemons: [], //2 steps or less
                    nearby_pokemons: [], //further than 2 steps
                }
            ]
        };
    }
};