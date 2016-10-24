var defaults = {
    jwt: {
        secret: 'pokemongo'
    },
    web: {
        port: 3000
    },
    proxy: {
        port: 3001,
        forceSNI: process.env.PROXY_SNI || true,
        sslCaDir: process.cwd() + '/ssl',
        debug: (typeof process.env.PROXY_DEBUG === "boolean") ? process.env.PROXY_DEBUG : false,
        silent: (typeof process.env.PROXY_SILENT === "boolean") ? process.env.PROXY_SILENT : true,
    },
    ip: ''
};

module.exports = defaults;