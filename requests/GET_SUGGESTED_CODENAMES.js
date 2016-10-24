//TODO: Sync to DB
module.exports = function (requestData, req) {
    return new Promise(function (resolve) {
        resolve({
            codenames: ['one','two'],
            success: true
        });
    });
};