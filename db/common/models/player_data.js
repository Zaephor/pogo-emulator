'use strict';
var _ = require('lodash');

module.exports = function (PlayerData) {
  PlayerData.observe('persist', function(ctx, next) {
    if(_.size(ctx.data.tutorial_state) > 1){
      ctx.data.tutorial_state = _.uniq(ctx.data.tutorial_state);
    }
    if(_.size(ctx.currentInstance.tutorial_state) > 1){
      ctx.currentInstance.tutorial_state = _.uniq(ctx.currentInstance.tutorial_state);
    }
    next();
  });
};
