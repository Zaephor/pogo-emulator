//TODO: Sync to DB
module.exports = function (requestData, req) {
    return new Promise(function (resolve) {
        resolve({
            success: false,
            family_candy_id: null,
            candy_earned_count: null
        });
    });
};