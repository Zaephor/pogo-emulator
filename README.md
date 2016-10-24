## Progress
#### Supported/tested [versions](http://pokemon-go.en.uptodown.com/android/old):
- [x] `0.35.0`
#### Features/progress/todo
- [ ] Environment variable config support
- [x] MITM Proxy
- [x] Google User authentication/login
- [ ] PTC User authentication/login `Could probably emulate the SSO server as well...`
- [x] Create/Edit player avatar(tutorial + afterwards)
- [x] Create/Change playername
- [ ] Pokemon generator
    - [ ] Import game_master
    - [ ] Build pokemon profiles using game_master data
    - [ ] Custom Spawn tables
    - [ ] Spawn database
    - [ ] `generateStarter` (Generate "decent" starter and assign to player)
    - [ ] `generateWild`
    - [ ] `generateEgg`
- [ ] Captcha menu
    - [x] Welcome disclaimer(Needs improvement though)
    - [ ] pogo-emulator admin menu
    - [ ] pogo-emulator player menu
- [ ] Pokestops
    - [ ] Custom Loot tables
- [ ] Gyms
- [ ] Imports
    - [ ] [PokemonGoMap](https://github.com/PokemonGoMap/PokemonGo-Map)
        - [ ] Spawn JSON files
        - [ ] Webhook target
- [ ] Configurable
    - [ ] Simplify configuring `Loopback` for `MongoDB`, `Redis` and `MariaDB`
- [ ] Other
    - [ ] Could easily add support for the PokemonGoMap frontend to interface directly with the server's database, or some other Map frontend
## Getting started
Below are steps I use for connecting/testing/etc. Remember this is an unofficial server, so we don't care about SafetyNet

- Server
    - Ubuntu 14.04 (From scratch VM/DigitalOcean/etc)
        1. `curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -`
        1. `sudo apt-get install -y nodejs`
        1. `git clone https://github.com/zaephor/pogo-emulator.git`
        1. `cd pogo-emulator`
        1. `npm install`
        1. `cp config/pogo.example.js config/pogo.js`
        1. `cp config/server.example.js config/server.js`
        1. `cp config/download.example.js config/download.js`
        1. Edit `config/server.js` and `config/pogo.js` to your liking
            - Make sure you supply a `google_maps_api_key`in `config/pogo.js`
        1. Download the PokemonGo `game_master`, `assetdigest` and all the Pokemon asset files
            - Can edit `config/download.js` and run `npm assets` or `node download.js` to obtain these files
        1. `npm start`
            - I often run this from within a `screen` session...
- Client
    - Android (CM12.1 Root + Xposed)
        1. Install Xposed somehow(look this one up)
        1. Install @[rastapasta](https://github.com/rastapasta)'s [Pokemon Go Xposed](https://github.com/rastapasta/pokemon-go-xposed) (Mostly care about the cert pinning)
        1. Activate [Pokemon Go Xposed](https://github.com/rastapasta/pokemon-go-xposed)
        1. Reboot
        1. Configure device for Proxy PAC address
            - Wifi
                1. Edit current wifi network
                1. Check `Advanced options`
                1. Change proxy to `Proxy Auto-Config`
                1. Set the `PAC URL` to `http://<SERVERIP>:<PORT>/proxy/pac`
            - Other
                1. Supposedly you can modify APN settings, or use `ProxyDroid`, I've not tried it yet
        1. If needed, the CA cert file can be downloaded on the device at `http://<SERVERIP>:<PORT>/proxy/ca.(pem|crt|der|etc)`
            - This [guide](http://wiki.pcprobleemloos.nl/android/cacert) walks through adding the `ca.pem` file as a system cred to remove needing a lockscreen pin
            - I also lazily use [Root Certificate Manager(ROOT)](https://play.google.com/store/apps/details?id=net.jolivier.cert.Importer)
## Developers Notes
I know my free time to work on this will vary so I welcome most pull requests.
Currently this runs off of a memory/file based DB, but can easily be configured and connected to MongoDB, MariaDB, or anything else supported by [Loopback](http://loopback.io).
- Application
    - `app.js` <-- Core application file, mostly just contains middleware and routes mappings
    - `/config` <-- All necessary config files(Except for some DB specific stuff at the moment)
    - `/assets/<platform>` <-- Asset directories
    - `/middleware` <-- Custom middleware functions used on all `/plfe/*` routes
    - `/requests` <-- The functions executed for each request action in an RPC call
    - `/platform_requests` <-- Some more functions in RPC calls, usually device signature and IAP stuff
    - `/routes` <-- The various routes endpoints
    - `/ssl` <-- Configured as MITM's default cert path
    - `/views` <-- PUG-based templates path
    - `/views/captcha` <-- Templates meant to specifically be displayed in the Captcha display on the phone
- Database/ORM
    - `/db/common/models` <-- Database model objects
    - `/db/server/datasources.json` <-- Literal DB configurations
    - `/db/server/model-config.json` <-- DB Model-to-storage mappings
    
## Credits/Thanks
- @[rastapasta](https://github.com/rastapasta) for 
        - [Pokemon Go Xposed](https://github.com/rastapasta/pokemon-go-xposed)
        - [pokemon-go-mitm](https://github.com/rastapasta/pokemon-go-mitm)(Used to understand MITM module)
        - [pokemon-go-protobuf-node](https://github.com/rastapasta/pokemon-go-protobuf-node)(Got tired of ProtobufJS)
- @[maierfelix](https://github.com/maierfelix) for [POGOserver](https://github.com/maierfelix/POGOserver)(Reminded me I should share my experiments with others)
- @[AeonLucid](https://github.com/AeonLucid) for [POGOProtos](https://github.com/AeonLucid/POGOProtos)
## Disclaimer
©2016 Niantic, Inc. ©2016 Pokémon. ©1995–2016 Nintendo / Creatures Inc. / GAME FREAK inc. © 2016 Pokémon/Nintendo Pokémon and Pokémon character names are trademarks of Nintendo. The Google Maps Pin is a trademark of Google Inc. and the trade dress in the product design is a trademark of Google Inc. under license to The Pokémon Company. Other trademarks are the property of their respective owners.
[Privacy Policy](http://www.pokemon.com/us/privacy-policy/)

`pogo-emulator` is meant for an academic understanding of building and scaling a mobile multiplayer game from the server-side perspective and see what the game could have become.
