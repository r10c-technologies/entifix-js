(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixTokenInterceptor', factory);

    factory.$inject = ['$q', '$timeout', 'EntifixSession', 'jwtHelper', 'EntifixConfig'];

    function factory ($q, $timeout, EntifixSession, jwtHelper, EntifixConfig)
    {
        var request = function request(config)
        {
            if (config && config.url.substr(config.url.length - 5) == '.html' || (config.url && (config.url == EntifixConfig.authUrl.get() || config.url == EntifixConfig.refreshUrl.get())))
                return config;
            return evaluateToken(config);
        };

        function evaluateToken(config) {
            var token = EntifixSession.authToken.get();
            if (token) {
                if (jwtHelper.isTokenExpired(token) && !EntifixSession.isRefreshingToken.get()) {
                    EntifixSession.refreshToken();
                }
                if (!EntifixSession.isRefreshingToken.get()) {
                    return config;
                } else {
                    var deferred = $q.defer();
                    evaluateRequestToSend(deferred, config);
                    return deferred.promise;
                }   
            } else {
                return config;
            }
        }

        function evaluateRequestToSend(deferred, config) {
            if (!EntifixSession.isRefreshingToken.get()) {
                setLastAutorizationHeader(config);
                deferred.resolve(config);
            }
            else {
                $timeout(evaluateRequestToSend, 1000, true, deferred, config);
            }
        }
        
        function setLastAutorizationHeader(config) {
            config.headers.Authorization = 'Bearer ' + EntifixSession.authToken.get();
        }

        return {
            request: request
        };
    };

})();