/**
 * Created by Victor on 1/21/2017.
 */
const ApiBuilder = require('claudia-api-builder');

let logError = function (err) {
    console.error(err);
};

module.exports = function botBuilder(messageHandler, options, optionalLogError) {
    logError = optionalLogError || logError;

    const api = new ApiBuilder(),
        messageHandlerPromise = function (message, originalApiBuilderRequest) {
            return Promise.resolve(message).then(message => messageHandler(message, originalApiBuilderRequest));
        };

    api.get('/', () => 'Ok');


    return api;
};
