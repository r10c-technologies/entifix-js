// SESSION PROVIDER ******************************************************************************************
// ============================================================================================================
// ============================================================================================================ 
// ============================================================================================================
(function(){
    'use strict';

    var module = angular.module('entifix-js');

    module.provider("EntifixSession", [function () {
        
        var prov = this;

        // SERVICE INSTANCE __________________________________________________________________________________________________________________________________________________________________________
        // ===========================================================================================================================================================================================
        // ===========================================================================================================================================================================================
        prov.$get = ['EntifixConfig', '$state', '$injector', 'jwtHelper', 'md5', '$window', function (EntifixConfig, $state, $injector, jwtHelper, md5, $window) {

            var sv = {};

            //Properties and Fields___________________________________________________________________________________________________________________________
            //================================================================================================================================================
            
            //Fields
            var _inLoginProcess = false;
            var _currentUser = null;
            var _currentUserName = null;
            var _currentUser = null;
            var _currentSystemOwner = null;
            var _currentPermissions = null;
            var _isRefreshingToken = false;

            //Properties
            sv.isInLoginProcess =
            {
                get: () => { return _inLoginProcess; }
            };

            sv.isRefreshingToken =
            {
                get: () => { return _isRefreshingToken; },
                set: (value) => { _isRefreshingToken = value; }
            }

            sv.redirect =
            {
                get: () => { return localStorage.getItem(EntifixConfig.redirectName); },
                set: (value) => { localStorage.setItem(EntifixConfig.redirectName.get(), value); },
                remove: () => { localStorage.removeItem(EntifixConfig.redirectName.get()); }
            }

            sv.authApp =
            {
                get: () => { return localStorage.getItem(EntifixConfig.authAppName); },
                set: (value) => { localStorage.setItem(EntifixConfig.authAppName.get(), value); },
                remove: () => { localStorage.removeItem(EntifixConfig.authAppName.get()); }
            }

            sv.authToken =
            {
                get: () => { return localStorage.getItem(EntifixConfig.authTokenName.get()); },
                set: (value) => { localStorage.setItem(EntifixConfig.authTokenName.get(), value); },
                remove: () => { localStorage.removeItem(EntifixConfig.authTokenName.get()); }
            }

            sv.refreshTokenLS =
            {
                get: () => { return localStorage.getItem(EntifixConfig.refreshTokenName.get()); },
                set: (value) => { localStorage.setItem(EntifixConfig.refreshTokenName.get(), value); },
                remove: () => { localStorage.removeItem(EntifixConfig.refreshTokenName.get()); }
            }

            sv.permissionsToken =
            {
                get: () => { return localStorage.getItem(EntifixConfig.permissionsTokenName.get()); },
                set: (value) => { localStorage.setItem(EntifixConfig.permissionsTokenName.get(), value); },
                remove: () => { localStorage.removeItem(EntifixConfig.permissionsTokenName.get()); }
            }

            sv.currentUser =
            {
                get: () =>
                {
                    if (_currentUser == null)
                    {
                        var tmptoken = sv.authToken.get();
                        if (tmptoken)
                            _currentUser = jwtHelper.decodeToken(tmptoken).name;
                    }
                    return _currentUser;
                }        
            };

            sv.currentUserName =
            {
                get: () =>
                {
                    if (_currentUserName == null)
                    {
                        var tmptoken = sv.authToken.get();
                        if (tmptoken)
                            _currentUserName = jwtHelper.decodeToken(tmptoken).userName;
                    }
                    return _currentUserName;
                }        
            };

            sv.currentSystemOwner =
            {
                get: () =>
                {
                    var tmptoken = sv.authToken.get();
                    if (tmptoken)
                        _currentSystemOwner = jwtHelper.decodeToken(tmptoken).systemOwner;
                    return _currentSystemOwner;
                }        
            };

            sv.currentPermissions = 
            {
                get: () =>
                {
                    if (_currentPermissions == null)
                    {
                        var tmptoken = sv.permissionsToken.get();
                        if (tmptoken)
                            _currentPermissions = jwtHelper.decodeToken(tmptoken).permissions;
                    }
                    return _currentPermissions;
                }
            }
             
            //================================================================================================================================================

            //Methods_________________________________________________________________________________________________________________________________________
            //================================================================================================================================================
            
            // Public section _____________________________________________________________________

            sv.TryLogIn = function(user, password, actionAccept, actionReject, actionError)
            {
                _inLoginProcess = true;

                //Resouce to login
                var hashPass = md5.createHash(password);

                var $http = $injector.get('$http');
                $http({
                            method: 'POST',
                            url: EntifixConfig.authUrl.get(),
                            data: { user: user, password: hashPass }
                        }).then(    (response) => 
                                    {                                
                                        if (!response.data.isLogicError)
                                        {
                                            if (EntifixConfig.devMode.get())
                                                console.info('DevMode: Login success');

                                            //Save token from response
                                            sv.saveTokens(response.data.data[EntifixConfig.authTokenName.get()], response.data.data[EntifixConfig.refreshTokenName.get()])
                                            
                                            if (actionAccept)
                                                actionAccept();

                                            _inLoginProcess = false;

                                            if (!EntifixConfig.devMode.get())
                                                manageAuthRedirectAction();
                                        }
                                        else
                                        {
                                            if (EntifixConfig.devMode.get())
                                                console.info('DevMode: Login reject with message - ' + response.data.message);

                                            if (actionReject)
                                                actionReject(response.data.message);
                                            
                                            _inLoginProcess = false;
                                        }                                    
                                    },
                                    (error) => 
                                    {
                                        if (EntifixConfig.devMode.get())
                                                console.warn('DevMode: Login error');

                                        if (actionError)
                                            actionError(error);
                                        
                                        _inLoginProcess = false;
                                    });
            };

            sv.refreshToken = function(actionAccept, actionReject, actionError)
            {
                if (sv.refreshTokenLS.get() && !jwtHelper.isTokenExpired(sv.refreshTokenLS.get()) && !sv.isRefreshingToken.get()) {
                    _inLoginProcess = true;
                    sv.isRefreshingToken.set(true);
                    var $http = $injector.get('$http');
                    $http({
                                method: 'POST',
                                url: EntifixConfig.refreshUrl.get(),
                                data: { [EntifixConfig.refreshTokenName.get()]: sv.refreshTokenLS.get() }
                            }).then(    (response) => 
                                        {

                                            if (!response.data.isLogicError)
                                            {
                                                if (EntifixConfig.devMode.get())
                                                    console.info('DevMode: Refresh success');

                                                //Save token from response
                                                sv.saveTokens(response.data.data[EntifixConfig.authTokenName.get()], response.data.data[EntifixConfig.refreshTokenName.get()])
                                                
                                                if (actionAccept)
                                                    actionAccept(response.data);
                                            }
                                            else
                                            {
                                                if (actionReject)
                                                    actionReject(response.data.message);
                                                
                                                if (EntifixConfig.devMode.get()) {
                                                    console.info('DevMode: Refresh token reject with message - ' + response.data.message);
                                                    sv.tryLoginAsDeveloper();
                                                }
                                                else
                                                    manageRedirectAction();
                                            }
                                            
                                            _inLoginProcess = false;
                                            sv.isRefreshingToken.set(false);
                                        },
                                        (error) => 
                                        {
                                            _inLoginProcess = false;
                                            sv.isRefreshingToken.set(false);

                                            if (actionError)
                                                actionError(error);
                                            
                                            if (EntifixConfig.devMode.get()) {
                                                console.warn('DevMode: Refresh token error');
                                                sv.tryLoginAsDeveloper();
                                            }
                                            else
                                                manageRedirectAction();
                                        });
                    } else {
                        if (EntifixConfig.devMode.get()) {
                            console.warn('DevMode: There is no refresh token');
                            sv.tryLoginAsDeveloper()
                                .then(
                                    () => { console.info('Login successfully'); })
                                .catch(
                                    (error) => { console.error('Error when trying login as developer ' + error); });                            
                        }
                        else
                            manageRedirectAction();
                    }
            };

            sv.checkPermissions = function(permission)
            {
                if (permission instanceof String) {
                    if (sv.currentPermissions.get().filter(e => e == permission).length > 0)
                        return true;
                    return false;
                } else if (permission instanceof Array) {
                    return permission.filter(p => sv.currentPermissions.get().filter(e => e == p).length > 0).length > 0; 
                }
            };

            sv.checkNavigation = function(transition)
            {
                checkAuthentication(transition);
                checkStatePermissions(transition);
            };

            sv.tryLoginAsDeveloper = function()
            {
                return new Promise( (resolve, reject)=> 
                {
                    if (!EntifixConfig.devMode.get())
                    {
                        console.error('Developer login tried in without DevMode');
                        reject();
                    }

                    if (!EntifixConfig.devUser.get())
                    {
                        console.warn('DevMode: No developer user configuration');
                        reject();
                    }

                    sv.TryLogIn(EntifixConfig.devUser.get().user, EntifixConfig.devUser.get().password, resolve, null, reject);
                });                
            };

            sv.loadPermissions = function()
            {
                var $http = $injector.get('$http');
                $http({ method: 'GET', url: EntifixConfig.permissionsUrl.get() }).then(
                    response => {
                        sv.permissionsToken.set(response.data.data[EntifixConfig.permissionsTokenName.get()]);
                    },
                    error => {
                        var $mdToast = $injector.get('$mdToast');
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Error when trying to load permissions...')
                                    .position('bottom right')
                                        .hideDelay(3000)
                        );
                    } 
                );
            }

            sv.saveTokens = function(token, refreshToken)
            {
                sv.authToken.set(token);
                sv.refreshTokenLS.set(refreshToken);
            }

            sv.logout = function()
            {
                sv.authToken.remove();
                sv.refreshTokenLS.remove();
                sv.permissionsToken.remove();
                sv.redirect.set(EntifixConfig.thisApplication.get());
                sv.authApp.set(EntifixConfig.authUrl.get());
                $window.location.href = EntifixConfig.authApplication.get();
            }

            // Private section _____________________________________________________________________
            function manageAuthRedirectAction()
            {
                var redirectTo = sv.redirect.get();
                if (redirectTo != null)
                {
                    sv.redirect.remove();
                    sv.authApp.remove();
                    $window.location.href = redirectTo;
                }
                else if (EntifixConfig.thisApplication.get())
                    $window.location.href = EntifixConfig.thisApplication.get();
            };

            function manageRedirectAction()
            {
                sv.logout();
            }

            function checkAuthentication(transition)
            {
                var e = transition.$from();
                var toState = transition.$to();
                var authSkipped = toState.skipAuthorization || false;
                var authenticated = sv.authToken.get() != null && !jwtHelper.isTokenExpired(sv.refreshTokenLS.get());
                var requiresLogin = toState.data && (toState.data.requiresLogin || toState.data.requiresLoginDev ) && !authSkipped;

                if (requiresLogin && !authenticated)
                {
                    if (EntifixConfig.devMode.get())
                    {                        
                        console.info('DevMode: No active session');
                        if (EntifixConfig.authApplication.get())   
                            console.warn('DevMode: Redirect to ' + EntifixConfig.authApplication.get());
                        else
                            console.warn('DevMode: No auth application registered');
                    }
                    else {
                        transition.abort();
                        manageRedirectAction();
                    }
                }
            };

            function checkStatePermissions(transition)
            {
                var e = transition.$from();
                var toState = transition.$to();
                if (toState.data && toState.data.securityContext)
                {
                    if (!sv.checkPermissions(toState.data.securityContext))
                    {
                        var m = 'There is no unauthorized state defined';

                        if (!EntifixConfig.devMode.get())
                        {
                            if (EntifixConfig.unauthorizedStateName.get())
                            {
                                console.warn('Permission required: ' + toState.data.securityContext +' - Redirect to no authorization state: ' + EntifixConfig.unauthorizedStateName.get());
                                transition.abort();
                                $state.go(EntifixConfig.unauthorizedStateName.get());                            
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
        template: '<div layout="column" layout-align="center center"> \
                        <div> \
                            <img ng-src="{{vm.imgError}}"/> \
                        </div> \
                        <div class="text-danger"> \
                            <h1>&nbsp; {{vm.header}}</h1> \
                        </div> \
                        <div> \
                            <h2>{{vm.infoError}}</h2> \
                        </div> \
                        <div> \
                            <h3>{{vm.infoUser}}</h3> \
                        </div> \
                        <div> \
                            <p>{{vm.footer}}</p> \
                        </div> \
                    </div> \
                    ',
        controller: componentController,
        controllerAs: 'vm',
        bindings:
        {
            infoError: '@',
            header: '@',
            infoUser: '@',
            footer: '@',
            imgError: '@'
        }
    };

    componentController.$inject = ['EntifixSession'];
    function componentController(EntifixSession)
    {
        var vm = this;

        vm.$onInit = function()
        {
            vm.nameCurrentUser = EntifixSession.currentUser.get();
            vm.currentUserName = EntifixSession.currentUserName.get();
            vm.header = vm.header ? vm.header : 'Acceso Restringido';
            vm.infoError = vm.infoError ? vm.infoError : 'El usuario actual no tiene permisos para ver el recurso solicitado';
            vm.infoUser = vm.infoUser ? vm.infoUser : "Usuario: " + vm.nameCurrentUser + " - " + vm.currentUserName;
            vm.footer = vm.footer ? vm.footer : "Si necesita el acceso, por favor comuníquese con el administrador del sistema.";
            vm.imgError = vm.imgError ? vm.imgError : "./app/img/error.png";
        };
    };

    angular
        .module('entifix-js')
        .component('entifixNoAuthorized', component);
})();