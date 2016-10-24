var POGOProtos = require('pokemongo-protobuf');
var express = require('express');
var router = express.Router();

router.post('/rpc',processRequest);
router.post('/:identifier/rpc',processRequest);

function processRequest(req,res,next){
  var appRoot = req.app;
  // console.log({request:req.requestEnvelope,response:res.responseEnvelope,player:req.player});
  // console.log(JSON.stringify({request:req.requestEnvelope,response:res.responseEnvelope,player:req.player}));
  console.log(JSON.stringify({player:req.player}));
  res.end(POGOProtos.serialize(res.responseEnvelope, "POGOProtos.Networking.Envelopes.ResponseEnvelope"));
  // res.end(JSON.stringify({req:Object.keys(req),body:req.body,params:req.params,method:req.method}));
};

module.exports = router;
