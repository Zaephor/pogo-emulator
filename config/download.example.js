var defaults = {
    provider: '', // google/ptc
    username: '', // google email or ptc username
    password: '',
    version: 3500, // Version assets and digest to download
    delay: 1000 // How long to pause between asset downloads, I'd been rate-limited before
};

module.exports = defaults;