// ENTIFIX GLOBAL CONFIGURATION *******************************************************************************
// ============================================================================================================

(function(){
    'use strict';

    var module = angular.module('entifix-js');

    module.provider("EntifixConfig", [function () {
        
        var prov = this;
        var $authUrl, $refreshUrl,
        $unauthorizedStateName,
        $authTokenName,
        $refreshTokenName,
        $redirectName,
        $authAppName,
        $thisApplication, 
        $authApplication,
        $devMode = false,
        $devUser;
    
        prov.setAuthUrl = function(value) {
            $authUrl = value;
        };

        prov.setRefreshUrl = function(value) {
            $refreshUrl = value;
        };

        prov.setUnauthorizedStateName = function(value) {
            $unauthorizedStateName = value;
        };

        prov.setAuthTokenName = function(value) {
             $authTokenName = value;
        };

        prov.setRefreshTokenName = function(value) {
             $refreshTokenName = value;
        };

        prov.setRedirectName = function(value) {
             $redirectName = value;
        };

        prov.setAuthName = function(value) {
             $authAppName = value;
        };

        prov.setThisApplication = function(value) {
             $thisApplication = value;
        };

        prov.setAuthApplication = function(value) {
             $authApplication = value;
        };

        prov.setDevMode = function(value) {
            $devMode = value;
        };
        
        prov.setDevUser = function(value){
            $devUser = value;
        };

        // SERVICE INSTANCE __________________________________________________________________________________________________________________________________
        // ===================================================================================================================================================
        prov.$get = [function () {

            var sv = {}

            //Properties and Fields___________________________________________________________________________________________________________________________
            //================================================================================================================================================
            
            //Fields

            sv.redirectName = 
            {
                get: () => { return $redirectName; }
            }

            sv.authAppName = 
            {
                get: () => { return $authAppName; }
            }

            sv.thisApplication = 
            {
                get: () => { return $thisApplication; }
            }

            sv.authApplication = 
            {
                get: () => { return $authApplication; }
            }

            sv.authUrl = 
            {
                get: () => { return $authUrl; }
            }

            sv.refreshUrl = 
            {
                get: () => { return $refreshUrl; }
            }

            sv.devMode = 
            {
                get: () => { return $devMode; }
            }

            sv.authTokenName =
            {
                get: () => { return $authTokenName; }
            }

            sv.refreshTokenName =
            {
                get: () => { return $refreshTokenName; }
            }  

            sv.devUser =
            {
                get: () => { return $devUser; }
            }  

            sv.unauthorizedStateName =
            {
                get: () => { return $unauthorizedStateName; }
            }            

            return sv;
        }];
    }]);

})();