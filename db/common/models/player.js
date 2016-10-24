'use strict';
var _ = require('lodash');
var POGOProtos = require('pokemongo-protobuf');

module.exports = function (Player) {
  // Operational hooks
  Player.observe('persist', function(ctx, next) {
    next();
  });

  // Custom methods
  Player.acquireStarter = function(email,starter,cb){
    // console.log(Object.keys(POGOProtos));
    Player
      .findOne({where:{email:email}},function(err,playerObj){
        //TODO: Create a pokemon model with their moves/stats/etc and a generator function, for now static testing
        playerObj.player_pokemon_data.create({
          // "id": "number",
          "pokemon_id ": starter,
          "cp": 100,
          "stamina": 5,
          "stamina_max": 10,
          // "move_1": "",
          // "move_2": "",
          "deployed_fort_id": null,
          "owner_name": '',
          "is_egg": false,
          "egg_km_walked_target": null,
          "egg_km_walked_start": null,
          "origin": 0,
          "float height_m": 1,
          "float weight_kg": 10,
          "individual_attack": 13,
          "individual_defense": 13,
          "individual_stamina": 13,
          "float cp_multiplier": 1.2,
          "pokeball": 0,
          "captured_cell_id": null,
          "battles_attacked": 0,
          "battles_defended": 0,
          "egg_incubator_id": null,
          "creation_time_ms": (new Date).getTime(),
          "num_upgrades": 0,
          "additional_cp_multiplier": 1.5,
          // "favorite": 1,
          "nickname": null,
          "from_fort": null,
          "buddy_candy_awarded": 0
        },function(err,pokemon_data){
          cb(pokemon_data);
        })
      });
  };
};
