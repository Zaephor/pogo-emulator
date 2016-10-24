var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
var glob = require('glob');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dnsSync = require('dns-sync');
var getRawBody = require('raw-body');
var requestIp = require('request-ip');
var POGOProtos = require('pokemongo-protobuf');
var ip = require('ip');

var app = express();

// ==================================================================== IMPORTS
/* Load config files */
app.config = {
    server: require('./config/server.example.js'),
    pogo: require('./config/pogo.example.js')
};

_.forEach(glob.sync('./config/+(server|pogo).js'), function (filepath) {
    var section = path.basename(filepath).split('.')[0];
    app.config[section] = _.defaultsDeep(require(filepath), app.config[section])
});

// Obtain IP address if not specified
if(_.isEmpty(app.config.ip)){
    app.config.ip = ip.address();
}

/* Do some DNS magic */
app.dns = {
    domains: {},
    ips: {}
};

_.forEach(['pgorelease.nianticlabs.com'], function (domain) {
    var ip = dnsSync.resolve(domain);
    app.dns.domains[domain] = app.dns.ips[ip] = {domain: domain, ip: ip};
});

app.db = require('./db');

/* Import the RPC functions */
app.pogorpc = {
    request: {},
    platform_request: {}
};
_.forEach(glob.sync('./requests/*.js'), function (filepath) {
    var action = path.basename(filepath).split('.')[0];
    app.pogorpc.request[action] = require(filepath);
});
_.forEach(glob.sync('./platform_requests/*.js'), function (filepath) {
    var action = path.basename(filepath).split('.')[0];
    app.pogorpc.platform_request[action] = require(filepath);
});

app.pogorpc.assets = {};
_.forEach(['android','ios'],function(platform){
    var buffer = fs.readFileSync('./assets/'+platform+'/asset_digest');
    app.pogorpc.assets[platform] = {
        buffer: buffer,
        decode: parseProtobuf(buffer, "POGOProtos.Networking.Responses.GetAssetDigestResponse")
    };
    require('./util/dataimport').importAssetData(app.pogorpc.assets[platform].decode,platform,app.db);
});
app.pogorpc.game_master = parseProtobuf(fs.readFileSync('./assets/game_master'),"POGOProtos.Networking.Responses.DownloadItemTemplatesResponse");
require('./util/dataimport').importGameMaster(app.pogorpc.game_master,app.db);


//==============================================================================================Middlewares
app.set('views', './views');
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(logger(':method :remote-addr :req[host] :url :status :response-time ms - :res[content-length]'));

// app.use(bodyParser.raw());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(requestIp.mw());

/* Middlewares! */
app.use('/plfe*', function (req, res, next) {
    if (!req.viaProxy) {
        getRawBody(req)
            .then(function (buf) {
                req.rawBody = buf;
                next();
            });
    } else {
        next();
    }
});

app.use('/plfe/rpc',
    require('./middleware/pogoDecode'),
    require('./middleware/pogoAuthRead'),
    require('./middleware/pogoPlatformRequests'),
    require('./middleware/pogoRequests'),
    require('./middleware/pogoAuthWrite'),
    require('./middleware/pogoStatus')
);

app.use('/plfe/:loadbalance/rpc',
    require('./middleware/pogoDecode'),
    require('./middleware/pogoAuthRead'),
    require('./middleware/pogoPlatformRequests'),
    require('./middleware/pogoRequests'),
    require('./middleware/pogoAuthWrite'),
    require('./middleware/pogoStatus')
);
app.use('/pogoassets',require('./middleware/pogoAssetKeeper'));


/* MISC API Routes */
app.use('/', require('./routes/index'));
app.use('/plfe', require('./routes/pogoRPC'));
app.use('/proxy', require('./routes/proxyData'));
app.use('/pogoassets',express.static(path.join(__dirname, 'assets')));
app.use('/captcha', require('./routes/captcha'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//========================================================================================= error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

function parseProtobuf(buffer, schema) {
    try {
        return POGOProtos.parseWithUnknown(new Buffer(buffer), schema);
        // return {};
    } catch (e) {
        console.log(e);
        return {};
    }
}