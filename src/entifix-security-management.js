// SESSION PROVIDER ******************************************************************************************
// ============================================================================================================
// ============================================================================================================ 
// ============================================================================================================
(function(){
    'use strict';

    var module = angular.module('entifix-js');

    module.provider("message", [function () {
        var text = null;

        this.setText = function (textString) {
            text = textString;
        };

        this.$get = [function () {
            return new Message(text);
        }];
    }]);

    module.provider("EntifixSession", [function () {
        
        var prov = this;

        var $authUrl, 
        $unauthorizedStateName, 
        $authTokenName,
        $redirectName,
        $authAppName,
        $thisApplication, 
        $authApplication,
        $devMode = false,
        $devUser;

        prov.setAuthUrl = function(value) {
            $authUrl = value;
        };

        prov.setUnauthorizedStateName = function(value) {
            $unauthorizedStateName = value;
        };

        prov.setAuthTokenName = function(value) {
             $authTokenName = value;
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

        // SERVICE INSTANCE ___________________________________________________________________________________________________________________________________________________________________________________________________________
        // ============================================================================================================================================================================================================================
        // ============================================================================================================================================================================================================================
        //$inject = ['$state', '$http', 'AppResources', 'jwtHelper', 'md5', '$window', 'AppRedirects'];
        prov.$get = [ '$state', '$http', 'jwtHelper', 'md5', '$window', function ($state, $http, jwtHelper, md5, $window) {

            var sv = {}

            //Properties and Fields___________________________________________________________________________________________________________________________
            //================================================================================================================================================
            
            //Fields
            var _inLoginProcess = false;
            var _currentUser = null;
            var _currentWorkGroup = null;

            //Properties
            sv.isInLoginProcess =
            {
                get: () => { return _inLoginProcess; }
            };

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

            sv.devMode = 
            {
                get: () => { return $devMode; }
            }

            sv.authTokenName =
            {
                get: () => { return $authTokenName; }
            }

            sv.redirect =
            {
                set: (value) => { localStorage.setItem($redirectName, value); }
            }

            sv.authApp =
            {
                set: (value) => { localStorage.setItem($authAppName, value); }
            }

            sv.authToken =
            {
                set: (value) => { localStorage.setItem($authTokenName, value); },
                remove: (value) => { localStorage.removeItem($authTokenName); }
            } 

            sv.currentUser =
            {
                get: () =>
                {
                    if (_currentUser == null);
                    {
                        var tmptoken = localStorage.getItem($authTokenName);
                        if (tmptoken)
                        {
                            var sub = jwtHelper.decodeToken(tmptoken).sub;
                            _currentUser = JSON.parse(sub);     
                        }                        
                    }
                    return _currentUser;
                }        
            };

            sv.currentWorkgroup =
            {
                get: () =>
                {
                    if (_currentWorkGroup == null);
                    {
                        var tmptoken = localStorage.getItem($authTokenName);
                        var workgroup = jwtHelper.decodeToken(tmptoken).workgroup;
                        if (tmptoken && workgroup)
                            _currentWorkGroup = JSON.parse(workgroup);     
                    }
                    return _currentWorkGroup;
                }        
            };
             
            //================================================================================================================================================

            //Methods_________________________________________________________________________________________________________________________________________
            //================================================================================================================================================
            
            // Public section _____________________________________________________________________

            sv.TryLogIn = function(user, password, idSistema,  actionAccept, actionReject, actionError)
            {
                _inLoginProcess = true;

                //Resouce to login
                var hashPass = md5.createHash(password);

                $http({
                            method: 'POST',
                            url: $authUrl,
                            data: { user: user, password: hashPass, idSistema: idSistema }
                        }).then(    (response) => 
                                    {                                
                                        if (!response.data.isLogicError)
                                        {
                                            if ($devMode)
                                                console.info('DevMode: Login success');

                                            //Save token from response
                                            localStorage.setItem($authTokenName, response.data.data[0].authToken);
                                            
                                            if (actionAccept)
                                                actionAccept();

                                            _inLoginProcess = false;

                                            if (!$devMode)
                                                manageAuthRedirectAction();
                                        }
                                        else
                                        {
                                            if ($devMode)
                                                console.info('DevMode: Login reject with message - ' + response.data.message);

                                            if (actionReject)
                                                actionReject(response.data.message);
                                            
                                            _inLoginProcess = false;
                                        }                                    
                                    },
                                    (error) => 
                                    {
                                        if ($devMode)
                                                console.warn('DevMode: Login error');

                                        if (actionError)
                                            actionError(error);
                                        
                                        _inLoginProcess = false;
                                    });
            };        

            sv.checkNavigation = function(e, to)
            {
                checkAuthentication(e, to);
                checkStatePermissions(e, to);
            };

            sv.tryLoginAsDeveloper = function()
            {
                return new Promise( (resolve, reject)=> 
                {
                    if (!$devMode)
                    {
                        console.error('DEVELOPER LOGIN TRIED IN NO DEV-MODE');
                        reject();
                    }

                    if (!$devUser)
                    {
                        console.warn('DevMode: No developer user configuration');
                        reject();
                    }

                    sv.TryLogIn( $devUser.user, $devUser.password, $devUser.idSistema, resolve, null, reject);
                });                
            };

            // Private section _____________________________________________________________________
            function manageAuthRedirectAction()
            {
                var redirectTo = localStorage.getItem($redirectName);
                if (redirectTo != null)
                {
                    localStorage.removeItem($redirectName);
                    localStorage.removeItem($authAppName);
                    $window.location.href = redirectTo;
                }
                else if ($thisApplication)
                    $window.location.href = $thisApplication;
            };

            function checkAuthentication(e, toState)
            {
                var authSkipped = toState.skipAuthorization || false;
                var authenticated = localStorage.getItem($authTokenName) != null;
                var requiresLogin = toState.data && (toState.data.requiresLogin || toState.data.requiresLoginDev ) && !authSkipped;

                if (requiresLogin && !authenticated)
                {
                    if ($devMode)
                    {                        
                        console.info('DevMode: No active session');
                        if ($authApplication)   
                            console.warn('DevMode: Redirect to ' + $authApplication);
                        else
                            console.warn('DevMode: No auth application registered');
                    }
                    else
                    {
                        e.preventDefault();
                        localStorage.setItem( $redirectName, $thisApplication );
                        localStorage.setItem( $authAppName, $authUrl);
                        $window.location.href = $authApplication;
                    }
                }
            };

            function checkStatePermissions(e, toState)
            {
                if (toState.data && toState.data.securityContext)
                {
                    if (!sv.checkPermissions(toState.data.securityContext))
                    {
                        var m = 'There is no unauthorized state defined';

                        if (!$devMode)
                        {
                            if ($unauthorizedStateName)
                            {
                                console.warn('Permission required: ' + toState.data.securityContext +' - Redirect to no authorization state: ' + $unauthorizedStateName);
                                e.preventDefault();
                                $state.go($unauthorizedStateName);                            
                            }                            
                            else
                                console.error(m);
                        }
                        else 
                        {
                            console.info('DevMode: Not allowed acces to this state => ' + toState.name);
                            console.warn(m);    
                        }
                                               
                    }                        
                }
                else
                    return true;
            };

            //================================================================================================================================================


            return sv;
        }];
        // ============================================================================================================================================================================================================================
        // ============================================================================================================================================================================================================================

    }]);

})();


// NO AUTHORIZED COMPONENT ************************************************************************************
// ============================================================================================================
// ============================================================================================================ 
// ============================================================================================================
(function(){
    'use strict';
    
    var component =
    {
        template: '<br/><br/><br/> \
                    <div class="row"> \
                        <div class="col-lg-1 hidden-md"></div> \
                        <div class="col-xs-12 col-md-6 col-lg-5"> \
                            <div class="row hidden-xs hidden-sm"> \
                                <br/><br/><br/><br/><br/><br/> \
                            </div> \
                            <div class="row text-danger text-center"> \
                                <h1> \
                                    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp Acceso Restringido \
                                </h1> \
                            </div> \
                            <br/> \
                            <div class="row text-center"> \
                                <h3>El usuario actual no tiene permisos para ver el recurso solicitado</h3> \
                                <br/> \
                                <div class="well well-sm"><h3>{{\'Usuario: \' + vm.nameCurrentUser}}</h3></div> \
                            </div> \
                            <br/><br/> \
                            <div class="row text-mutted text-center"> \
                                <p>Si necesita el acceso, por favor comuníquese con el administrador del sistema</p> \
                            </div> \
                        </div> \
                        <div class="col-xs-12 col-md-6 col-lg-5"> \
                            <img src="./img/security.png" alt="Image" class="img-responsive center-block" /> \
                        </div> \
                        <div class="col-lg-1 hidden-md"></div> \
                    </div> \
                    <br/><br/><br/> \
                    ',
        controller: componentController,
        controllerAs: 'vm'
    };

    componentController.$inject = ['EntifixSession'];
    function componentController(EntifixSession)
    {
        var vm = this;

        vm.$onInit = function()
        {
            var currentUser = EntifixSession.currentUser.get();
            if (currentUser)
                vm.nameCurrentUser = currentUser.usuario;
        };
    };

    angular
        .module('entifix-js')
        .component('entifixNoAuthorized', component);
})();