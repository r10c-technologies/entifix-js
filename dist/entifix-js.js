'use strict';

(function () {
    'use strict';

    //Module creation

    var entifix = angular.module('entifix-js', ['app.config', 'angular-jwt', 'angular-md5', 'entifix-security-management']);

    //Init components    
    entifix.directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            }, function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            });
        };
    }]);

    entifix.service('BaseComponentFunctions', service);
    service.$inject = [];
    function service() {
        var sv = this;

        //Properties

        //Methods
        sv.CreateStringHtmlComponent = function (componentConstruction) {
            var stringbindings = '';
            if (componentConstruction.bindings) if (componentConstruction.bindings.length > 0) for (var i = 0; i < componentConstruction.bindings.length; i++) {
                stringbindings += componentConstruction.bindings[i].name + '=' + '"' + componentConstruction.bindings[i].value + '"';
            }var stringhtml = '<' + componentConstruction.name;

            if (stringbindings.length > 0) stringhtml += ' ' + stringbindings;

            stringhtml += '></' + componentConstruction.name + '>';

            return stringhtml;
        };

        sv.CreateStringHtmlComponentAndBindings = function (componentConstruction, bindingConnectionPath) {
            var stringbindings = '';
            var objectbindings = {};
            if (componentConstruction.bindings) {
                if (componentConstruction.bindings.length > 0) {
                    for (var i = 0; i < componentConstruction.bindings.length; i++) {
                        var binding = componentConstruction.bindings[i];
                        var tempstring = binding.name + '=';

                        var isCorrect = false;

                        //String binding
                        if (typeof binding.value == 'string') {
                            tempstring += '"' + binding.value;
                            isCorrect = true;
                        };

                        //Object and Method binding
                        if (!isCorrect && bindingConnectionPath && binding.value != null) {
                            tempstring += '"' + bindingConnectionPath + '.' + binding.name;
                            objectbindings[binding.name] = binding.value;
                            isCorrect = true;
                        };

                        if (isCorrect) stringbindings += ' ' + tempstring + (binding.isExecutable ? '()"' : '"');
                    }
                }
            }

            var stringhtml = '<' + componentConstruction.name;

            if (stringbindings.length > 0) stringhtml += stringbindings;

            stringhtml += '></' + componentConstruction.name + '>';

            var result = {
                stringhtml: stringhtml,
                objectbindings: objectbindings
            };

            return result;
        };

        return sv;
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive('entifixElasticTextArea', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function link($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function resize() {
                    if ($scope.initialHeight != '') {
                        element[0].style.height = $scope.initialHeight;
                        $scope.initialHeight = '';
                    } else element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive("entifixFileread", [function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files[0];
                    ngModel.$setViewValue(files);
                });
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive('entifixNextFocus', function () {
        return {
            restrict: 'A',
            link: function link($scope, elem, attrs) {

                elem.bind('keydown', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 39 || code === 9) {
                        var focusNext;
                        var len;
                        e.preventDefault();
                        var pageElems = document.querySelectorAll(attrs.nextFocus),
                            elem = e.target;
                        focusNext = false, len = pageElems.length;
                        for (var i = 0; i < len; i++) {
                            var pe = pageElems[i];
                            if (focusNext) {
                                if (pe.style.display !== 'none') {
                                    pe.focus();
                                    break;
                                }
                            } else if (pe === e.target) {
                                focusNext = true;
                            }
                        }
                    }
                    if (code === 37) {
                        var focusPrevious;
                        var len;
                        e.preventDefault();
                        var pageElems = document.querySelectorAll(attrs.nextFocus),
                            elem = e.target;
                        focusPrevious = false, len = pageElems.length;
                        for (var i = len - 1; i >= 0; i--) {
                            var pe = pageElems[i];
                            if (focusPrevious) {
                                if (pe.style.display !== 'none') {
                                    pe.focus();
                                    break;
                                }
                            } else if (pe === e.target) {
                                focusPrevious = true;
                            }
                        }
                    }
                });
            }
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive('entifixNumberBlock', function () {
        return {
            restrict: 'A',
            link: function link($scope, elem, attrs) {
                if (attrs.numberValidation == "true") {
                    elem.bind('keydown', function (e) {
                        var code = e.keyCode || e.which;
                        if (!(code === 8 || // backspace
                        code === 46 || // delete
                        code === 110 || code === 190 || // decimal point
                        code === 9 || // tab
                        code === 37 || // left arrow
                        code === 39 || // right arrow
                        code >= 48 && code <= 57 || code >= 96 && code <= 105)) {
                            // numbers
                            e.preventDefault();
                        }
                    });
                }
            }
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive('entifixNumberValidation', function () {
        return {
            require: 'ngModel',
            link: function link(scope, element, attrs, ctrl) {
                if (attrs.numberValidation == "true") {
                    ctrl.$parsers.push(function (value) {
                        if (ctrl.$isEmpty(value)) {
                            ctrl.$setValidity('number', true);
                            return null;
                        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                            ctrl.$setValidity('number', true);
                            return value;
                        } else ctrl.$setValidity('number', false);
                    });
                }
            }
        };
    });
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').directive("entifixSecurityContext", ['EntifixSession', '$compile', function (EntifixSession, $compile) {
        return {
            restrict: 'A',
            priority: 1001,
            terminal: true,
            scope: {
                perm: "&permission"
            },
            compile: function compile(element, attributes) {
                var permission = attributes.entifixSecurityContext;

                element.removeAttr('entifix-security-context');

                if (EntifixSession.checkPermissions(permission)) element.attr('ng-if', true);else element.attr('ng-if', false);

                var fn = $compile(element);
                return function (scope) {
                    fn(scope);
                };
            }
        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').factory('EntifixCollectionFormatter', factory);

    factory.$inject = [];

    function factory() {
        return function () {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields
            var _transformValues = [];

            // Properties

            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            function activate() {};

            function getFilters(collection, singleParam) {
                var filters = [{ property: 'operator', value: 'or' }];
                collection.forEach(function (element) {
                    filters.push({ property: singleParam.resource.getKeyProperty.get(), value: element[singleParam.property] });
                });
                return filters;
            }

            function processProperty(collection, singleParam, onEnd) {
                if (singleParam.type == 'navigation') {
                    if (!(_transformValues && _transformValues.length > 0 && _transformValues.filter(function (tv) {
                        return tv.property == singleParam.property;
                    }).length > 0)) {
                        var filters = getFilters(collection, singleParam);
                        singleParam.resource.getEnumerationBind(singleParam.display, function (enumeration) {
                            _transformValues.push({ property: singleParam.property, enumResult: enumeration });
                            transformValue(collection, singleParam, onEnd);
                        }, null, filters);
                    }
                    transformValue(collection, singleParam, onEnd);
                } else {
                    transformValue(collection, singleParam, onEnd);
                }
            };

            function transformValue(collection, singleParam, onEnd) {
                collection.forEach(function (element) {
                    var value = element[singleParam.property];

                    //Transform dates
                    if (singleParam.type == 'date' || singleParam.type == 'datetime') {
                        var asDate = new Date(value);
                        var year = asDate.getFullYear();
                        var month = (asDate.getMonth() + 1).toString();
                        var day = asDate.getDate().toString();

                        if (month.length < 2) month = '0' + month;
                        if (day.length < 2) day = '0' + day;

                        if (singleParam.type == 'datetime') {
                            var hours = asDate.getHours().toString();
                            var minutes = asDate.getMinutes().toString();
                            var seconds = asDate.getSeconds().toString();
                            if (hours.length < 2) hours = '0' + hours;
                            if (minutes.length < 2) minutes = '0' + minutes;
                            if (seconds.length < 2) seconds = '0' + seconds;
                            element[singleParam.outProperty || singleParam.property] = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
                        } else element[singleParam.outProperty || singleParam.property] = day + '/' + month + '/' + year;

                        onEnd();
                    }

                    //Transform navigation
                    if (singleParam.type == 'navigation') {
                        var transform = function transform() {
                            var tempCollectionConf = _transformValues.filter(function (tv) {
                                return tv.property == singleParam.property;
                            });
                            if (tempCollectionConf.length > 0) {
                                var tempCollectionValues = tempCollectionConf[0].enumResult;
                                if (tempCollectionValues && tempCollectionValues.length > 0) {
                                    var idValue = value;
                                    if (value instanceof Object) idValue = singleParam.resource.getId(value);

                                    var tempValues = tempCollectionValues.filter(function (enumValue) {
                                        return enumValue.Value == idValue;
                                    });
                                    if (tempValues.length > 0) element[singleParam.outProperty || singleParam.property] = tempValues[0].Display;

                                    onEnd();
                                }
                            }
                        };

                        if (_transformValues && _transformValues.length > 0 && _transformValues.filter(function (tv) {
                            return tv.property == singleParam.property && tv.enumResult.length;
                        }).length > 0) transform();
                    }

                    if (singleParam.type == 'bool') {
                        if (value) element[singleParam.outProperty || singleParam.property] = 'Si';else element[singleParam.outProperty || singleParam.property] = 'No';
                    }
                });
            }

            //parameters: Object
            // -> { collection, type, resource, property, display, outProperty }
            vm.transform = function (parameters) {
                return new Promise(function (resolve, reject) {
                    processProperty(parameters.collection, parameters, function () {
                        resolve();
                    });
                });
            };

            //parameters: Object
            // -> { collection, properties [ {type, resource, property, display, outProperty} ] }
            vm.transformMultiple = function (parameters) {
                _transformValues = [];
                return new Promise(function (resolve, reject) {
                    var transformed = 0;
                    var steps = 0;

                    parameters.properties.forEach(function (propertyParams) {
                        processProperty(parameters.collection, propertyParams, function () {
                            transformed++;
                            if (transformed >= parameters.collection.length) {
                                transformed = 0;
                                steps++;
                                if (steps >= parameters.properties.length) resolve();
                            }
                        });
                    });
                });
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').service('EntifixErrorManager', service);

    service.$inject = ['EntifixSession', '$window', 'AppRedirects', '$mdDialog', '$mdToast'];

    function service(EntifixSession, $window, AppRedirects, $mdDialog, $mdToast) {
        var vm = this;

        // Properties and Fields========================================================================================================================================================
        //==============================================================================================================================================================================


        //==============================================================================================================================================================================


        // Methods _____________________________________________________________________________________________________________________________________________________________________
        //==============================================================================================================================================================================

        // ERROR 401
        vm.unauthorizedError = function (error) {
            if (!EntifixSession.devMode.get()) {
                EntifixSession.redirect.set(EntifixSession.thisApplication.get());
                EntifixSession.authApp.set(EntifixSession.authUrl.get());
                $window.location.href = EntifixSession.authApplication.get();
            } else console.warn("DevMode: No auth application registered");
        };

        // ERROR 404
        vm.notFoundError = function (error) {
            $mdToast.show($mdToast.simple().textContent('¡Error 404! El recurso solicitado no fue encontrado.').position('bottom right').hideDelay(3000));
        };

        //ERROR 412 
        vm.preconditionFailedError = function (error) {
            $mdDialog.show({ template: '<md-dialog aria-label="Elija una Bodega para trabajar" class="md-md"> \
                                                <md-toolbar> \
                                                    <div class="md-toolbar-tools" md-colors="{color: \'default-primary-50\'}" layout> \
                                                        <div flex layout layout-align="start center"> \
                                                            <div class="md-icon-button"><md-icon class="material-icons">warning</md-icon></div> \
                                                            <h2>&nbsp Elija una Bodega para trabajar</h2> \
                                                        </div> \
                                                    </div> \
                                                </md-toolbar> \
                                                <div> \
                                                    <md-dialog-content> \
                                                        <md-content layout-padding> \
                                                            <div flex> \
                                                                <md-input-container class="entifix-select-width"> \
                                                                    <label>Bodega</label> \
                                                                    <md-select \
                                                                        ng-model="vm.workgroupName" \
                                                                        aria-label="Bodega"> \
                                                                        <md-option ng-repeat="item in vm.workgroups" ng-click="vm.setWorkgroupId(item)" ng-value="item.nombreBodega">{{item.nombreBodega}}</md-option> \
                                                                    </md-select> \
                                                                </md-input-container> \
                                                            </div> \
                                                        </md-content> \
                                                    </md-dialog-content> \
                                                    <md-dialog-actions layout="row"> \
                                                        <md-button md-colors="{background: \'default-primary-50\'}" ng-click="vm.cancel()"> \
                                                            <md-icon class="material-icons">clear</md-icon> Cancelar \
                                                        </md-button> \
                                                        <md-button md-colors="{background: \'default-primary-50\'}" ng-click="vm.ok()"> \
                                                            <md-icon class="material-icons">done</md-icon> Ok \
                                                        </md-button> \
                                                    </md-dialog-actions> \
                                                </div> \
                                            </md-dialog>',
                //templateUrl: 'dist/shared/components/entifixPreconditionFailedError/entifixPreconditionFailedError.html',
                controller: 'PreconditionFailedErrorController',
                parent: angular.element(document.body), clickOutsideToClose: false, escapeToClose: false, fullscreen: true,
                controllerAs: 'vm',
                locals: { sessionData: { subject: EntifixSession.currentUser.get(), authTokenName: EntifixSession.authTokenName.get(), currentWorkgroup: EntifixSession.currentWorkgroup.get() } }
            }).then(function () {}, function () {});
        };

        // ERROR 500
        vm.internalServerError = function (error) {
            $mdToast.show($mdToast.simple().textContent('¡Error 500! El recurso solicitado presenta un error en el servidor.').position('bottom right').hideDelay(3000));
        };

        //==============================================================================================================================================================================
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').service('EntifixMetadata', service);

    service.$inject = [];

    function service() {
        var vm = this;

        // Properties and Fields========================================================================================================================================================
        //==============================================================================================================================================================================

        vm.metadata = {
            get: function get() {
                return globalMetadata;
            }
        };

        //==============================================================================================================================================================================
        // Methods _____________________________________________________________________________________________________________________________________________________________________
        //==============================================================================================================================================================================

        vm.getDefinedMembers = function (resourceName) {
            var allDefinedMembers = getResource(resourceName).definedMembers || [];

            if (!getResource(resourceName).denyInheritance) {
                var base = getBase(resourceName);

                while (base) {
                    if (base.definedMembers) allDefinedMembers = allDefinedMembers.concat(base.definedMembers);

                    if (base.denyInheritance) base = null;else base = getBase(base.name);
                }
            }

            return allDefinedMembers;
        };

        vm.getExcludedMembers = function (resourceName) {
            var allExcludedMembers = getResource(resourceName).excludeMembers || [];

            var base = getBase(resourceName);

            while (base) {
                if (base.excludeMembers) allExcludedMembers = allExcludedMembers.concat(base.excludeMembers);

                base = getBase(base.name);
            }

            return allExcludedMembers;
        };

        vm.getTransformProperties = function (resourceName) {
            return vm.getDefinedMembers(resourceName).filter(function (p) {
                return p.transformType;
            });
        };

        vm.getPaginableProperties = function (resourceName) {
            return vm.getDefinedMembers(resourceName).filter(function (p) {
                return p.paginable;
            });
        };

        vm.getJoinProperties = function (resourceName) {
            return vm.getDefinedMembers(resourceName).filter(function (p) {
                return p.joinable;
            });
        };

        vm.getResourceProperties = function (resourceName) {
            return vm.getDefinedMembers(resourceName);
        };

        vm.getKeyProperty = function (resourceName) {
            var resource = getResource(resourceName);
            var keyProperty = resource.keyProperty;
            var base = getBase(resourceName);

            while (base && !keyProperty) {
                if (base.keyProperty) keyProperty = base.keyProperty;

                base = getBase(base.name);
            }

            if (!keyProperty) keyProperty = 'id'; //default value for key property

            return keyProperty;
        };

        vm.getOpProperty = function (resourceName) {
            var resource = getResource(resourceName);
            var opProperty = resource.opProperty;
            var base = getBase(resourceName);

            while (base && !opProperty) {
                if (base.opProperty) opProperty = base.opProperty;

                base = getBase(base.name);
            }

            if (!opProperty) opProperty = 'op'; //default value for key property

            return opProperty;
        };

        vm.getResourceURL = function (resourceName) {
            var resource = getResource(resourceName);

            var path = resource.url + resource.name;

            var base = getBase(resourceName);

            while (base) {
                if (base && base.url) path = base.url + '/' + path;

                base = getBase(base.name);
            }

            return path;
        };

        vm.getTypeInfo = function (resourceName) {
            var resource = getResource(resourceName);
            var typeInfo = resource.type;

            if (!typeInfo) {
                var base = getBase(resourceName);
                while (base && !typeInfo) {
                    if (base.type) typeInfo = base.type;

                    base = getBase(base.name);
                }
            }

            return typeInfo;
        };

        vm.allowUrlPrefix = function (resourceName) {
            var resource = getResource(resourceName);
            var allowPrefix = resource.allowUrlPrefix;

            if (!allowPrefix) {
                var base = getBase(resourceName);
                while (base && !allowPrefix) {
                    allowPrefix = base.allowUrlPrefix;
                    base = getBase(base.name);
                }
            }

            return allowPrefix || false;
        };

        vm.denyBarPrefix = function (resourceName) {
            var resource = getResource(resourceName);
            return resource.denyBarPrefix || false;
        };

        vm.getDefaultUrl = function (resourceName) {
            var resource = getResource(resourceName);
            var defaultUrl = resource.defaultUrl;

            if (!defaultUrl) defaultUrl = 'default';

            return defaultUrl;
        };

        vm.isFormDataRequest = function (resourceName) {
            var resource = getResource(resourceName);
            var formDataRequest = resource.formDataRequest;

            if (!formDataRequest) return false;

            return true;
        };

        vm.getStartDateProperty = function (resourceName) {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var startProperty = null;

            if (definedMembers.length > 0) definedMembers.forEach(function (dm) {
                if (dm.startDate) {
                    startProperty = dm.name;return false;
                } else return true;
            });

            return startProperty;
        };

        vm.getEndDateProperty = function (resourceName) {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var endProperty = null;

            if (definedMembers.length > 0) definedMembers.every(function (dm) {
                if (dm.endDate) {
                    endProperty = dm.name;return false;
                } else return true;
            });

            return endProperty;
        };

        vm.getNotApplyProperty = function (resourceName) {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var notApplyProperty = null;

            if (definedMembers.length > 0) definedMembers.every(function (dm) {
                if (dm.notApply) {
                    notApplyProperty = dm.name;return false;
                } else return true;
            });

            return notApplyProperty;
        };

        vm.isProcessedEntity = function (resourceName, entity) {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var processedProperty, processedValue;

            if (definedMembers.length > 0) definedMembers.every(function (dm) {
                if (dm.processedValue) {
                    processedProperty = dm.name;processedValue = dm.processedValue;return false;
                } else return true;
            });

            if (entity[processedProperty] == processedValue) return true;
            return false;
        };

        //==============================================================================================================================================================================
        // Utilities ===================================================================================================================================================================
        //==============================================================================================================================================================================

        function getBase(resourceName) {
            var resource = globalMetadata.resources.filter(function (r) {
                return r.name == resourceName;
            })[0];

            if (resource.base) return globalMetadata.resources.filter(function (r) {
                return r.name == resource.base;
            })[0];

            return null;
        };

        function getResource(resourceName) {
            return globalMetadata.resources.filter(function (r) {
                return r.name == resourceName;
            })[0];
        };

        //==============================================================================================================================================================================
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').service('EntifixNotification', service);

    service.$inject = [];

    function service() {
        var vm = this;

        vm.success = function (detalle, encabezado) {
            detalle = detalle || 'Acción realizada correctamente';
            encabezado = encabezado || '¡Hecho!';

            swal(encabezado, detalle, 'success');
        };

        vm.error = function (detalle, encabezado) {
            detalle = detalle || 'Error al realizar la acción solicitada';
            encabezado = encabezado || '¡Error!';

            swal(encabezado, detalle, 'error');
        };

        vm.info = function (detalle, encabezado) {
            detalle = detalle || 'Error al realizar la acción solicitada';
            encabezado = encabezado || 'Información';

            swal(encabezado, detalle, 'info');
        };

        vm.confirm = function (detalle, encabezado, actionConfirm, actionCancel) {
            encabezado = encabezado || '¿Está seguro de proceder?';

            swal({ title: encabezado,
                text: detalle,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No' }).then(actionConfirm, actionCancel);
        };

        return vm;
    };
})();

(function () {
    'use strict';

    angular.module('entifix-js').factory('EntifixNotifier', factory);

    factory.$inject = ['EntifixNotification'];

    function factory(EntifixNotification) {
        return function (resource) {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields
            var _savedMessage = 'Registro guardado correctamente';
            var _deletedMessage = 'Registro eliminado correctamente';
            var _errorSaveMessage = 'No se pudo guardar el registro correctamente. Por favor inténtelo de nuevo';
            var _errorDeleteMessage = 'No se pudo eliminar el registro correctamente. Por favor inténtelo de nuevo';
            var _errorValidationMessage = 'No se pudo guardar el registro porque no todos los datos están correctos';

            // Properties
            vm.savedMessage = {
                get: function get() {
                    return _savedMessage;
                },
                set: function set(value) {
                    _savedMessage = value;
                }
            };

            vm.deletedMessage = {
                get: function get() {
                    return _deletedMessage;
                },
                set: function set(value) {
                    _deletedMessage = value;
                }
            };

            vm.errorSaveMessage = {
                get: function get() {
                    return _errorSaveMessage;
                },
                set: function set(value) {
                    _savedMessage = value;
                }
            };

            vm.errorDeleteMessage = {
                get: function get() {
                    return errorDeleteMessage;
                },
                set: function set(value) {
                    errorDeleteMessage = value;
                }
            };

            vm.errorValidationMessage = {
                get: function get() {
                    return _errorValidationMessage;
                },
                set: function set(value) {
                    errorValidationMessage = value;
                }
            };

            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            function activate() {
                resource.listenSaved(saved);
                resource.listenDeleted(deleted);
                resource.listenErrorSave(errorSave);
                resource.listenErrorDelete(errorDelete);
                resource.listenNonValidSave(nonValidSave);
            };

            function saved(args) {
                var message = _savedMessage;
                if (args.message) message = args.message;

                EntifixNotification.success(message);
            };

            function deleted(args) {
                var message = _deletedMessage;
                if (args.message) message = args.message;

                EntifixNotification.success(message);
            };

            function errorSave(args) {
                var message = _errorSaveMessage;
                if (args.message) message = args.message;

                EntifixNotification.error(message);
            };

            function errorDelete(args) {
                var message = _errorDeleteMessage;
                if (args.message) message = args.message;

                EntifixNotification.error(message);
            };

            function nonValidSave(args) {
                var message = _errorValidationMessage;
                if (args.message) message = args.message;

                EntifixNotification.error(message);
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('entifix-js').factory('EntifixPager', factory);

    factory.$inject = ['EntifixCollectionFormatter'];

    function factory(EntifixCollectionFormatter) {
        return function (queryDetails, configuration, formats) {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields

            var _isLoading = false;
            var _actionPreload;
            var _actionPostload;
            var _searchTextGetter;
            var _searchArrayGetter;
            var _columnsSelectedGetter;
            var _sizeGetter;
            var _pageGetter;
            var _inverseOrder;
            var _paginationSetter;
            // Properties

            vm.isLoading = {
                get: function get() {
                    return _isLoading;
                }
            };

            vm.sizeGetter = {
                get: function get() {
                    return _sizeGetter;
                },
                set: function set(value) {
                    _sizeGetter = value;
                }
            };

            vm.pageGetter = {
                get: function get() {
                    return _pageGetter;
                },
                set: function set(value) {
                    _pageGetter = value;
                }
            };

            vm.searchTextGetter = {
                get: function get() {
                    return _searchTextGetter;
                },
                set: function set(value) {
                    _searchTextGetter = value;
                }
            };

            vm.searchArrayGetter = {
                get: function get() {
                    return _searchArrayGetter;
                },
                set: function set(value) {
                    _searchArrayGetter = value;
                }
            };

            vm.columnsSelectedGetter = {
                get: function get() {
                    return _columnsSelectedGetter;
                },
                set: function set(value) {
                    _columnsSelectedGetter = value;
                }
            };

            vm.inverseOrder = {
                get: function get() {
                    return _inverseOrder;
                },
                set: function set(value) {
                    _inverseOrder = value;
                }
            };

            vm.showPageControls = {
                get: function get() {
                    if (configuration && configuration.showPageControls != null) return configuration.showPageControls;

                    if (vm.currentData && vm.currentData.length && vm.currentData.length > 0) return true;
                    return false;
                }
            };

            var inicialSize = {
                get: function get() {
                    if (configuration && configuration.inicialSize) return configuration.inicialSize;
                    return 10;
                }
            };

            var inicialPageSizes = {
                get: function get() {
                    if (configuration && configuration.inicialPageSizes) return configuration.inicialPageSizes;
                    return [10, 25, 50, 100, 200];
                }
            };

            var inicialCurrentPage = {
                get: function get() {
                    if (configuration && configuration.inicialCurrentPage) return configuration.inicialCurrentPage;
                    return 1;
                }

                // =========================================================================================================================


                // Methods
                // =========================================================================================================================

            };function activate() {
                vm.pageSizes = inicialPageSizes.get();
                vm.size = inicialSize.get();
                vm.page = inicialCurrentPage.get();
                vm.formater = new EntifixCollectionFormatter();
            };

            vm.listenBeforeLoad = function (callback) {
                _actionPreload = callback;
            };

            vm.listenAfterLoad = function (callback) {
                _actionPostload = callback;
            };

            vm.reload = function () {
                return requestData();
            };

            function requestData() {
                if (queryDetails.resource) {
                    _isLoading = true;

                    if (_actionPreload) _actionPreload();

                    return queryDetails.resource.getEntityPagination((vm.getPage() - 1) * vm.getSize(), vm.getSize(), vm.getConstantFilters(), queryDetails.resource.getPagFilters(vm.getSearchText(), vm.getSearchArray(), vm.getColumnsSelectedGetter()), queryDetails.sort).then(function (data) {
                        if (data) {
                            var total = data.total;
                            var page = vm.getPage();
                            var size = vm.getSize();
                            for (var i = 1; i <= vm.getSize(); i++) {
                                if (_inverseOrder) {
                                    var res = total - (page - 1) * size;
                                    var ord = total - (page - 1) * size - res - i;
                                    if (ord > 0) data.resultSet[i].order = ord;
                                } else {
                                    var ord = (page - 1) * size + i;
                                    if (ord <= total) {
                                        if (data.resultSet[i - 1]) data.resultSet[i - 1].order = ord;else console.info("Error en la paginación de registros. No concuerdan el total en el encabezado y la cantidad registros en el detalle");
                                    }
                                }
                            }

                            // Set pagination
                            vm.formater.transformMultiple({ collection: data.resultSet, properties: formats }).then(function () {
                                vm.currentData = data.resultSet;
                            });
                            vm.currentData = data.resultSet;
                            vm.totalData = data.total;

                            if (_actionPostload) _actionPostload();
                        }
                        _isLoading = false;
                    }, function (error) {
                        _isLoading = false;return error;
                    });
                } else {
                    console.error('No se ha construido correctamente el paginador');
                }
            };

            vm.getSize = function () {
                if (_sizeGetter) return _sizeGetter();

                if (vm.size) return vm.size;

                return 10;
            };

            vm.getPage = function () {
                if (_pageGetter) return _pageGetter();

                if (vm.page) return vm.page;

                return 1;
            };

            vm.getConstantFilters = function () {
                var constantFilters = null;
                if (queryDetails && queryDetails.constantFilters) {
                    if (queryDetails.constantFilters.getter) constantFilters = queryDetails.constantFilters.getter();else constantFilters = queryDetails.constantFilters;
                }

                return constantFilters;
            };

            vm.getSearchText = function () {
                if (_searchTextGetter) return _searchTextGetter();

                if (vm.searchText) return vm.searchText;

                return null;
            };

            vm.getSearchArray = function () {
                if (_searchArrayGetter) return _searchArrayGetter();

                if (vm.searchArray) return vm.searchArray;

                return null;
            };

            vm.getColumnsSelectedGetter = function () {
                if (_columnsSelectedGetter) return _columnsSelectedGetter();

                if (vm.columnsSelected) return vm.columnsSelected;

                return null;
            };

            vm.getDescriptionText = function () {
                if (vm.currentData && vm.currentData.length > 0) {
                    var start = (vm.getPage() - 1) * vm.getSize() + 1;
                    var end = start + vm.currentData.length - 1;

                    return 'Mostrando del ' + start + ' al ' + end + ' de ' + vm.totalData + ' registros';
                }

                return 'No hay registros que mostrar';
            };

            vm.sortTableColumns = {
                set: function set(filters) {
                    if (filters) queryDetails.sort = filters;
                }

                // =========================================================================================================================

                // Constructor call
            };activate();
        };
    };
})();
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    angular.module('entifix-js').factory('EntifixResource', resource);

    resource.$inject = ['$http', 'AppResources', 'EntifixMetadata', 'EntifixErrorManager'];

    function resource($http, AppResources, EntifixMetadata, EntifixErrorManager) {
        var resource = function resource(resourceName) {
            var vm = this;

            // REQUESTS _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================

            var GET = function GET(actionSuccess, actionError, stringQueryParams, suffixUrl, returnPromise) {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                if (suffixUrl) tempUrl = tempUrl + '/' + suffixUrl;

                if (stringQueryParams) tempUrl = tempUrl + stringQueryParams;

                actionError = actionError || _defaultActionError;

                var requestConfig = {
                    method: 'GET',
                    url: tempUrl
                };

                if (returnPromise) return $http(requestConfig);else $http(requestConfig).then(actionSuccess, actionError);
            };

            var POST = function POST(data, actionSuccess, actionError) {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest()) {
                    data = transformDataToRequest(data);
                    $http({
                        method: 'POST',
                        url: tempUrl,
                        data: convertData(data),
                        headers: { 'Content-Type': undefined }
                    }).then(actionSuccess, actionError);
                } else {
                    $http({
                        method: 'POST',
                        url: tempUrl,
                        data: transformDataToRequest(data)
                    }).then(actionSuccess, actionError);
                }
            };

            var PUT = function PUT(data, actionSuccess, actionError) {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest()) {
                    data = transformDataToRequest(data);
                    $http({
                        method: 'PUT',
                        url: tempUrl,
                        data: convertData(data),
                        headers: { 'Content-Type': undefined }
                    }).then(actionSuccess, actionError);
                } else {
                    $http({
                        method: 'PUT',
                        url: tempUrl,
                        data: transformDataToRequest(data)
                    }).then(actionSuccess, actionError);
                }
            };

            var DELETE = function DELETE(id, actionSuccess, actionError) {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                var tempUrl = tempUrl + '/' + id;
                actionError = actionError || _defaultActionError;

                $http({
                    method: 'DELETE',
                    url: tempUrl
                }).then(actionSuccess, actionError);
            };

            var PATCH = function PATCH(data, actionSuccess, actionError) {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest()) {
                    data = transformDataToRequest(data);
                    $http({
                        method: 'PATCH',
                        url: tempUrl,
                        data: convertData(data),
                        headers: { 'Content-Type': undefined }
                    }).then(actionSuccess, actionError);
                } else {
                    $http({
                        method: 'PATCH',
                        url: tempUrl,
                        data: transformDataToRequest(data)
                    }).then(actionSuccess, actionError);
                }
            };

            //Format functions ===>>>>:

            function getBaseUrl() {
                // var tempUrl = AppResources.baseUrl + AppResources.api;

                // var prefix = vm.urlPrefix.get();

                // if (prefix)
                // {
                //     tempUrl += prefix;
                //     if (!_denyBarPrefix)
                //         tempUrl += '/';                    
                // }

                //return tempUrl + _resourceUrl;
                return _resourceUrl;
            };

            function transformDataToRequest(data) {
                //Set type
                var typeInfo = EntifixMetadata.getTypeInfo(resourceName);
                if (typeInfo && data[typeInfo.property] && data[_keyProperty]) data[typeInfo.property] = _defineProperty({}, typeInfo.property, typeInfo.value);

                //Transform properties
                var transformProperties = EntifixMetadata.getTransformProperties(resourceName);
                if (transformProperties.length > 0) {
                    for (var i = 0; i < transformProperties.length; i++) {
                        var TProperty = transformProperties[i];

                        if (data[TProperty.name]) {
                            //For navigation properties
                            if (TProperty.transformType == 'navigation') {
                                var value = data[TProperty.name];

                                if (!isNaN(value)) {
                                    var keyValue = value;
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    data[TProperty.name] = _defineProperty({}, keyNavigationProperty, keyValue);
                                }
                            }

                            //For date properties
                            if (TProperty.transformType == 'date' || TProperty.transformType == 'datetime') {
                                var dateValue = new Date(data[TProperty.name]);

                                var year = dateValue.getFullYear().toString();
                                var month = (dateValue.getMonth() + 1).toString();
                                var day = dateValue.getDate().toString();
                                var hours = dateValue.getHours().toString();
                                var minutes = dateValue.getMinutes().toString();
                                var seconds = dateValue.getSeconds().toString();

                                if (month.length < 2) month = '0' + month;
                                if (day.length < 2) day = '0' + day;
                                if (hours.length < 2) hours = '0' + hours;
                                if (minutes.length < 2) minutes = '0' + minutes;
                                if (seconds.length < 2) seconds = '0' + seconds;

                                data[TProperty.name] = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                            }

                            //Other types of properties to transform....

                            /*if (TProperty.propertyMetaData.transformType == ?)
                            {
                              }*/
                        }
                    }
                }

                //Remove non persistent and excluded properties/members
                for (var p in data) {
                    if (p.substr(0, 1) == '$') delete data[p];
                };
                var excludedMembers = EntifixMetadata.getExcludedMembers(resourceName);
                for (var i = 0; i < excludedMembers.length; i++) {
                    delete data[excludedMembers[i]];
                }return data;
            };

            function convertData(data) {
                var fd = new FormData();
                for (var p in data) {
                    fd.append(p, data[p]);
                }return fd;
            }

            function transformDataFromResponse(data) {
                if (data) {
                    //Transform properties
                    var transformProperties = EntifixMetadata.getTransformProperties(resourceName);

                    if (transformProperties.length > 0) {
                        for (var i = 0; i < transformProperties.length; i++) {
                            var TProperty = transformProperties[i];

                            if (data[TProperty.name]) {
                                //For navigation properties
                                if (TProperty.transformType == 'navigation') {
                                    var objectValue = data[TProperty.name];
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    var keyValue = objectValue[keyNavigationProperty];

                                    if (TProperty.propertiesToMembers) for (var j = 0; j < TProperty.propertiesToMembers.length; j++) {
                                        if (TProperty.propertiesToMembers[j] instanceof Object) data[TProperty.propertiesToMembers[j].to || TProperty.propertiesToMembers[j].name] = objectValue[TProperty.propertiesToMembers[j].name];
                                    }data[TProperty.name] = keyValue;
                                }

                                //For date-time properties
                                if (TProperty.transformType == 'date' || TProperty.transformType == 'datetime') {
                                    var objectValue = data[TProperty.name];
                                    data[TProperty.name] = new Date(objectValue);
                                }

                                //Other types of properties to transform....
                                /*if (TProperty.propertyMetaData.transformType == ?)
                                {
                                  }*/
                            }
                        }
                    }

                    return data;
                } else return null;
            };

            //==============================================================================================================================================================================


            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:
            var _isSaving = false;
            var _isLoading = false;
            var _isDeleting = false;
            var _events = null;
            var _onMultipleDeletion = false;
            var _onMultipleStorage = false;
            var _urlPrefix;

            var _resourceUrl = EntifixMetadata.getResourceURL(resourceName);
            var _keyProperty = EntifixMetadata.getKeyProperty(resourceName);
            var _opProperty = EntifixMetadata.getOpProperty(resourceName);
            var _allowUrlPrefix = EntifixMetadata.allowUrlPrefix(resourceName);
            var _denyBarPrefix = EntifixMetadata.denyBarPrefix(resourceName);

            var _defaultActionError = function _defaultActionError(error) {
                _isDeleting = false;
                _isLoading = false;
                _isSaving = false;
            };

            var _checkActionErrors = function _checkActionErrors(error) {
                switch (error.status) {
                    case 401:
                        EntifixErrorManager.unauthorizedError(error);
                        break;

                    case 404:
                        EntifixErrorManager.notFoundError(error);
                        break;

                    case 412:
                        EntifixErrorManager.preconditionFailedError(error);
                        break;

                    case 500:
                        EntifixErrorManager.internalServerError(error);
                        break;
                }
            };

            var _eventType = { save: 1, delete: 2, load: 3, saved: 4, deleted: 5, loaded: 6, errorSave: 7, errorDelete: 8, errorLoad: 9, nonValidSave: 10 };

            //Properties ===>>>>:
            vm.resourceName = {
                get: function get() {
                    return resourceName;
                }
            };

            vm.isSaving = {
                get: function get() {
                    return _isSaving || _onMultipleStorage;
                }
            };

            vm.isLoading = {
                get: function get() {
                    return _isLoading;
                }
            };

            vm.isDeleting = {
                get: function get() {
                    return _isDeleting || _onMultipleDeletion;
                }
            };

            vm.events = {
                get: function get() {
                    return _events;
                }
            };

            vm.onMultipleDeletion = {
                get: function get() {
                    return _onMultipleDeletion;
                },
                set: function set(value) {
                    _onMultipleDeletion = value;
                }
            };

            vm.onMultipleStorage = {
                get: function get() {
                    return _onMultipleStorage;
                },
                set: function set(value) {
                    _onMultipleStorage = value;
                }
            };

            vm.urlPrefix = {
                get: function get() {
                    if (_allowUrlPrefix && _urlPrefix) {
                        if (_urlPrefix instanceof Object && _urlPrefix.getter) return _urlPrefix.getter();

                        if (_urlPrefix) return _urlPrefix;
                    }

                    return null;
                },
                set: function set(value) {
                    if (_allowUrlPrefix) _urlPrefix = value;
                }
            };

            vm.getCompleteResourceUrl = {
                get: function get() {
                    return getBaseUrl();
                }
            };

            vm.getCompleteFiltersUrl = {
                get: function get(searchText, searchArray, columnsSelected, constantFilters) {
                    if (!constantFilters) constantFilters = [];
                    return manageUriFilter(vm.getPagFilters(searchText, searchArray, columnsSelected).concat(constantFilters));
                }
            };

            vm.getMembersResource = {
                get: function get() {
                    return EntifixMetadata.getResourceProperties(resourceName).filter(function (rp) {
                        return !rp.notDisplay;
                    });
                }
            };

            vm.getKeyProperty = {
                get: function get() {
                    return _keyProperty;
                }
            };

            vm.getOpProperty = {
                get: function get() {
                    return _opProperty;
                }
                //==============================================================================================================================================================================


                // Methods _____________________________________________________________________________________________________________________________________________________________________
                //==============================================================================================================================================================================


                //Private ===>>>>:

                //Manage request timing
            };function createArgs(response) {
                return { message: response.data.message, fullResponse: response };
            };

            function onSaveTransactionEnd(callback, isError) {
                return function (response) {
                    var saveSuccess = !response.data.isLogicError;

                    if (!_onMultipleStorage && callback) callback(response, saveSuccess);

                    _isSaving = false;

                    if (!(response.status >= 200 && response.status < 300)) _checkActionErrors(response);

                    if (isError) runTriggers(_eventType.errorSave, createArgs(response));else if (!_onMultipleStorage) {
                        if (saveSuccess) runTriggers(_eventType.saved, createArgs(response));else runTriggers(_eventType.nonValidSave, createArgs(response));
                    }

                    if (_onMultipleStorage && callback) callback(response);
                };
            };

            function onQueryEnd(callback, isError) {
                return function (response) {
                    if (callback) callback(response);

                    _isLoading = false;

                    if (!(response.status >= 200 && response.status < 300)) _checkActionErrors(response);

                    if (isError) runTriggers(_eventType.errorLoad, createArgs(response));else runTriggers(_eventType.loaded, createArgs(response));
                };
            };

            function onDeleteTransactionEnd(callback, isError) {
                return function (response) {
                    if (!_onMultipleDeletion && callback) callback(response);

                    _isDeleting = false;

                    if (!(response.status >= 200 && response.status < 300)) _checkActionErrors(response);

                    if (isError) runTriggers(_eventType.errorDelete, createArgs(response));else if (!_onMultipleDeletion) runTriggers(_eventType.deleted, createArgs(response));

                    if (_onMultipleDeletion && callback) callback(response);
                };
            };

            // Base functions for requests
            function _deleteEntity(idEntity, actionSuccess, actionError) {
                if (_isDeleting != true || _onMultipleDeletion) {
                    _isDeleting = true;
                    runTriggers(_eventType.delete);

                    DELETE(idEntity, onDeleteTransactionEnd(actionSuccess, false), onDeleteTransactionEnd(actionError, true));
                }
            };

            function _insertEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    POST(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function _updateEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    PUT(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function _replaceEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    PATCH(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function findEntity(id, ActionSuccess, ActionError) {
                _isLoading = true;

                var preSuccess = function preSuccess(response) {
                    _isLoading = true;

                    if (ActionSuccess) ActionSuccess(transformDataFromResponse(response.data.data));

                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(ActionError), manageUriFilter(id));
            };

            function convertToQueryParams(filters) {
                if (filters) {
                    if (filters instanceof Array) {
                        if (filters.length > 0) {
                            var querystring = '?';
                            for (var i = 0; i < filters.length; i++) {
                                var property = filters[i].property;
                                var value = filters[i].value;
                                if (value != null && property != null) {
                                    //Function filters
                                    if (typeof value == "function") {
                                        var possibleValue = value();
                                        if (possibleValue) querystring = querystring + property + '=' + possibleValue;
                                    }

                                    //Clasic filters
                                    else querystring = querystring + property + '=' + value;

                                    //Other types of filters
                                    /*
                                    if/else (...)
                                    {
                                      }
                                    */
                                }

                                if (i < filters.length - 1) querystring = querystring + '&';
                            }

                            return querystring;
                        } else return null;
                    }
                }

                return null;
            };

            function manageUriFilter(filter) {
                if (filter) {
                    var stringfilter = null;

                    if (!isNaN(filter)) stringfilter = '/' + filter;else if (typeof filter == 'string') stringfilter = '/' + filter;else if (filter instanceof Array) stringfilter = convertToQueryParams(filter);

                    return stringfilter;
                }

                return null;
            }

            //Public ===>>>>:

            vm.getCollection = function (actionSuccess, actionError, filters, suffix_pagination) {
                _isLoading = true;

                actionError = actionError || _defaultActionError;

                var tempSuffix = null;
                if (suffix_pagination) {
                    if (suffix_pagination instanceof Function) tempSuffix = suffix_pagination();else tempSuffix = suffix_pagination.skip + '/' + suffix_pagination.take;
                }

                var preSuccess = function preSuccess(response) {
                    _isLoading = true;
                    var resultData = response.data.data || [];
                    actionSuccess(resultData);
                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), manageUriFilter(filters), tempSuffix);
            };

            vm.getEnumerationBind = function (DisplayProperty, actionSuccess, actionError, filters) {
                var operateresults = function operateresults(results) {
                    var bindEnum = [];

                    results.forEach(function (element) {
                        bindEnum.push({ Value: element[_keyProperty], Display: element[DisplayProperty], ObjectData: element });
                    });

                    actionSuccess(bindEnum);
                };

                return vm.getCollection(operateresults, actionError, filters);
            };

            vm.getEnumerationBindMultiDisplay = function (parameters) {
                var operateresults = function operateresults(results) {
                    var bindEnum = [];

                    results.forEach(function (element) {
                        if (parameters.displayProperties) {
                            var value = "";
                            parameters.displayProperties.forEach(function (displayProperty) {
                                if (displayProperty.type) value += element[displayProperty.property][displayProperty.display] + " - ";else value += element[displayProperty.property] + " - ";
                            });
                            value = value.substring(0, value.length - 2);
                            bindEnum.push({ Value: element[_keyProperty], Display: value, ObjectData: element });
                        }
                    });

                    parameters.actionSuccess(bindEnum);
                };

                return vm.getCollection(operateresults, parameters.actionError, parameters.filters);
            };

            vm.getDefault = function (actionSuccess, actionError) {
                var defaultURL = EntifixMetadata.getDefaultUrl(resourceName);

                _isLoading = true;

                actionError = actionError || _defaultActionError;

                var preSuccess = function preSuccess(response) {
                    _isLoading = true;
                    var resultData = response.data.data || [];
                    actionSuccess(resultData);
                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), null, defaultURL);
            };

            vm.saveEntity = function (entity, ActionSuccess, ActionError) {
                if (entity[_keyProperty]) {
                    if (entity[_opProperty]) _replaceEntity(entity, ActionSuccess, ActionError);else _updateEntity(entity, ActionSuccess, ActionError);
                } else _insertEntity(entity, ActionSuccess, ActionError);
            };

            vm.deleteEntity = function (entity, actionSuccess, actionError) {
                var id = entity;

                if (entity instanceof Object) id = entity[_keyProperty];

                _deleteEntity(id, actionSuccess, actionError);
            };

            vm.loadAsResource = function (entity, ActionSuccess, ActionError) {
                var id = entity;

                if (entity instanceof Object) id = entity[_keyProperty];

                findEntity(id, ActionSuccess, ActionError);
            };

            vm.getEntityPagination = function (pageIndex, pageSize, constFilters, pagFilters, sort) {
                _isLoading = true;

                var skip = { property: 'skip', value: pageIndex };
                var take = { property: 'take', value: pageSize };
                var pagUrl = '';

                var allFilters = [skip, take];

                if (constFilters) {
                    if (constFilters instanceof String) pagUrl = constFilters + '/' + pagUrl;
                    if (constFilters instanceof Function) pagUrl = constFilters() ? constFilters() + '/' + pagUrl : pagUrl;
                    if (constFilters instanceof Array && constFilters.length > 0) allFilters = allFilters.concat(constFilters);
                }

                if (pagFilters && pagFilters.length > 0) allFilters = allFilters.concat(pagFilters);

                if (sort && sort.length > 0) allFilters = allFilters.concat(sort);

                return GET(null, null, manageUriFilter(allFilters), pagUrl, true).then(function (response) {
                    var dataPag = {
                        resultSet: response.data.data,
                        total: parseInt(response.data.info.total)
                    };
                    _isLoading = false;
                    return dataPag;
                }, function (error) {
                    _isLoading = false;
                    _checkActionErrors(error);
                });
            };

            vm.getPagFilters = function (searchText, searchArray, columnsSelected) {
                if (searchText && (!searchArray || searchArray.length <= 0)) {
                    var pagProperties = filterProperties(EntifixMetadata.getPaginableProperties(resourceName), columnsSelected).map(function (p) {
                        return p.pageProperty ? p.pageProperty : p.name;
                    });
                    var joinProperties = filterProperties(EntifixMetadata.getJoinProperties(resourceName), columnsSelected);
                    var resPagFilters = [{ property: 'operator', value: 'or' }];

                    for (var prop in pagProperties) {
                        resPagFilters.push({ property: pagProperties[prop], value: 'like;' + searchText });
                    }for (var prop in joinProperties) {
                        resPagFilters.push({ property: joinProperties[prop].propertySearch, value: searchText });
                        resPagFilters.push({ property: joinProperties[prop].name, value: 'join;' + joinProperties[prop].propertyJoin });
                    }
                } else if (searchArray) {
                    var resPagFilters = [{ property: 'operator', value: 'and' }];
                    searchArray.forEach(function (element) {
                        if (element.operator == '=' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'like;' + element.value });

                        if (element.operator == '%' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'like;%25' + element.value });

                        if (element.operator == '>' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'gt;' + element.value });

                        if (element.operator == '>=' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'gte;' + element.value });

                        if (element.operator == '<' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'lt;' + element.value });

                        if (element.operator == '<=' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'lte;' + element.value });

                        if (element.operator == '<>' && element.property.name) resPagFilters.push({ property: element.property.pageProperty || element.property.name, value: 'neq;' + element.value });
                    });
                }

                return resPagFilters;
            };

            vm.getFile = function (url, typeFile, fileName) {
                var actionSuccess = function actionSuccess(response) {
                    createDownloadFile(response, typeFile, fileName);
                };
                var actionError = function actionError(response) {
                    _checkActionErrors(response);
                };

                var config = {
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer'
                };

                $http(config).then(actionSuccess, actionError);
            };

            vm.getId = function (entity) {
                if (entity && entity instanceof Object && entity[_keyProperty]) {
                    var valuekey = entity[_keyProperty];
                    if (isNaN(valuekey)) return valuekey;else return parseInt(valuekey);
                }

                return null;
            };

            vm.isNewEntity = function (entity) {
                return vm.getId(entity) == null;
            };

            vm.isProcessedEntity = function (entity) {
                return EntifixMetadata.isProcessedEntity(resourceName, entity);
            };

            vm.getStartDateProperty = function () {
                return EntifixMetadata.getStartDateProperty(resourceName);
            };

            vm.getEndDateProperty = function () {
                return EntifixMetadata.getEndDateProperty(resourceName);
            };

            vm.getNotApplyProperty = function () {
                return EntifixMetadata.getNotApplyProperty(resourceName);
            };

            function isFormDataRequest() {
                return EntifixMetadata.isFormDataRequest(resourceName);
            }

            function filterProperties(properties, columnsSelected) {
                var filterProp = [];
                columnsSelected.forEach(function (cs) {
                    var filter = properties.filter(function (p) {
                        return getDisplay(p) == cs;
                    });
                    if (filter.length > 0) filterProp.push(filter[0]);
                });
                return filterProp;
            }

            function getDisplay(property) {
                if (property.display) return property.display;
                if (property.name) return getCleanedString(property.name);
                return null;
            }

            function getCleanedString(stringToClean) {
                return stringToClean.charAt(0).toUpperCase() + stringToClean.substring(1, stringToClean.length);
            }

            function createDownloadFile(response, typeFile, fileName) {
                var type = typeFile || null;
                var blob = new Blob([response.data], { type: type });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = fileName || resourceName;
                anchor.href = blobURL;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }

            // Events management
            function addNewEvent(eventCallback, eventType) {
                if (_events) {
                    if (_events.filter(function (e) {
                        return e.callback === eventCallback && e.type == eventType;
                    }).length == 0) _events.push({ callback: eventCallback, type: eventType });
                } else _events = [{ callback: eventCallback, type: eventType }];
            };

            function runTriggers(eventType, args) {
                if (_events && _events.length > 0) _events.filter(function (e) {
                    return e.type == eventType;
                }).forEach(function (e) {
                    e.callback(args);
                });
            };

            vm.listenSave = function (callback) {
                addNewEvent(callback, _eventType.save);
            };

            vm.listenSaved = function (callback) {
                addNewEvent(callback, _eventType.saved);
            };

            vm.listenDelete = function (callback) {
                addNewEvent(callback, _eventType.delete);
            };

            vm.listenDeleted = function (callback) {
                addNewEvent(callback, _eventType.deleted);
            };

            vm.listenLoad = function (callback) {
                addNewEvent(callback, _eventType.load);
            };

            vm.listenLoaded = function (callback) {
                addNewEvent(callback, _eventType.loaded);
            };

            vm.listenErrorSave = function (callback) {
                addNewEvent(callback, _eventType.errorSave);
            };

            vm.listenErrorDelete = function (callback) {
                addNewEvent(callback, _eventType.errorDelete);
            };

            vm.listenErrorLoad = function (callback) {
                addNewEvent(callback, _eventType.errorLoad);
            };

            vm.listenNonValidSave = function (callback) {
                addNewEvent(callback, _eventType.nonValidSave);
            };

            vm.clearEvents = function () {
                _events = [];
            };

            //==============================================================================================================================================================================
        };

        return resource;
    };
})();
'use strict';

// ENTIFIX RESOURCE METADATA PROVIDER *************************************************************************
// ============================================================================================================
// ============================================================================================================ 
// ============================================================================================================
(function () {
    'use strict';

    var module = angular.module('entifix-js');

    module.provider("EntifixResourceMetadata", [function () {

        var prov = this;

        var $mainAPI;

        prov.setMainAPI = function (value) {
            $mainAPI = value;
        };

        prov.$get = ['$http', '$mdDialog', '$mdToast', function ($http, $mdDialog, $mdToast) {

            var sv = {};

            //Properties and Fields___________________________________________________________________________________________________________________________
            //================================================================================================================================================

            //Fields

            //Properties

            //================================================================================================================================================

            //Methods_________________________________________________________________________________________________________________________________________
            //================================================================================================================================================
            function actionSuccess(response) {
                mergeMetadata(response.data.data);
            }

            function actionError() {
                $mdToast.show($mdToast.simple().textContent('Error when trying to load metadata...').position('bottom right').hideDelay(3000));
            }

            function mergeMetadata(metadata) {
                globalMetadata.resources.forEach(function (element) {
                    metadata.forEach(function (element_loaded) {
                        if (element.name == element_loaded.resourceName) element.url = element_loaded.apiUrl;
                    });
                });
            }

            // Public section _____________________________________________________________________
            sv.loadMetadata = function () {
                $http({ method: 'GET', url: $mainAPI }).then(actionSuccess, actionError);
            };

            //================================================================================================================================================


            return sv;
        }];
        // ============================================================================================================================================================================================================================
        // ============================================================================================================================================================================================================================
    }]);
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller($timeout) {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);
        var _defaultTitle;

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) vm.queryDetails.resource.isLoading.get();

                //Default value
                return false;
            }
        };

        //Label - Editable Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        //Error validations
        vm.isRequired = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isRequired) return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };

        vm.requiredMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage) {
                    if (vm.componentConstruction.requiredMessage.getter) return vm.componentConstruction.requiredMessage.getter();

                    if (vm.componentConstruction.requiredMessage.text) return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.requiredMatch = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMatch) return vm.componentConstruction.requiredMatch;

                //Default value
                return false;
            }
        };

        vm.requiredMatchMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMatchMessage) {
                    if (vm.componentConstruction.requiredMatchMessage.getter) return vm.componentConstruction.requiredMatchMessage.getter();

                    if (vm.componentConstruction.requiredMatchMessage.text) return vm.componentConstruction.requiredMatchMessage.text;
                }

                //Default value
                return 'Seleccione un elemento de la lista';
            }
        };

        vm.minLengthRequest = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minLengthRequest) return vm.componentConstruction.minLengthRequest;

                //Default value
                return 0;
            }
        };

        vm.minLength = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minLength) return vm.componentConstruction.minLength;

                //Default value
                return null;
            }
        };

        vm.minLengthMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minLengthMessage) {
                    if (vm.componentConstruction.minLengthMessage.getter) return vm.componentConstruction.minLengthMessage.getter();

                    if (vm.componentConstruction.minLengthMessage.text) return vm.componentConstruction.minLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado corto';
            }
        };

        vm.maxLength = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxLength) return vm.componentConstruction.maxLength;

                //Default value
                return null;
            }
        };

        vm.maxLengthMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxLengthMessage) {
                    if (vm.componentConstruction.maxLengthMessage.getter) return vm.componentConstruction.maxLengthMessage.getter();

                    if (vm.componentConstruction.maxLengthMessage.text) return vm.componentConstruction.maxLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado largo';
            }
        };

        vm.createNewEntityMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.createNewEntityMessage) {
                    if (vm.componentConstruction.createNewEntityMessage.getter) return vm.componentConstruction.createNewEntityMessage.getter();

                    if (vm.componentConstruction.createNewEntityMessage.text) return vm.componentConstruction.createNewEntityMessage.text;
                }

                //Default value
                return 'Agregar ';
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            },

            set: function set(value) {
                if (value) vm.componentConstruction.title = { text: value };
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixautocomplete' + randomNumber;
            }
        };

        vm.mappingMethod = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.mapping) {
                    if (vm.componentConstruction.mapping.method) return vm.componentConstruction.mapping.method;
                    if (vm.componentConstruction.mapping.property) return function (element) {
                        return element[vm.componentConstruction.mapping.property];
                    };
                }
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.placeholder = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.placeholder) {
                    if (vm.componentConstruction.placeholder.getter) return vm.componentConstruction.placeholder.getter();

                    if (vm.componentConstruction.placeholder.text) return vm.componentConstruction.placeholder.text;
                }

                //Default value
                return "";
            }
        };

        vm.disabled = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.disabled) return vm.componentConstruction.disabled;

                //Default value
                return false;
            }
        };

        vm.floating = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.floating != null) return vm.componentConstruction.floating;

                //Default value
                return true;
            }
        };

        vm.loadAllItems = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.loadAllItems) return vm.componentConstruction.loadAllItems;

                //Default Value
                return false;
            }
        };

        vm.noCache = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.noCache != null) return vm.componentConstruction.noCache;

                //Default value
                return true;
            }
        };

        vm.notFoundText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.notFoundText) {
                    if (vm.componentConstruction.notFoundText.getter) return vm.componentConstruction.notFoundText.getter();

                    if (vm.componentConstruction.notFoundText.text) return vm.componentConstruction.notFoundText.text;
                }

                //Default value
                return 'No hay coincidencias. ';
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.canCreateNewEntity = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.canCreateNewEntity) return vm.componentConstruction.canCreateNewEntity;

                //Default value
                return false;
            }
        };

        vm.maxItemsQuery = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxItemsQuery) return vm.componentConstruction.maxItemsQuery;

                //Default value
                return 10;
            }
        };

        vm.keyProperty = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.keyProperty) return vm.componentConstruction.keyProperty;

                //Default value
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.getKeyProperty.get();

                return 'id';
            }
        };

        vm.nullValueLabel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel) return vm.componentConstruction.nullValueLabel;

                return 'SIN REGISTROS';
            }
        };

        vm.getConstantFilters = function () {
            var constantFilters = null;
            if (vm.queryDetails && vm.queryDetails.constantFilters) {
                if (vm.queryDetails.constantFilters.getter) constantFilters = vm.queryDetails.constantFilters.getter();else constantFilters = vm.queryDetails.constantFilters;
            }

            return constantFilters;
        };
        //=======================================================================================================================================================================


        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function () {
            if (vm.loadAllItems.get()) loadCollection();
            checkoutputs();
            _defaultTitle = vm.title.get();
        };

        function loadCollection() {
            vm.queryDetails.resource.getCollection(function (results) {
                vm.items = results;
            });
        }

        function checkoutputs() {
            vm.componentBindingOut = {
                selectedEntity: {
                    get: function get() {
                        if (vm.entityList && vm.entityList.length > 0) return vm.entityList.filter(function (D_entity) {
                            return vm.selectedItem == vm.mappingMethod.get()(D_entity);
                        })[0];
                    },
                    set: function set(value) {
                        if (value) getEntity(value);else {
                            vm.showList = [];vm.selectedItem = undefined;vm.entityList = [];
                        }
                    }
                }
            };

            if (vm.componentConstruction.init) vm.componentConstruction.init();

            vm.loadingFirstRequest = false;
        }

        vm.getDisplayValue = function () {
            if (vm.valueModel && vm.selectedItem) return vm.selectedItem;

            if (vm.valueModel && !vm.selectedItem && !vm.loadingFirstRequest) getEntity(vm.valueModel);

            return vm.nullValueLabel.get();
        };

        vm.getValue = function () {
            if (vm.valueModel) return vm.valueModel;

            return null;
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        function constructFilters(searchText) {
            //Construct Filters
            var allFilters = [];

            if (!vm.queryDetails.operator || vm.queryDetails.operator == 'or') allFilters.push({ property: 'operator', value: 'or' });

            if (vm.queryDetails && vm.componentConstruction.searchProperties && vm.componentConstruction.searchProperties.length > 0) allFilters = allFilters.concat(vm.componentConstruction.searchProperties.map(function (D_searchProperty) {
                return { property: D_searchProperty, value: 'like;' + searchText };
            }));

            if (vm.queryDetails && vm.queryDetails.filters) allFilters = allFilters.concat(vm.queryDetails.filters);

            if (vm.getConstantFilters()) allFilters = allFilters.concat(vm.getConstantFilters());

            return allFilters;
        }

        function setValueModel(value, entity) {
            if (vm.valueModel != value) {
                vm.valueModel = value;
                if (vm.onChange) vm.onChange({ oldValue: vm.valueModel, newValue: value, entity: entity });
            }
        }

        vm.updateData = function (data) {
            var typedText = data.search;

            vm.queryDetails.resource.getCollection(function (results) {
                if (results.length > 0) {
                    vm.entityList = results;
                    vm.showList = results.map(vm.mappingMethod.get());
                    vm.title.set(_defaultTitle);
                } else {
                    vm.showList = [];
                    if (vm.canCreateNewEntity.get()) {
                        vm.showList = [typedText];
                        vm.title.set(_defaultTitle + ': ' + vm.createNewEntityMessage.get() + typedText);
                    }
                }
                data.resolve(vm.showList);
            }, function (error) {
                if (data.reject) data.reject();
            }, constructFilters(typedText));
        };

        function getInitialData(data) {
            var maxItems = vm.maxItemsQuery.get();
            vm.queryDetails.resource.getCollection(function (results) {
                vm.entityList = results;
                vm.showList = results.map(vm.mappingMethod.get());
                data.resolve(vm.showList);
                vm.title.set(_defaultTitle);
            }, function (error) {
                if (data.reject) data.reject();
            }, vm.getConstantFilters(), { skip: 0, take: maxItems });
        }

        function getEntity(id) {
            vm.loadingFirstRequest = true;
            vm.queryDetails.resource.getCollection(function (results) {
                if (results.length > 0) {
                    vm.entityList = results;
                    vm.showList = results.map(vm.mappingMethod.get());
                    vm.selectedItem = vm.showList[0];
                    vm.firstRequest = false;
                }
            }, function (error) {}, [{ property: vm.keyProperty.get(), value: id }]);
        }

        // Autosearch control
        var planedUpdate;

        function cleanPlannedUpdate() {
            if (planedUpdate) {
                $timeout.cancel(planedUpdate);
                planedUpdate = null;
            }
        }

        function createPlannedUpdate(resolve, reject, searchText) {
            planedUpdate = $timeout(vm.updateData, 500, true, { search: searchText, resolve: resolve, reject: reject });
        }

        function createPlannedInsert(resolve, reject, searchText) {
            planedUpdate = $timeout(getInitialData, 500, true, { search: searchText, resolve: resolve, reject: reject });
        }

        vm.searchItems = function (searchText) {
            if (searchText && vm.loadAllItems.get()) {
                var items = vm.items.filter(function (e) {
                    return e[vm.componentConstruction.searchProperties[0]].indexOf(searchText) >= 0;
                });
                return items;
            } else if (searchText) {
                return new Promise(function (resolve, reject) {
                    setValueModel(null);
                    cleanPlannedUpdate();
                    createPlannedUpdate(resolve, reject, searchText);
                });
            }
            return new Promise(function (resolve, reject) {
                setValueModel(null);
                cleanPlannedUpdate();
                createPlannedInsert(resolve, reject, searchText);
            });
        };

        vm.changeSelectedItem = function () {
            var entity = vm.entityList.filter(function (D_entity) {
                return vm.selectedItem == vm.mappingMethod.get()(D_entity);
            })[0];
            if (!vm.canCreateNewEntity.get()) {
                if (vm.selectedItem) setValueModel(vm.queryDetails.resource.getId(entity), entity);else setValueModel(null);
            } else {
                if (vm.onChange) vm.onChange({ oldValue: null, newValue: vm.selectedItem, entity: entity });

                if (entity && vm.selectedItem) setValueModel(vm.queryDetails.resource.getId(entity), entity);
            }
        };

        vm.onFocus = function ($event) {
            if ($event.target && $event.target.value && $event.target.value.length > 0 && $event.type == 'click') $event.target.select();
        };

        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = ['$timeout'];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            queryDetails: '<',
            componentConstruction: '<',
            componentBindingOut: '=',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixAutocomplete/entifixAutocomplete.html',
        template: '<div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}"> \
                        <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                        <div ng-if="vm.isForm.get()"> \
                            <div ng-if="vm.canShowEditableFields.get()" ng-click="vm.onFocus($event)"> \
                                <md-autocomplete \
                                    md-floating-label={{vm.title.get()}} \
                                    md-input-name={{vm.name.get()}} \
                                    md-min-length="vm.minLengthRequest.get()" \
                                    md-input-minlength="{{vm.minLength.get()}}" \
                                    md-input-maxlength="{{vm.maxLength.get()}}" \
                                    md-no-cache="vm.noCache.get()" \
                                    md-selected-item="vm.selectedItem" \
                                    md-search-text="vm.searchText" \
                                    md-items="item in vm.searchItems(vm.searchText)" \
                                    md-item-text="item" \
                                    md-selected-item-change="vm.changeSelectedItem()" \
                                    ng-required="vm.isRequired.get()" \
                                    md-require-match="vm.requiredMatch.get()" \
                                    placeholder="{{vm.placeholder.get()}}" \
                                    ng-disabled="vm.disabled.get()"> \
                                    <md-item-template> \
                                        <span md-highlight-text="vm.searchText" md-highlight-flags="^i">{{item}}</span> \
                                    </md-item-template> \
                                    <md-not-found> \
                                        <div> \
                                            {{vm.notFoundText.get()}} \
                                        </div> \
                                    </md-not-found> \
                                    <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                        <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                        <div ng-message="md-require-match">{{vm.requiredMatchMessage.get()}}</div> \
                                        <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                        <div ng-message="maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                    </div> \
                                </md-autocomplete> \
                            </div> \
                            <div ng-if="!vm.canShowEditableFields.get()"> \
                                <label>{{vm.title.get()}}</label><br/> \
                                <strong>{{vm.getDisplayValue()}}</strong> \
                            </div> \
                        </div> \
                        <div ng-if="!vm.isForm.get()" ng-click="vm.onFocus($event)"> \
                            <md-autocomplete \
                                md-floating-label={{vm.title.get()}} \
                                md-input-name={{vm.name.get()}} \
                                md-min-length="vm.minLengthRequest.get()" \
                                md-input-minlength="{{vm.minLength.get()}}" \
                                md-input-maxlength="{{vm.maxLength.get()}}" \
                                md-no-cache="vm.noCache.get()" \
                                md-selected-item="vm.selectedItem" \
                                md-search-text="vm.searchText" \
                                md-items="item in vm.searchItems(vm.searchText)" \
                                md-item-text="item" \
                                md-selected-item-change="vm.changeSelectedItem()" \
                                ng-required="vm.isRequired.get()" \
                                md-require-match="vm.requiredMatch.get()" \
                                placeholder="{{vm.placeholder.get()}}" \
                                ng-disabled="vm.disabled.get()"> \
                                <md-item-template> \
                                    <span md-highlight-text="vm.searchText" md-highlight-flags="^i">{{item}}</span> \
                                </md-item-template> \
                                <md-not-found> \
                                    {{vm.notFoundText.get()}} \
                                </md-not-found> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-require-match">{{vm.requiredMatchMessage.get()}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                    <div ng-message="maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                </div> \
                            </md-autocomplete> \
                        </div> \
                    </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixAutocomplete', component);
})();
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    componentController.$inject = ['$stateParams', '$state', '$timeout', 'EntifixEntityModal', 'EntifixNotification', '$rootScope'];

    function componentController($stateParams, $state, $timeout, EntifixEntityModal, EntifixNotification, $rootScope) {
        var vm = this;

        vm.$onInit = function () {
            setdefaults();
            activate();
        };

        // Init Methods
        // ==============================================================================================================================================================

        function setdefaults() {
            // Defaults for table =======================================================================================================================================

            vm.componentConstruction.reload = vm.reload;

            if (checkDefaultTableConstruction('search')) {
                if (!vm.tableComponentConstruction.search) vm.tableComponentConstruction.search = {};
            }

            if (checkDefaultTableConstruction('edit')) {
                if (!vm.tableComponentConstruction.edit) vm.tableComponentConstruction.edit = {};

                var personalizeEditTable = vm.tableComponentConstruction.edit.customAction;

                vm.tableComponentConstruction.edit.customAction = function (entity) {
                    if (personalizeEditTable) personalizeEditTable(entity);else {
                        vm.entityQueryDetails.resource.loadAsResource(entity[vm.queryDetails.resource.getKeyProperty.get()], function (entity) {
                            if (vm.isModal.get()) vm.openModal(entity);else vm.changeToSingleView(entity);
                        });
                    }
                };
            }

            if (checkDefaultTableConstruction('add')) {
                if (!vm.tableComponentConstruction.add) vm.tableComponentConstruction.add = {};

                var personalizeAddTable = vm.tableComponentConstruction.add.customAction;

                vm.tableComponentConstruction.add.customAction = function () {
                    if (personalizeAddTable) personalizeAddTable();else {
                        if (vm.isModal.get()) vm.openModal();else vm.changeToSingleView();
                    }
                };
            }

            if (checkDefaultTableConstruction('remove')) {
                if (!vm.tableComponentConstruction.remove) vm.tableComponentConstruction.remove = {};

                var personalizeRemoveTable = vm.tableComponentConstruction.remove.customAction;

                if (personalizeRemoveTable) vm.tableComponentConstruction.remove.customAction = function (entity) {
                    personalizeRemoveTable(entity);
                };
            };

            if (vm.isProcessEntity.get()) {
                if (checkDefaultTableConstruction('process')) {
                    if (!vm.tableComponentConstruction.process) vm.tableComponentConstruction.process = {};

                    var personalizeProcessTable = vm.tableComponentConstruction.process.customAction;

                    if (personalizeProcessTable) vm.tableComponentConstruction.process.customAction = function (entity) {
                        personalizeProcessTable(entity);
                    };
                };
            }

            if (!vm.tableQueryDetails) vm.tableQueryDetails = vm.queryDetails;

            if (!vm.entityQueryDetails) vm.entityQueryDetails = vm.queryDetails;

            if (!vm.isModal.get()) {
                // Defaults for entity form =============================================================================================================================
                if (checkDefaultEntityConstruction('cancel')) {
                    if (!vm.entityComponentConstruction.cancel) vm.entityComponentConstruction.cancel = {};

                    var personalizeCancelEntity = vm.entityComponentConstruction.cancel.customAction;

                    vm.entityComponentConstruction.cancel.customAction = function () {
                        if (personalizeCancelEntity) personalizeCancelEntity();else {
                            if (vm.entityQueryDetails.resource.isNewEntity(vm.entityComponentBindingOut.entity.get())) vm.changeToMainView();else loadEntity();
                        }
                    };
                }

                if (checkDefaultEntityConstruction('ok')) {
                    if (!vm.entityComponentConstruction.ok) vm.entityComponentConstruction.ok = {};

                    var personalizeOkEntity = vm.entityComponentConstruction.ok.customAction;

                    vm.entityComponentConstruction.ok.customAction = function () {
                        if (personalizeOkEntity) personalizeOkEntity();else vm.changeToMainView();
                    };
                }

                if (checkDefaultEntityConstruction('edit')) {
                    if (!vm.entityComponentConstruction.edit) vm.entityComponentConstruction.edit = {};

                    var personalizeEditEntity = vm.entityComponentConstruction.edit.customAction;

                    if (personalizeEditEntity) vm.entityComponentConstruction.edit.customAction = function (entity) {
                        personalizeEditEntity(entity);
                    };
                }

                if (checkDefaultEntityConstruction('save')) {
                    if (!vm.entityComponentConstruction.save) vm.entityComponentConstruction.save = {};

                    vm.entityComponentConstruction.save.autoChange = false;

                    var personalizeSaveEntity = vm.entityComponentConstruction.save.customAction;

                    if (personalizeSaveEntity) vm.entityComponentConstruction.save.customAction = function (entity) {
                        personalizeSaveEntity(entity);
                    };
                }

                if (checkDefaultEntityConstruction('remove')) {
                    if (!vm.entityComponentConstruction.remove) vm.entityComponentConstruction.remove = {};

                    var personalizeRemoveEntity = vm.entityComponentConstruction.remove.customAction;

                    if (personalizeRemoveEntity) vm.entityComponentConstruction.remove.customAction = function (entity) {
                        personalizeRemoveEntity(entity);
                    };
                }

                if (vm.isProcessEntity.get()) {
                    if (!vm.entityComponentConstruction.process) vm.entityComponentConstruction.process = {};

                    var personalizeProcessEntity = vm.entityComponentConstruction.process.customAction;

                    vm.entityComponentConstruction.process.customAction = function (entity, setViewState) {
                        if (personalizeProcessEntity) personalizeProcessEntity(entity, setViewState);else {
                            var ent = {};
                            ent[vm.entityQueryDetails.resource.getKeyProperty.get()] = entity[vm.entityQueryDetails.resource.getKeyProperty.get()];
                            ent[vm.entityQueryDetails.resource.getOpProperty.get()] = 'PROCESAR';
                            saveModal(ent, null, setViewState);
                        }
                    };
                }

                vm.tableComponentConstruction.blockTableOnChangeView = true;
                vm.entityComponentConstruction.canViewHistory = vm.canViewHistory;

                vm.entityQueryDetails.resource.listenSaved(function (args) {
                    if (vm.entityComponentConstruction.save.autoChange == false) vm.changeToSingleView(args.fullResponse.data.data);else vm.changeToMainView();
                });
                vm.entityQueryDetails.resource.listenDeleted(function () {
                    if (vm.entityComponentConstruction.remove.autoChange != false) vm.changeToMainView();
                });
            }
        };

        function checkDefaultTableConstruction(defaultValueName) {
            if (vm.tableComponentConstruction.useDefaults == null || vm.tableComponentConstruction.useDefaults == true) return true;

            if (vm.tableComponentConstruction.defaultValuesAllowed && vm.tableComponentConstruction.defaultValuesAllowed.length > 0) return vm.tableComponentConstruction.defaultValuesAllowed.filter(function (valueName) {
                return valueName == defaultValueName;
            }).length > 0;
        }

        function checkDefaultEntityConstruction(defaultValueName) {
            if (vm.entityComponentConstruction.useDefaults == null || vm.entityComponentConstruction.useDefaults == true) return true;

            if (vm.entityComponentConstruction.defaultValuesAllowed && vm.entityComponentConstruction.defaultValuesAllowed.length > 0) return vm.entityComponentConstruction.defaultValuesAllowed.filter(function (valueName) {
                return valueName == defaultValueName;
            }).length > 0;
        }

        function activate() {
            if (!vm.isModal.get()) {
                if ($stateParams[vm.paramName.get()]) {
                    _state = _states.singleView; // The change of the state compile the component     

                    var initForm = function initForm() {
                        if (vm.entityComponentBindingOut) {
                            if ($stateParams[vm.paramName.get()] != '-1' && $stateParams[vm.paramName.get()] != '0') loadEntity();else createEntity();
                        } else {
                            console.log('Ciclo de inicializacion del formulario');
                            $timeout(initForm, 100);
                        }
                    };

                    initForm();
                } else {
                    _state = _states.mainView;
                }
            }
        };

        function loadEntity() {
            vm.entityQueryDetails.resource.loadAsResource($stateParams[vm.paramName.get()], function (entity) {
                vm.entityComponentBindingOut.entity.set(entity);
            });
            vm.entityComponentBindingOut.showEditableFields.set(false);
        };

        function createEntity() {
            vm.entityComponentBindingOut.entity.set({});
            vm.entityComponentBindingOut.showEditableFields.set(true);
        };

        // ==============================================================================================================================================================


        // Properties & fields
        // ==============================================================================================================================================================

        // Fields
        var _states = { mainView: 1, singleView: 2 };
        var _state = _states.mainView;

        // Properties
        vm.onMainView = {
            get: function get() {
                return _state == _states.mainView;
            }
        };

        vm.onSingleView = {
            get: function get() {
                return _state == _states.singleView;
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter(_state);
                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                return 'Catálogo';
            }
        };

        vm.icon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.icon) {
                    if (vm.componentConstruction.icon.getter) return vm.componentConstruction.icon.getter(_state);
                    return vm.componentConstruction.icon;
                }

                return '';
            }
        };

        vm.paramName = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.paramName) return vm.componentConstruction.paramName;

                //Default value
                return 'id';
            }
        };

        vm.useMainTab = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.useMainTab != null) return vm.componentConstruction.useMainTab;

                return true;
            }
        };

        vm.showBar = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.showBar) {
                    if (vm.componentConstruction.showBar.getter) return vm.componentConstruction.showBar.getter(_state);
                    return vm.componentConstruction.showBar;
                }

                return true;
            }
        };

        vm.isModal = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isModal != null) return vm.componentConstruction.isModal;

                return false;
            }
        };

        vm.closeWhenSaving = {
            get: function get() {
                if (vm.entityComponentConstruction && vm.entityComponentConstruction.closeWhenSaving != null) return vm.entityComponentConstruction.closeWhenSaving;

                return true;
            }
        };

        vm.isProcessEntity = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isProcessEntity != null) return vm.componentConstruction.isProcessEntity;

                return false;
            }
        };

        vm.noFilterTooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.noFilterTooltip != null) return vm.componentConstruction.noFilterTooltip;

                return 'Quitar todos los filtros';
            }
        };

        vm.showNoFilter = {
            get: function get(skip) {
                if (vm.componentConstruction && vm.componentConstruction.showNoFilter != null) return vm.componentConstruction.showNoFilter;else {
                    if (!skip) {
                        if ($stateParams[vm.paramName.get()]) return false;

                        return true;
                    } else return true;
                }
            }
        };

        var _canViewHistory = true;
        vm.canViewHistory = {
            get: function get() {
                if (_canViewHistory) {
                    if ($stateParams[vm.paramName.get()]) return true;
                    return false;
                }
                return false;
            },

            set: function set(value) {
                _canViewHistory = value;
            }
        };

        vm.historyTooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.historyTooltip) return vm.componentConstruction.historyTooltip;

                //Default value
                return 'Mostrar Bitácora';
            }
        };

        vm.history = {
            get: function get() {
                return $rootScope.showHistory;
            },
            set: function set() {
                $rootScope.showHistory = !$rootScope.showHistory;
            }
        };

        vm.reload = {
            invoke: function invoke() {
                setdefaults();
            }

            // ==============================================================================================================================================================


            // Methods
            // ==============================================================================================================================================================

        };vm.changeToMainView = function () {
            $state.go($state.current.name, _defineProperty({}, vm.paramName.get(), null));
        };

        vm.changeToSingleView = function (entity) {
            var navid = -1;

            if (entity) navid = vm.entityQueryDetails.resource.getId(entity);

            if (vm.onSingleView.get() || vm.tableComponentBindingOut.allowedActions.canEdit.get() || vm.tableComponentBindingOut.allowedActions.canAdd.get() && navid == -1) $state.go($state.current.name, _defineProperty({}, vm.paramName.get(), navid));
        };

        vm.openModal = function (entity, event) {
            // Defaults for modal =======================================================================================================================================
            // Component Construction Configuration
            if (!vm.entityComponentConstruction) vm.entityComponentConstruction = {};

            if (checkDefaultEntityConstruction('cancel')) if (!vm.entityComponentConstruction.cancel) vm.entityComponentConstruction.cancel = {};

            if (checkDefaultEntityConstruction('edit')) if (!vm.entityComponentConstruction.edit) vm.entityComponentConstruction.edit = {};

            if (checkDefaultEntityConstruction('ok')) if (!vm.entityComponentConstruction.ok) vm.entityComponentConstruction.ok = {};

            if (checkDefaultEntityConstruction('save')) {
                if (!vm.entityComponentConstruction.save) vm.entityComponentConstruction.save = {};

                vm.entityComponentConstruction.save.customAction = function (entity, defaultOk, setViewState) {
                    saveModal(entity, defaultOk, setViewState);
                };
            }

            if (checkDefaultEntityConstruction('remove')) {
                if (!vm.entityComponentConstruction.remove) vm.entityComponentConstruction.remove = {};

                vm.entityComponentConstruction.remove.customAction = function (entity, defaultOk, setViewState) {
                    EntifixNotification.confirm('Está seguro de eliminar el registro', 'Confirmación requerida', function () {
                        vm.entityQueryDetails.resource.deleteEntity(entity, function () {
                            defaultOk();$timeout(vm.tableComponentBindingOut.pager.reload(), 500);
                        });
                    });
                };
            }

            vm.entityComponentConstruction.event = event;

            if (vm.isProcessEntity.get()) {
                if (!vm.entityComponentConstruction.process) vm.entityComponentConstruction.process = {};

                vm.entityComponentConstruction.process.customAction = function (entity, defaultOk, setViewState) {
                    entity[vm.entityQueryDetails.resource.getOpProperty.get()] = 'PROCESAR';
                    saveModal(entity, defaultOk, setViewState);
                };
            }

            // Query Details Configuration
            if (!vm.entityQueryDetails) vm.entityQueryDetails = vm.queryDetails;

            // Component Binding Out Configuration
            if (!vm.entityComponentBindingOut) vm.entityComponentBindingOut = {};
            vm.entityComponentBindingOut.object = entity;

            // Component Behavior Configuration
            if (!vm.entityComponentBehavior) vm.entityComponentBehavior = {};

            // Creating new instance of EntifixEntityModal factory
            vm.modal = new EntifixEntityModal(vm.entityComponentConstruction, vm.entityComponentBehavior, vm.entityComponentBindingOut, vm.entityQueryDetails);

            // Call openModal method for call the modal behavior in its controller
            vm.modal.openModal();
        };

        function saveModal(entity, defaultOk, setViewState) {
            vm.entityQueryDetails.resource.saveEntity(entity, function (response, saveSuccess) {
                if (saveSuccess) {
                    if (defaultOk && vm.closeWhenSaving.get()) defaultOk();else if (response && response.data.data) setViewState(true, response.data.data);
                    if (vm.tableComponentBindingOut && vm.tableComponentBindingOut.pager) $timeout(vm.tableComponentBindingOut.pager.reload(), 500);
                }
            });
        }

        // ==============================================================================================================================================================
    };

    var component = {
        //templateUrl: 'dist/shared/components/entifixCatalog/entifixCatalog.html',
        template: ' \
                <!-- Main Tab Mode --> \
                    <div layout="row" ng-if="bindCtrl.useMainTab.get()"> \
                        <div flex="5"></div> \
                        <div flex="90"> \
                            <div ng-if="!bindCtrl.isModal.get()"> \
                                <md-toolbar ng-if="bindCtrl.showBar.get()"> \
                                    <div class="md-toolbar-tools" md-colors="{color: \'default-primary-50\'}" layout> \
                                        <div flex layout layout-align="start center"> \
                                            <md-button class="md-icon-button"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon></md-button> \
                                            <h2>&nbsp;{{bindCtrl.title.get()}}</h2> \
                                        </div> \
                                        <div layout layout-align="end end" ng-if="bindCtrl.showNoFilter.get()"> \
                                            <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.tableComponentBindingOut.cleanFilters()" aria-label="{{bindCtrl.tableComponentBindingOut.noFilterTooltip()}}"> \
                                                <md-tooltip>{{bindCtrl.noFilterTooltip.get()}}</md-tooltip> \
                                                <md-icon class="material-icons">delete_sweep</md-icon> \
                                            </md-button> \
                                        </div> \
                                        <div layout layout-align="end end" ng-if="bindCtrl.canViewHistory.get()"> \
                                            <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.history.set()"> \
                                                <md-tooltip>{{bindCtrl.historyTooltip.get()}}</md-tooltip> \
                                                <md-icon class="material-icons">history</md-icon> \
                                            </md-button> \
                                        </div> \
                                    </div> \
                                </md-toolbar> \
                                <div layout="column" ng-if="bindCtrl.onMainView.get()"> \
                                    <entifix-table \
                                        query-details="bindCtrl.tableQueryDetails" \
                                        component-construction="bindCtrl.tableComponentConstruction" \
                                        component-behavior="bindCtrl.tableComponentBehavior" \
                                        component-binding-out="bindCtrl.tableComponentBindingOut"> \
                                    </entifix-table> \
                                </div> \
                                <div layout="column" ng-if="bindCtrl.onSingleView.get()"> \
                                    <entifix-entity-form \
                                        query-details="bindCtrl.entityQueryDetails" \
                                        component-construction="bindCtrl.entityComponentConstruction"  \
                                        component-behavior="bindCtrl.entityComponentBehavior" \
                                        component-binding-out="bindCtrl.entityComponentBindingOut"> \
                                    </entifix-entity-form> \
                                </div> \
                            </div> \
                            <div ng-if="bindCtrl.isModal.get()"> \
                                <md-toolbar ng-if="bindCtrl.showBar.get()"> \
                                    <div class="md-toolbar-tools" md-colors="{color: \'default-primary-50\'}"> \
                                        <div flex layout layout-align="start center"> \
                                            <md-button class="md-icon-button"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon></md-button> \
                                            <h2>&nbsp;{{bindCtrl.title.get()}}</h2> \
                                        </div> \
                                        <div layout layout-align="end end" ng-if="bindCtrl.showNoFilter.get()"> \
                                            <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.tableComponentBindingOut.cleanFilters()" aria-label="{{bindCtrl.tableComponentBindingOut.noFilterTooltip()}}"> \
                                                <md-tooltip>{{bindCtrl.noFilterTooltip.get()}}</md-tooltip> \
                                                <md-icon class="material-icons">delete_sweep</md-icon> \
                                            </md-button> \
                                        </div> \
                                    </div> \
                                </md-toolbar> \
                                <div layout="column"> \
                                    <entifix-table \
                                        query-details="bindCtrl.tableQueryDetails" \
                                        component-construction="bindCtrl.tableComponentConstruction" \
                                        component-behavior="bindCtrl.tableComponentBehavior" \
                                        component-binding-out="bindCtrl.tableComponentBindingOut"> \
                                    </entifix-table> \
                                </div> \
                            </div> \
                        </div> \
                        <div flex="5"></div> \
                    </div> \
                    <!-- No Main Tab Mode --> \
                    <div ng-if="!bindCtrl.useMainTab.get()"> \
                        <md-content ng-if="!bindCtrl.isModal.get()"> \
                            <div layout> \
                                <div flex layout layout-align="start center"> \
                                    <span class="md-headline" ng-if="bindCtrl.showBar.get()"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon>{{"  " + bindCtrl.title.get()}}</span> \
                                </div> \
                                <div layout layout-align="end end" ng-if="bindCtrl.showNoFilter.get()"> \
                                    <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.tableComponentBindingOut.cleanFilters()" aria-label="{{bindCtrl.tableComponentBindingOut.noFilterTooltip()}}"> \
                                        <md-tooltip>{{bindCtrl.noFilterTooltip.get()}}</md-tooltip> \
                                        <md-icon class="material-icons">delete_sweep</md-icon> \
                                    </md-button> \
                                </div> \
                            </div> \
                            <md-content layout-padding> \
                                <div layout="column" ng-if="bindCtrl.onMainView.get()"> \
                                    <entifix-table \
                                        query-details="bindCtrl.tableQueryDetails" \
                                        component-construction="bindCtrl.tableComponentConstruction"  \
                                        component-behavior="bindCtrl.tableComponentBehavior" \
                                        component-binding-out="bindCtrl.tableComponentBindingOut"> \
                                    </entifix-table> \
                                </div>  \
                                <div layout="column" ng-if="bindCtrl.onSingleView.get()"> \
                                    <entifix-entity-form \
                                        query-details="bindCtrl.entityQueryDetails" \
                                        component-construction="bindCtrl.entityComponentConstruction" \
                                        component-behavior="bindCtrl.entityComponentBehavior" \
                                        component-binding-out="bindCtrl.entityComponentBindingOut"> \
                                    </entifix-entity-form> \
                                </div> \
                            </md-content> \
                        </md-content> \
                        <md-content ng-if="bindCtrl.isModal.get()"> \
                            <div layout> \
                                <div flex layout layout-align="start center"> \
                                    <span class="md-headline" ng-if="bindCtrl.showBar.get()"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon>&nbsp;{{bindCtrl.title.get()}}</span> \
                                </div> \
                                <div layout layout-align="end end" ng-if="bindCtrl.showNoFilter.get(true)"> \
                                    <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.tableComponentBindingOut.cleanFilters()" aria-label="{{bindCtrl.tableComponentBindingOut.noFilterTooltip()}}"> \
                                        <md-tooltip>{{bindCtrl.noFilterTooltip.get()}}</md-tooltip> \
                                        <md-icon class="material-icons">delete_sweep</md-icon> \
                                    </md-button> \
                                </div> \
                            </div> \
                            <md-content layout-padding> \
                                <div layout="row"> \
                                    <div flex> \
                                        <div layout="column"> \
                                            <entifix-table \
                                                query-details="bindCtrl.tableQueryDetails" \
                                                component-construction="bindCtrl.tableComponentConstruction"  \
                                                component-behavior="bindCtrl.tableComponentBehavior" \
                                                component-binding-out="bindCtrl.tableComponentBindingOut"> \
                                            </entifix-table> \
                                        </div> \
                                    </div> \
                                </div> \
                            </md-content> \
                        </md-content> \
                    </div>',
        controller: componentController,
        controllerAs: 'bindCtrl',
        bindings: {
            componentConstruction: '<',
            queryDetails: '<',
            tableComponentConstruction: '<',
            tableComponentBehavior: '<',
            tableComponentBindingOut: '=',
            tableQueryDetails: '=',
            entityComponentConstruction: '<',
            entityComponentBehavior: '<',
            entityComponentBindingOut: '=',
            entityQueryDetails: '='
        }
    };

    //Register component
    angular.module('entifix-js').component('entifixCatalog', component);
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller($mdConstant) {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);
        vm.separatorsDefault = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        //Label - Input Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        //Error validations
        vm.maxChips = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxChips) return vm.componentConstruction.maxChips;

                //Default value
                return null;
            }
        };

        vm.maxChipsMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxChipsMessage) {
                    if (vm.componentConstruction.maxChipsMessage.getter) return vm.componentConstruction.maxChipsMessage.getter();

                    if (vm.componentConstruction.maxChipsMessage.text) return vm.componentConstruction.maxChipsMessage.text;
                }

                //Default value
                return 'Ha alcanzado el número máximo de elementos';
            }
        };

        vm.name = {
            get: function get() {
                return 'entifixchip' + randomNumber;
            }
        };

        vm.transformChip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.transformChip) return vm.componentConstruction.transformChip;

                //Default value
                return null;
            },

            invoke: function invoke(chip, index) {
                if (vm.componentConstruction && vm.componentConstruction.transformChip) vm.componentConstruction.transformChip(chip, index);
            }
        };

        vm.onAdd = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.onAdd) return vm.componentConstruction.onAdd;

                //Default value
                return null;
            },

            invoke: function invoke(chip, index) {
                if (vm.componentConstruction && vm.componentConstruction.onAdd) vm.componentConstruction.onAdd(chip, index);
            }
        };

        vm.onRemove = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.onRemove) return vm.componentConstruction.onRemove;

                //Default value
                return null;
            },

            invoke: function invoke(chip, index) {
                if (vm.componentConstruction && vm.componentConstruction.onRemove) vm.componentConstruction.onRemove(chip, index);
            }
        };

        vm.onSelect = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.onSelect) return vm.componentConstruction.onSelect;

                //Default value
                return null;
            },

            invoke: function invoke(chip, index) {
                if (vm.componentConstruction && vm.componentConstruction.onSelect) vm.componentConstruction.onSelect(chip, index);
            }
        };

        vm.placeholder = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.placeholder) return vm.componentConstruction.placeholder;

                //Default value
                return '';
            }
        };

        vm.secondaryPlaceholder = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.secondaryPlaceholder) return vm.componentConstruction.secondaryPlaceholder;

                //Default value
                return vm.placeholder.get();
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.removable = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.removable != null) return vm.componentConstruction.removable;

                //Default value
                return true;
            }
        };

        vm.readOnly = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.readOnly) return vm.componentConstruction.readOnly;

                //Default value
                return false;
            }
        };

        vm.enableChipEdit = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.enableChipEdit != null) return vm.componentConstruction.enableChipEdit;

                //Default value
                return 'true';
            }
        };

        vm.addOnBlur = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.addOnBlur != null) return vm.componentConstruction.addOnBlur;

                //Default value
                return true;
            }
        };

        vm.separators = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.separators) return vm.componentConstruction.separators;

                //Default value
                return vm.separatorsDefault;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };
        //=======================================================================================================================================================================


        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function () {
            if (vm.init) vm.init();
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        vm.getStringValue = function () {
            if (Array.isArray(vm.valueModel) && vm.valueModel.length > 0) {
                var value = '';
                vm.valueModel.forEach(function (element) {
                    value += element + ' ';
                });
                return value;
            }
            return '';
        };

        vm.tC = function (chip, index) {
            if (vm.transformChip.get()) vm.transformChip.invoke(chip, index);
        };

        vm.oAdd = function (chip, index) {
            if (vm.onAdd.get()) vm.onAdd.invoke(chip, index);
        };

        vm.oRemove = function (chip, index) {
            if (vm.onRemove.get()) vm.onRemove.invoke(chip, index);
        };

        vm.oSelect = function (chip, index) {
            if (vm.onSelect.get()) vm.onSelect.invoke(chip, index);
        };

        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = ['$mdConstant'];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixChip/entifixChip.html',
        template: '<md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <md-chips \
                            ng-if="vm.canShowEditableFields.get()" \
                            name="{{vm.name.get()}}" \
                            ng-model="vm.valueModel" \
                            md-transform-chip="vm.tC($chip, $index)" \
                            placeholder="{{vm.placeholder.get()}}" \
                            secondary-placeholder="{{vm.secondaryPlaceholder.get()}}" \
                            md-removable="vm.removable.get()" \
                            readonly="vm.readOnly.get()" \
                            md-enable-chip-edit="{{vm.enableChipEdit.get()}}" \
                            md-max-chips="{{vm.maxChips.get()}}" \
                            md-add-on-blur="{{vm.addOnBlur.get()}}" \
                            md-on-add="vm.oAdd$chip()" \
                            md-on-remove="vm.oRemove($chip, $index)" \
                            md-on-select="vm.oSelect($chip, $index)" \
                            md-separator-keys="vm.separators.get()"> \
                            <md-chip-template> \
                                {{$chip}} \
                                &nbsp&nbsp \
                                </md-chip-template> \
                        </md-chips> \
                        <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                            <div ng-message="md-max-chips">{{vm.maxChipsMessage.get()}}</div> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.placeholder.get()}}</label><br/> \
                            <strong>{{vm.getStringValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <md-chips \
                            name="{{vm.name.get()}}" \
                            ng-model="vm.valueModel" \
                            md-transform-chip="vm.tC($chip, $index)" \
                            placeholder="{{vm.placeholder.get()}}" \
                            secondary-placeholder="{{vm.secondaryPlaceholder.get()}}" \
                            md-removable="vm.removable.get()" \
                            readonly="vm.readOnly.get()" \
                            md-enable-chip-edit="{{vm.enableChipEdit.get()}}" \
                            md-max-chips="{{vm.maxChips.get()}}" \
                            md-add-on-blur="{{vm.addOnBlur.get()}}" \
                            md-on-add="vm.oAdd($chip, $index)" \
                            md-on-remove="vm.oRemove($chip, $index)" \
                            md-on-select="vm.oSelect($chip, $index)" \
                            md-separator-keys="vm.separators.get()"> \
                            <md-chip-template> \
                                {{$chip}} \
                                &nbsp&nbsp \
                                </md-chip-template> \
                        </md-chips> \
                        <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                            <div ng-message="md-max-chips">{{vm.maxChipsMessage.get()}}</div> \
                        </div> \
                    </div> \
                    <br/>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixChip', component);
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller() {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        //Label - Input Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        vm.isSwitch = {
            get: function get() {
                if (vm.componentConstruction.isSwitch) return vm.componentConstruction.isSwitch;

                //Default value
                return false;
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixcheckboxswitch' + randomNumber;
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.valueTitle = {
            get: function get() {
                if (vm.title.get() && vm.title.get() != '') {
                    if (vm.includeValue.get()) {
                        var bool = 'No';
                        if (vm.valueModel && vm.title.get() && vm.title.get() != '') bool = 'Si';
                        return vm.title.get() + ': ' + bool;
                    } else return vm.title.get();
                }
                return '';
            }
        };

        vm.includeValue = {
            get: function get() {
                if (vm.componentConstruction.includeValue != null) return vm.componentConstruction.includeValue;

                //Default value
                return true;
            }
        };

        vm.getValue = function () {
            if (vm.valueModel) return 'Si';
            return 'No';
        };
        //=======================================================================================================================================================================


        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function () {
            if (vm.init) vm.init();
        };

        vm.runOnChangeTrigger = function () {
            if (vm.onChange) vm.onChange({ value: vm.valueModel });
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = [];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixCheckboxSwitch/entifixCheckboxSwitch.html',
        template: '<div ng-if="!vm.isSwitch.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <div ng-show="vm.canShowEditableFields.get()" class="md-checkbox-padding"> \
                            <md-checkbox  \
                                ng-model="vm.valueModel" \
                                name="{{vm.name.get()}}" \
                                ng-checked="vm.valueModel" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                class="checkbox-default"> \
                                {{vm.valueTitle.get()}} \
                            </md-checkbox> \
                        </div> \
                        <div ng-hide="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}<label><br/> \
                            <strong>{{vm.getValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()" class="md-checkbox-padding"> \
                        <md-checkbox  \
                            ng-model="vm.valueModel" \
                            name="{{vm.name.get()}}" \
                            ng-checked="vm.valueModel" \
                            aria-label="{{vm.name.get()}}" \
                            ng-change="vm.runOnChangeTrigger()" \
                            class="checkbox-default"> \
                            {{vm.valueTitle.get()}} \
                        </md-checkbox> \
                    </div> \
                </div> \
                <div ng-if="vm.isSwitch.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <div ng-show="vm.canShowEditableFields.get()"> \
                            <md-switch \
                                ng-model="vm.valueModel" \
                                name="{{vm.name.get()}}" \
                                ng-checked="vm.valueModel" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                class="switch-default"> \
                                {{vm.valueTitle.get()}} \
                            </md-switch> \
                        </div> \
                        <div ng-hide="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}<label><br/> \
                            <strong>{{vm.getValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <md-switch \
                            ng-model="vm.valueModel" \
                            name="{{vm.name.get()}}" \
                            ng-checked="vm.valueModel" \
                            aria-label="{{vm.name.get()}}" \
                            ng-change="vm.runOnChangeTrigger()" \
                            class="switch-default"> \
                            {{vm.valueTitle.get()}} \
                        </md-switch> \
                    </div> \
                </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixCheckboxSwitch', component);
})();
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    function componentcontroller(mdcDateTimeDialog, $scope) {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        vm.isRequired = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isRequired) return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };

        vm.requiredMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage) {
                    if (vm.componentConstruction.requiredMessage.getter) return vm.componentConstruction.requiredMessage.getter();

                    if (vm.componentConstruction.requiredMessage.text) return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.parseMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.parseMessage) {
                    if (vm.componentConstruction.parseMessage.getter) return vm.componentConstruction.parseMessage.getter();

                    if (vm.componentConstruction.parseMessage.text) return vm.componentConstruction.parseMessage.text;
                }

                //Default value
                if (vm.hasDate.get() && vm.hasTime.get()) return 'Este campo debe ser una fecha y hora válidas';else if (vm.hasDate.get() && !vm.hasTime.get()) return 'Este campo debe ser una fecha válida';else if (vm.hasTime.get() && !vm.hasDate.get()) return 'Este campo debe ser una hora válida';
            }
        };

        vm.isDisabled = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isDisabled) return vm.componentConstruction.isDisabled;

                //Default value
                return false;
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixdatetimepicker' + randomNumber;
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.disableParentScroll = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.disableParentScroll != null) return vm.componentConstruction.disableParentScroll;

                //Default value
                return true;
            }
        };

        vm.autoOk = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.autoOk != null) return vm.componentConstruction.autoOk;

                //Default value
                return true;
            }
        };

        vm.editInput = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.editInput) return vm.componentConstruction.editInput;

                //Default value
                return true;
            }
        };

        vm.clickOutsideToClose = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.clickOutsideToClose) return vm.componentConstruction.clickOutsideToClose;

                //Default value
                return false;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.nullValueLabel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel) return vm.componentConstruction.nullValueLabel;

                return 'SIN REGISTROS';
            }

            // Date Picker Configuration -------------------------------------------------------------------------------------------------------------------------------------------------
        };vm.hasDate = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.hasDate != null) return vm.componentConstruction.hasDate;

                //Default value
                return true;
            }
        };

        vm.placeholder = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.placeholder) {
                    if (vm.componentConstruction.placeholder.getter) return vm.componentConstruction.placeholder.getter();

                    if (vm.componentConstruction.placeholder.text) return vm.componentConstruction.placeholder.text;
                }

                //Default value
                var ph = '';
                if (vm.hasDate.get()) ph += 'dd/mm/aaaa';
                if (vm.hasTime.get() && vm.hasDate.get()) ph += ' hh:mm';else if (vm.hasTime.get()) ph += 'hh:mm';
                return ph;
            }
        };

        vm.minDate = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minDate) {
                    if (vm.componentConstruction.minDate.getter) return vm.componentConstruction.minDate.getter();

                    if (vm.componentConstruction.minDate.text) return vm.componentConstruction.minDate.text;
                }

                //Default value
                return '01/01/1900';
            }
        };

        vm.maxDate = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxDate) {
                    if (vm.componentConstruction.maxDate.getter) return vm.componentConstruction.maxDate.getter();

                    if (vm.componentConstruction.maxDate.text) return vm.componentConstruction.maxDate.text;
                }

                //Default value
                return '01/01/2100';
            }
        };

        vm.format = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.format) {
                    if (vm.componentConstruction.format.getter) return vm.componentConstruction.format.getter();

                    if (vm.componentConstruction.format.text) return vm.componentConstruction.format.text;
                }

                //Default value
                var format = '';
                if (vm.hasDate.get()) format += 'DD/MM/YYYY';
                if (vm.hasTime.get() && vm.hasDate.get()) format += ' HH';else if (vm.hasTime.get()) format += 'HH';
                if (vm.hasTime.get() && vm.shortTime.get()) format += ':mm a';else if (vm.hasTime.get()) format += ':mm';
                return format;
            }
        };

        vm.okText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.okText) {
                    if (vm.componentConstruction.okText.getter) return vm.componentConstruction.okText.getter();

                    if (vm.componentConstruction.okText.text) return vm.componentConstruction.okText.text;
                }

                //Default value
                return 'Aceptar';
            }
        };

        vm.todayText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.todayText) {
                    if (vm.componentConstruction.todayText.getter) return vm.componentConstruction.todayText.getter();

                    if (vm.componentConstruction.todayText.text) return vm.componentConstruction.todayText.text;
                }

                //Default value
                return 'Hoy';
            }
        };

        vm.cancelText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancelText) {
                    if (vm.componentConstruction.cancelText.getter) return vm.componentConstruction.cancelText.getter();

                    if (vm.componentConstruction.cancelText.text) return vm.componentConstruction.cancelText.text;
                }

                //Default value
                return 'Cancelar';
            }
        };

        vm.weekStart = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.weekStart) {
                    if (vm.componentConstruction.weekStart.getter) return vm.componentConstruction.weekStart.getter();

                    if (vm.componentConstruction.weekStart.text) return vm.componentConstruction.weekStart.text;
                }

                //Default value
                return "0";
            }
        };

        vm.weekDays = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.weekDays) return vm.componentConstruction.weekDays;

                //Default value
                return false;
            }
        };

        // Time Picker Configuration -------------------------------------------------------------------------------------------------------------------------------------------------
        vm.hasTime = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.hasTime != null) return vm.componentConstruction.hasTime;

                //Default value
                return true;
            }
        };

        vm.hasMinutes = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.hasMinutes != null) return vm.componentConstruction.hasMinutes;

                //Default value
                return true;
            }
        };

        vm.shortTime = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.shortTime != null) return vm.componentConstruction.shortTime;

                //Default value
                return true;
            }
        };
        //=======================================================================================================================================================================


        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function () {
            SetDefaultsValues();
            init();
        };

        //Default values
        function SetDefaultsValues() {};

        //Constructor
        function init() {};

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        vm.getDateString = function (skip) {
            if (vm.valueModel) {
                var dateValueModel = new Date(vm.valueModel);
                if (dateValueModel instanceof Date) {
                    var date = dateValueModel;
                    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                    var diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                    var hours = "";
                    var minutes = "";

                    if (vm.hasTime.get()) {
                        hours = date.getHours().toString();
                        minutes = date.getMinutes().toString();
                        if (hours.length < 2) hours = '0' + hours;
                        if (minutes.length < 2) minutes = '0' + minutes;

                        hours = parseInt(hours);

                        if (hours > 12) hours = (hours - 12).toString() + ':' + minutes + ' ' + 'pm';else if (hours == 12) hours = hours.toString() + ':' + minutes + ' ' + 'pm';else hours = hours.toString() + ':' + minutes + ' ' + 'am';
                    }

                    return date.getDate() + " de " + meses[date.getMonth()] + " de " + date.getFullYear() + " " + hours;
                } else return vm.valueModel;
            } else if (!skip) return vm.nullValueLabel.get();
        };

        vm.displayDialogEdit = function () {

            if (vm.hasDate.get()) {
                var _mdcDateTimeDialog$sh;

                mdcDateTimeDialog.show((_mdcDateTimeDialog$sh = {
                    date: vm.hasDate.get(),
                    time: vm.hasTime.get(),
                    minutes: vm.hasMinutes.get(),
                    format: vm.format.get(),
                    currentDate: vm.valueModel || moment().startOf('day'),
                    weekStart: vm.weekStart.get(),
                    shortTime: vm.shortTime.get(),
                    cancelText: vm.cancelText.get(),
                    todayText: vm.todayText.get(),
                    okText: vm.okText.get(),
                    amText: 'am',
                    pmText: 'pm',
                    showTodaysDate: '',
                    weekDays: vm.weekDays.get()
                }, _defineProperty(_mdcDateTimeDialog$sh, 'weekStart', vm.weekStart.get()), _defineProperty(_mdcDateTimeDialog$sh, 'disableParentScroll', vm.disableParentScroll.get()), _defineProperty(_mdcDateTimeDialog$sh, 'autoOk', vm.autoOk.get()), _defineProperty(_mdcDateTimeDialog$sh, 'editInput', vm.editInput.get()), _defineProperty(_mdcDateTimeDialog$sh, 'clickOutsideToClose', vm.clickOutsideToClose.get()), _mdcDateTimeDialog$sh)).then(function (date) {
                    vm.valueModel = new Date(date.toString());
                }, function () {
                    console.log('Selección cancelada');
                });
            } else {
                mdcDateTimeDialog.show({
                    date: vm.hasDate.get(),
                    time: vm.hasTime.get(),
                    minutes: vm.hasMinutes.get(),
                    format: vm.format.get(),
                    currentDate: vm.valueModel || moment().startOf('day'),
                    shortTime: vm.shortTime.get(),
                    cancelText: vm.cancelText.get(),
                    todayText: vm.todayText.get(),
                    okText: vm.okText.get(),
                    amText: 'am',
                    pmText: 'pm',
                    showTodaysDate: '',
                    disableParentScroll: vm.disableParentScroll.get(),
                    autoOk: vm.autoOk.get(),
                    clickOutsideToClose: vm.clickOutsideToClose.get()
                }).then(function (date) {
                    vm.valueModel = new Date(date.toString());
                }, function () {
                    console.log('Selección cancelada');
                });
            }
        };

        vm.runOnChangeTrigger = function () {
            if (vm.onChange) vm.onChange({ value: vm.valueModel });
        };

        $scope.$watch(function () {
            return vm.valueModel;
        }, function (newValue, oldValue) {
            if (vm.onChange) vm.onChange({ value: newValue });
        });
        //=======================================================================================================================================================================        
    };

    componentcontroller.$inject = ['mdcDateTimeDialog', '$scope'];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixDateTimePicker/entifixDateTimePicker.html',
        template: '<div ng-if="vm.isForm.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.canShowEditableFields.get()" layout layout-align="center center" class="datetimepicker"> \
                        <md-input-container flex> \
                            <label>{{vm.title.get() + ": " + vm.getDateString(true)}}</label> \
                            <input mdc-datetime-picker \
                                type="text" \
                                ng-model="vm.valueModel" \
                                id="{{vm.name.get()}}" \
                                name="{{vm.name.get()}}" \
                                format="{{vm.format.get()}}" \
                                short-time="vm.shortTime.get()" \
                                min-date="vm.minDate.get()" \
                                max-date="vm.maxDate.get()" \
                                date="vm.hasDate.get()" \
                                time="vm.hasTime.get()" \
                                minutes="vm.hasMinutes.get()" \
                                cancel-text="{{vm.cancelText.get()}}" \
                                today-text="{{vm.todayText.get()}}" \
                                ok-text="{{vm.okText.get()}}" \
                                week-start="vm.weekStart.get()" \
                                weeks-days="vm.weeksDays.get()" \
                                show-todays-date \
                                disable-parent-scroll="vm.disableParentScroll.get()" \
                                auto-ok="vm.autoOk.get()" \
                                edit-input="vm.editInput.get()" \
                                click-outside-to-close="vm.clickOutsideToClose.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-disabled="vm.isDisabled.get()" \
                                ng-required="vm.isRequired.get()"/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="parse">{{vm.parseMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                        <div flex="5"> \
                        <md-button class="md-primary md-icon-button" style="top:-12px;left:-12px;" ng-click="vm.displayDialogEdit()"> \
                            <md-icon class="material-icons">today</md-icon> \
                        </md-button> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.canShowEditableFields.get()"> \
                        <label>{{vm.title.get()}}</label><br/> \
                        <strong>{{vm.getDateString()}}</strong> \
                    </div> \
                </div> \
                <div ng-if="!vm.isForm.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div layout layout-align="center center" layout- class="datetimepicker"> \
                        <md-input-container flex> \
                            <label>{{vm.title.get() + ": " + vm.getDateString(true)}}</label> \
                            <input mdc-datetime-picker \
                                type="text" \
                                ng-model="vm.valueModel" \
                                id="{{vm.name.get()}}" \
                                name="{{vm.name.get()}}" \
                                format="{{vm.format.get()}}" \
                                short-time="vm.shortTime.get()" \
                                min-date="vm.minDate.get()" \
                                max-date="vm.maxDate.get()" \
                                date="vm.hasDate.get()" \
                                time="vm.hasTime.get()" \
                                minutes="vm.hasMinutes.get()" \
                                cancel-text="{{vm.cancelText.get()}}" \
                                today-text="{{vm.todayText.get()}}" \
                                ok-text="{{vm.okText.get()}}" \
                                week-start="vm.weekStart.get()" \
                                weeks-days="vm.weeksDays.get()" \
                                show-todays-date \
                                disable-parent-scroll="vm.disableParentScroll.get()" \
                                auto-ok="vm.autoOk.get()" \
                                edit-input="vm.editInput.get()" \
                                click-outside-to-close="vm.clickOutsideToClose.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-disabled="vm.isDisabled.get()" \
                                ng-required="vm.isRequired.get()"/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="parse">{{vm.parseMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                        <div flex="5"> \
                        <md-button class="md-primary md-icon-button" style="top:-12px;left:-12px;" ng-click="vm.displayDialogEdit()"> \
                            <md-icon class="material-icons">today</md-icon> \
                        </md-button> \
                        </div> \
                    </div> \
                </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixDateTimePicker', component);
})();
'use strict';

(function () {
    'use strict';

    var module = angular.module('entifix-js');

    componentController.$inject = ['BaseComponentFunctions', '$filter', 'EntifixResource', 'EntifixNotification', 'EntifixNotifier', '$scope', '$timeout', '$rootScope'];

    function componentController(BaseComponentFunctions, $filter, EntifixResource, EntifixNotification, EntifixNotifier, $scope, $timeout, $rootScope) {
        var vm = this;

        // Properties & Fields ===================================================================================================================================================

        //Fields
        var _isloading = false;
        var _notifier = null;

        var _statesForm = {
            edit: 1,
            view: 2
        };

        var _state = _statesForm.view;

        // Main

        vm.entity = {
            get: function get() {
                if (vm.connectionComponent) return vm.connectionComponent.entity;
                return null;
            },
            set: function set(value) {
                if (vm.connectionComponent) {
                    var oldValue = vm.connectionComponent.entity;
                    vm.connectionComponent.entity = value;

                    if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onChangeEntity) vm.componentBehavior.events.onChangeEntity(oldValue, value);
                }
            }
        };

        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isLoading.get();
                return false;
            }
        };

        vm.isSaving = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isSaving.get();
                return false;
            }
        };

        vm.isDeleting = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isDeleting.get();
                return false;
            }
        };

        vm.onTask = {
            get: function get() {
                var response = vm.isLoading.get() || vm.isSaving.get() || vm.isDeleting.get();

                return response;
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter(vm.entity.get());

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return 'Detalle';
            }
        };

        vm.icon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.icon) return vm.componentConstruction.title.icon;
                }

                //Default value
                return 'menu';
            }
        };

        // cancel button
        vm.canCancel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.cancelIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.icon) return vm.componentConstruction.cancel.icon;

                //Default value
                return 'clear';
            }
        };

        vm.cancelText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.text) return '' + vm.componentConstruction.cancel.text;

                //Default value
                return 'Cancelar';
            }
        };

        // ok button
        vm.canOk = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && _state == _statesForm.view) return true;

                //Default value
                return false;
            }
        };

        vm.okIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.componentConstruction.ok.icon) return vm.componentConstruction.ok.icon;

                //Default value
                return 'done';
            }
        };

        vm.okText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.componentConstruction.ok.text) return '' + vm.componentConstruction.ok.text;

                //Default value
                return 'Aceptar';
            }
        };

        // edit button
        vm.canEdit = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.view) return true;

                //Default value
                return false;
            }
        };

        vm.editIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.icon) return vm.componentConstruction.edit.icon;

                //Default value
                return 'create';
            }
        };

        vm.editText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit) {
                    if (vm.componentConstruction.edit.text instanceof Object && vm.componentConstruction.edit.text.getter) return vm.componentConstruction.edit.text.getter();else if (vm.componentConstruction.edit.text instanceof String) return vm.componentConstruction.edit.text;
                };

                //Default value
                return 'Editar';
            }
        };

        // save button
        vm.canSave = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.saveIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.componentConstruction.save.icon) return '' + vm.componentConstruction.save.icon;

                //Default value
                return 'save';
            }
        };

        vm.saveText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.componentConstruction.save.text) return '' + vm.componentConstruction.save.text;

                //Default value
                return 'Guardar';
            }
        };

        // remove button
        vm.canRemove = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.removeIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.icon) return vm.componentConstruction.remove.icon;

                //Default value
                return 'delete';
            }
        };

        vm.removeText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.text) return '' + vm.componentConstruction.remove.text;

                //Default value
                return 'Eliminar';
            }
        };

        //process icon
        vm.canProcess = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && _state == _statesForm.view && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && !vm.queryDetails.resource.isProcessedEntity(vm.entity.get())) return true;

                //Default value
                return false;
            }
        };

        vm.processIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.componentConstruction.process.icon) return vm.componentConstruction.process.icon;

                //Default value
                return 'done_all';
            }
        };

        vm.processText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.componentConstruction.process.text) return '' + vm.componentConstruction.process.text;

                //Default value
                return 'Procesar';
            }
        };

        vm.allowActions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.allowActions != null) return vm.componentConstruction.allowActions;

                //Default value
                return true;
            }
        };

        vm.saveTooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.saveTooltip) return vm.componentConstruction.saveTooltip;

                //Default value
                return 'Todos los campos obligatorios deben estar correctos';
            }
        };

        vm.canViewHistory = {
            get: function get() {
                return vm.componentConstruction.canViewHistory.get();
            },

            set: function set(value) {
                vm.componentConstruction.canViewHistory.set(value);
            }
        };

        vm.history = {
            get: function get() {
                return $rootScope.showHistory;
            }
        };

        // =======================================================================================================================================================================

        // Methods ===============================================================================================================================================================

        vm.$onInit = function () {
            setdefaults();
            createconnectioncomponent();
            activate();

            checkoutputs();
        };

        function setdefaults() {
            _notifier = new EntifixNotifier(vm.queryDetails.resource);
        };

        function createconnectioncomponent() {
            vm.connectionComponent = {};

            // Connection Component Properties __________________________________________________________________________________________
            // ==========================================================================================================================

            vm.connectionComponent.showEditableFields = {
                get: function get() {
                    return _state == _statesForm.edit;
                },
                set: function set(value) {
                    if (value == true) _state = _statesForm.edit;
                    if (value == false) _state = _statesForm.view;
                }
            };

            vm.connectionComponent.isSaving = vm.isSaving;
            vm.connectionComponent.history = vm.history;
            vm.connectionComponent.canViewHistory = vm.canViewHistory;

            vm.connectionComponent.canCancel = { get: function get() {
                    return vm.canCancel.get();
                } };
            vm.connectionComponent.canRemove = { get: function get() {
                    return vm.canRemove.get();
                } };
            vm.connectionComponent.canSave = { get: function get() {
                    return vm.canSave.get();
                } };
            vm.connectionComponent.canEdit = { get: function get() {
                    return vm.canEdit.get();
                } };
            vm.connectionComponent.canOk = { get: function get() {
                    return vm.canOk.get();
                } };
            vm.connectionComponent.canProcess = { get: function get() {
                    return vm.canProcess.get();
                } };

            vm.connectionComponent.cancelText = { get: function get() {
                    return vm.cancelText.get();
                } };
            vm.connectionComponent.removeText = { get: function get() {
                    return vm.removeText.get();
                } };
            vm.connectionComponent.saveText = { get: function get() {
                    return vm.saveText.get();
                } };
            vm.connectionComponent.editText = { get: function get() {
                    return vm.editText.get();
                } };
            vm.connectionComponent.okText = { get: function get() {
                    return vm.okText.get();
                } };
            vm.connectionComponent.processText = { get: function get() {
                    return vm.processText.get();
                } };

            vm.connectionComponent.cancelIcon = { get: function get() {
                    return vm.cancelIcon.get();
                } };
            vm.connectionComponent.removeIcon = { get: function get() {
                    return vm.removeIcon.get();
                } };
            vm.connectionComponent.saveIcon = { get: function get() {
                    return vm.saveIcon.get();
                } };
            vm.connectionComponent.editIcon = { get: function get() {
                    return vm.editIcon.get();
                } };
            vm.connectionComponent.okIcon = { get: function get() {
                    return vm.okIcon.get();
                } };
            vm.connectionComponent.processIcon = { get: function get() {
                    return vm.processIcon.get();
                } };

            vm.connectionComponent.cancel = { invoke: function invoke() {
                    vm.cancel();
                } };
            vm.connectionComponent.remove = { invoke: function invoke() {
                    vm.remove();
                } };
            vm.connectionComponent.edit = { invoke: function invoke() {
                    vm.edit();
                } };
            vm.connectionComponent.ok = { invoke: function invoke() {
                    vm.ok();
                } };
            vm.connectionComponent.save = { invoke: function invoke() {
                    vm.save();
                } };
            vm.connectionComponent.process = { invoke: function invoke() {
                    vm.process();
                } };

            vm.connectionComponent.onTask = { get: function get() {
                    return vm.onTask.get();
                } };
            vm.connectionComponent.saveTooltip = { get: function get() {
                    return vm.saveTooltip.get();
                } };
            vm.connectionComponent.entityForm = { valid: function valid() {
                    return vm.entityForm.$valid;
                } };

            vm.connectionComponent.evaluateErrors = {
                get: function get(name) {
                    return evaluateErrors(name);
                }
            };

            function evaluateErrors(property) {
                var errors = {};
                for (var error in vm.entityForm.$error) {
                    var propertyValue = vm.entityForm.$error[error];

                    if (propertyValue instanceof Array) {
                        propertyValue.forEach(function (element) {
                            if (element.$name == property) errors[error] = true;
                        });

                        //((element) => { 
                        //    if (element.$name == property)
                        //        errors[error] = true;
                        //})(...propertyValue);
                    }
                }

                return errors;
            }

            // ==========================================================================================================================


            // Connection Component Methods _____________________________________________________________________________________________
            // ==========================================================================================================================

            var searchForm = function searchForm() {
                if (vm.entityForm) vm.connectionComponent.entityForm = vm.entityForm;else $timeout(searchForm, 200);
            };

            searchForm();
        };

        function createDynamicComponent() {
            var res = BaseComponentFunctions.CreateStringHtmlComponentAndBindings(vm.componentConstruction, 'bindCtrl.connectionComponent.objectBindings');
            vm.stringhtmlcomponent = res.stringhtml;
            vm.connectionComponent.objectBindings = res.objectbindings;
        };

        function activate() {
            if (vm.componentConstruction) createDynamicComponent();
        };

        function checkoutputs() {
            vm.componentBindingOut = {
                showEditableFields: vm.connectionComponent.showEditableFields,
                entity: vm.entity,
                recreateDynamicComponent: createDynamicComponent
            };

            if (vm.componentBehavior && vm.componentBehavior.afterConstruction) vm.componentBehavior.afterConstruction();
        };

        vm.ok = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onOk) vm.componentBehavior.events.onOk();

            if (vm.componentConstruction.ok.customAction) vm.componentConstruction.ok.customAction();else defaultOk();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAfterOk) vm.componentBehavior.events.onAfterOk();
        };

        vm.cancel = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCancel) vm.componentBehavior.events.onCancel();

            if (vm.componentConstruction.cancel.customAction) vm.componentConstruction.cancel.customAction();else defaultCancel();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCanceled) vm.componentBehavior.events.onCanceled();
        };

        vm.edit = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit) vm.componentBehavior.events.onEdit();

            if (vm.componentConstruction.edit.customAction) vm.componentConstruction.edit.customAction();else defaultEdit();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdited) vm.componentBehavior.events.onEdited();
        };

        vm.save = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSave) vm.componentBehavior.events.onSave(vm.entity.get());

            if (vm.componentConstruction.save.customAction) vm.componentConstruction.save.customAction(vm.entity.get(), setViewState);else defaultSave();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSaved) vm.componentBehavior.events.onSaved();
        };

        vm.remove = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemove) vm.componentBehavior.events.onRemove();

            if (vm.componentConstruction.remove.customAction) vm.componentConstruction.remove.customAction(vm.entity.get());else defaultRemove();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemoved) vm.componentBehavior.events.onRemoved();
        };

        vm.process = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcess) vm.componentBehavior.events.onProcess();

            if (vm.componentConstruction.process.customAction) vm.componentConstruction.process.customAction(vm.entity.get(), setViewState);else defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed) vm.componentBehavior.events.onProcessed();
        };

        function defaultOk() {};

        function defaultCancel() {
            if (_state == _statesForm.edit) {
                _state = _statesForm.view;
                reloadEntity();
            }
        };

        function defaultEdit() {
            _state = _statesForm.edit;
        };

        function defaultSave() {
            vm.queryDetails.resource.saveEntity(vm.connectionComponent.entity, function (response, saveSuccess) {
                if (saveSuccess) _state = _statesForm.view;
                if (response && response.data.data) vm.entity.set(response.data.data);
            });
        };

        function defaultProcess() {
            vm.connectionComponent.entity[vm.queryDetails.resource.getOpProperty.get()] = 'PROCESAR';
            defaultSave();
        };

        function defaultRemove() {
            EntifixNotification.confirm('Está seguro de eliminar el registro', 'Confirmación requerida', function () {
                vm.queryDetails.resource.deleteEntity(vm.connectionComponent.entity, function () {
                    _state = _statesForm.view;
                });
            });
        };

        vm.submit = function () {
            vm.save();
        };

        function reloadEntity() {
            if (vm.entity.get()) vm.queryDetails.resource.loadAsResource(vm.entity.get(), function (entityReloaded) {
                vm.entity.set(entityReloaded);
            });
        };

        function setViewState(view, entity) {
            if (view) _state = _statesForm.view;else _state = _statesForm.edit;

            vm.entity.set(entity);
        }

        // =======================================================================================================================================================================
    };

    var component = {
        //templateUrl: 'dist/shared/components/entifixEntityForm/entifixEntityForm.html',
        template: '<br/> \
                    <md-card md-whiteframe="4" ng-class="{\'whirl double-up whirlback\': bindCtrl.onTask.get() }"> \
                        <md-card-title> \
                            <md-card-title-text> \
                                <span class="md-headline"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon>&nbsp;{{bindCtrl.title.get()}}</span> \
                            </md-card-title-text> \
                        </md-card-title> \
                        <form name="bindCtrl.entityForm" novalidate ng-submit="bindCtrl.entityForm.$valid && bindCtrl.submit()"> \
                            <md-card-content> \
                                <div compile="bindCtrl.stringhtmlcomponent" flex="100"></div> \
                            </md-card-content> \
                            <md-card-actions layout="row" layout-align="end center" ng-if="bindCtrl.allowActions.get()"> \
                                <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canCancel.get()" ng-click="bindCtrl.cancel()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.cancelIcon.get()}}</md-icon> &nbsp;{{bindCtrl.cancelText.get()}} \
                                </md-button> \
                                <md-button class="md-warn" ng-show="bindCtrl.canRemove.get()" ng-click="bindCtrl.remove()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon> &nbsp;{{bindCtrl.removeText.get()}} \
                                </md-button> \
                                <md-button type="submit" class="md-primary" ng-show="bindCtrl.canSave.get()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                    <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                    <md-icon class="material-icons">{{bindCtrl.saveIcon.get()}}</md-icon> &nbsp;{{bindCtrl.saveText.get()}} \
                                </md-button> \
                                <md-button class="md-accent" ng-show="bindCtrl.canEdit.get()" ng-click="bindCtrl.edit()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon> &nbsp;{{bindCtrl.editText.get()}} \
                                </md-button> \
                                <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canOk.get()" ng-click="bindCtrl.ok()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.okIcon.get()}}</md-icon> &nbsp;{{bindCtrl.okText.get()}} \
                                </md-button> \
                                <md-button class="md-primary" ng-show="bindCtrl.canProcess.get()" ng-click="bindCtrl.process()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid || !bindCtrl.isValidEntity.get()"> \
                                    <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                    <md-icon class="material-icons">{{bindCtrl.processIcon.get()}}</md-icon> &nbsp;{{bindCtrl.processText.get()}} \
                                </md-button> \
                            </md-card-actions> \
                        </form> \
                    </md-card>',
        controller: componentController,
        controllerAs: 'bindCtrl',
        bindings: {
            componentConstruction: '<',
            componentBehavior: '<',
            componentBindingOut: '=',
            queryDetails: '='
        }

        //Register component
    };module.component('entifixEntityForm', component);
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller($filter) {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        //Label - Input Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        //Error validations
        vm.isRequired = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isRequired) return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };

        vm.requiredMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage) {
                    if (vm.componentConstruction.requiredMessage.getter) return vm.componentConstruction.requiredMessage.getter();

                    if (vm.componentConstruction.requiredMessage.text) return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.maxLength = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxLength) return vm.componentConstruction.maxLength;

                //Default value
                return null;
            }
        };

        vm.maxLengthMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.maxLengthMessage) {
                    if (vm.componentConstruction.maxLengthMessage.getter) return vm.componentConstruction.maxLengthMessage.getter();

                    if (vm.componentConstruction.maxLengthMessage.text) return vm.componentConstruction.maxLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado largo';
            }
        };

        vm.minLength = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minLength) return vm.componentConstruction.minLength;

                //Default value
                return null;
            }
        };

        vm.minLengthMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.minLengthMessage) {
                    if (vm.componentConstruction.minLengthMessage.getter) return vm.componentConstruction.minLengthMessage.getter();

                    if (vm.componentConstruction.minLengthMessage.text) return vm.componentConstruction.minLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado corto';
            }
        };

        vm.emailMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.emailMessage) {
                    if (vm.componentConstruction.emailMessage.getter) return vm.componentConstruction.emailMessage.getter();

                    if (vm.componentConstruction.emailMessage.text) return vm.componentConstruction.emailMessage.text;
                }

                //Default value
                return 'Ingrese una dirección de correo válida';
            }
        };

        vm.urlMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.urlMessage) {
                    if (vm.componentConstruction.urlMessage.getter) return vm.componentConstruction.urlMessage.getter();

                    if (vm.componentConstruction.urlMessage.text) return vm.componentConstruction.urlMessage.text;
                }

                //Default value
                return 'Ingrese una dirección URL válida';
            }
        };

        vm.numberMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.numberMessage) {
                    if (vm.componentConstruction.numberMessage.getter) return vm.componentConstruction.numberMessage.getter();

                    if (vm.componentConstruction.numberMessage.text) return vm.componentConstruction.numberMessage.text;
                }

                //Default value
                return 'Ingrese una número válido';
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixinput' + randomNumber;
            }
        };

        vm.isTextArea = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isTextArea) return true;

                //Default value
                return false;
            }
        };

        vm.type = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.type) return vm.componentConstruction.type;

                //Default value
                return 'text';
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.rows = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.rows) return vm.componentConstruction.rows;

                //Default value
                return 1;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.modelOptions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.modelOptions) return vm.componentConstruction.modelOptions;

                return {};
            }
        };

        vm.numberValidation = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.numberValidation) return vm.componentConstruction.numberValidation;

                return false;
            }
        };

        vm.format = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.format) return vm.componentConstruction.format;

                return null;
            }
        };

        vm.currency = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.currency) return vm.componentConstruction.currency;

                return '';
            }
        };

        vm.nullValueLabel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel) return vm.componentConstruction.nullValueLabel;

                return 'SIN REGISTROS';
            }
            //=======================================================================================================================================================================


            //Methods________________________________________________________________________________________________________________________________________________________________ 
            //=======================================================================================================================================================================

        };vm.$onInit = function () {
            if (vm.init) vm.init();
        };

        vm.runOnChangeTrigger = function () {
            if (vm.onChange) vm.onChange({ value: vm.valueModel });
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        vm.getDisplay = function () {
            if (vm.valueModel) {
                if (vm.format.get()) return $filter(vm.format.get())(vm.valueModel, vm.currency.get());
                return vm.valueModel;
            } else return vm.nullValueLabel.get();
        };

        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = ['$filter'];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixInput/entifixInput.html',
        template: '<div ng-if="!vm.isTextArea.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <md-input-container class="md-block" ng-show="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <input \
                                type="{{vm.type.get()}}" \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                md-maxlength="{{vm.maxLength.get()}}" \
                                minlength="{{vm.minLength.get()}}" \
                                name="{{vm.name.get()}}" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-model-options="vm.modelOptions.get()" \
                                step="any" \
                                number-validation="{{vm.numberValidation.get()}}" \
                                number-block/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                    <div ng-message="email">{{vm.emailMessage.get()}}</div> \
                                    <div ng-message="url">{{vm.urlMessage.get()}}</div> \
                                    <div ng-message="number">{{vm.numberMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                        <div ng-hide="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplay()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <md-input-container class="md-block"> \
                            <label>{{vm.title.get()}}</label> \
                            <input \
                                type="{{vm.type.get()}}" \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                md-maxlength="{{vm.maxLength.get()}}" \
                                minlength="{{vm.minLength.get()}}" \
                                name="{{vm.name.get()}}" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-model-options="vm.modelOptions.get()" \
                                step="any" \
                                number-validation="{{vm.numberValidation.get()}}" \
                                number-block/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                    <div ng-message="email">{{vm.emailMessage.get()}}</div> \
                                    <div ng-message="url">{{vm.urlMessage.get()}}</div> \
                                    <div ng-message="number">{{vm.numberMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                    </div> \
                </div> \
                <div ng-if="vm.isTextArea.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <md-input-container class="md-block" ng-show="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <textarea \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                md-maxlength="{{vm.maxLength.get()}}" \
                                rows="{{vm.rows.get()}}" \
                                minlength="{{vm.minLength.get()}}" \
                                name="{{vm.name.get()}}" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-model-options="vm.modelOptions.get()" \
                                step="any" \
                                number-validation="{{vm.numberValidation.get()}}" \
                                number-block/></textarea> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                    <div ng-message="email">{{vm.emailMessage.get()}}</div> \
                                    <div ng-message="url">{{vm.urlMessage.get()}}</div> \
                                    <div ng-message="number">{{vm.numberMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                        <div ng-hide="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplay()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <md-input-container class="md-block"> \
                            <label>{{vm.title.get()}}</label> \
                            <textarea \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                md-maxlength="{{vm.maxLength.get()}}" \
                                rows="{{vm.rows.get()}}" \
                                minlength="{{vm.minLength.get()}}" \
                                name="{{vm.name.get()}}" \
                                aria-label="{{vm.name.get()}}" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-model-options="vm.modelOptions.get()" \
                                step="any" \
                                number-validation="{{vm.numberValidation.get()}}" \
                                number-block/></textarea> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-maxlength">{{vm.maxLengthMessage.get()}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.get()}}</div> \
                                    <div ng-message="email">{{vm.emailMessage.get()}}</div> \
                                    <div ng-message="url">{{vm.urlMessage.get()}}</div> \
                                    <div ng-message="number">{{vm.numberMessage.get()}}</div> \
                                </div> \
                        </md-input-container> \
                    </div> \
                </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixInput', component);
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller() {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) vm.queryDetails.resource.isLoading.get();

                //Default value
                return false;
            }
        };

        //Label - Editable Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        //Error validations
        vm.isRequired = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isRequired) return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };

        vm.requiredMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage) {
                    if (vm.componentConstruction.requiredMessage.getter) return vm.componentConstruction.requiredMessage.getter();

                    if (vm.componentConstruction.requiredMessage.text) return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixradiobutton' + randomNumber;
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.isMultipleDisplay = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isMultipleDisplay) return vm.componentConstruction.isMultipleDisplay;

                //Default value
                return false;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };
        //=======================================================================================================================================================================


        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function () {
            loadCollection();
            checkoutputs();
        };

        function loadCollection() {
            if (!vm.isMultipleDisplay.get()) {
                vm.queryDetails.resource.getEnumerationBind(vm.componentConstruction.displayPropertyName, function (enumResult) {
                    vm.items = enumResult;
                });
            } else {
                prepareMultiDisplayParameters();
                vm.queryDetails.resource.getEnumerationBindMultiDisplay(vm.parameters);
            }
        };

        function prepareMultiDisplayParameters() {
            var actionSuccess = function actionSuccess(enumResult) {
                vm.items = enumResult;
            };
            vm.parameters = {
                displayProperties: vm.componentConstruction.displayProperties,
                actionSuccess: actionSuccess,
                actionError: vm.queryDetails.actionError,
                filters: vm.queryDetails.filters
            };
        }

        function checkoutputs() {
            vm.componentBindingOut = {
                selectedEntity: {
                    get: function get() {
                        return vm.getValue();
                    }
                }
            };

            if (vm.init) vm.init();
        };

        vm.getDisplayValue = function () {
            if (vm.valueModel && vm.items && vm.items.length > 0) {
                var item = vm.items.filter(function (e) {
                    return e.Value == vm.valueModel;
                })[0];
                if (item) return item.Display;
            }

            return null;
        };

        vm.getValue = function () {
            if (vm.valueModel && vm.items && vm.items.length > 0) {
                var item = vm.items.filter(function (e) {
                    return e.Value == vm.valueModel;
                })[0];
                if (item) return item;
            }

            return null;
        };

        vm.runOnChangeTrigger = function () {
            var entity = vm.items.filter(function (e) {
                return e.Value == vm.valueModel;
            })[0];
            if (vm.onChange) vm.onChange({ oldValue: vm.valueModel, newValue: vm.valueModel, entity: entity });
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        //=======================================================================================================================================================================
    };

    componentcontroller.$inject = [];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            queryDetails: '<',
            componentConstruction: '<',
            componentBindingOut: '=',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixRadioButton/entifixRadioButton.html',
        template: '<div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <div ng-if="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <md-radio-group \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                name="{{vm.name.get()}}"> \
                                <md-radio-button \
                                    ng-repeat="item in vm.items" \
                                    ng-value="item.Value" \
                                    aria-label="item.Display"> \
                                    {{item.Display}} \
                                </md-radio-button> \
                                <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div>  \
                            </md-radio-group> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplayValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <div ng-if="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <md-radio-group \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                name="{{vm.name.get()}}"> \
                                <md-radio-button \
                                    ng-repeat="item in vm.items" \
                                    ng-value="item.Value" \
                                    aria-label="item.Display"> \
                                    {{item.Display}} \
                                </md-radio-button> \
                                <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div>  \
                            </md-radio-group> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplayValue()}}</strong> \
                        </div> \
                    </div> \
                </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixRadioButton', component);
})();
'use strict';

(function () {
        'use strict';

        angular.module('entifix-js').controller('PreconditionFailedErrorController', controller);
        controller.$inject = ['sessionData', 'AppResources', '$http', '$mdDialog', '$state'];

        function controller(sessionData, AppResources, $http, $mdDialog, $state) {
                var vm = this;

                // Properties & fields
                // ==============================================================================================================================================================

                // ==============================================================================================================================================================


                // Methods
                // ==============================================================================================================================================================
                function activate() {
                        createComponents();
                        setDefaults();
                };

                function createComponents() {
                        $http({
                                method: 'GET',
                                url: AppResources.baseUrl + AppResources.api + 'catalogo/bodega' + '?administradores.nip=' + sessionData.subject
                        }).then(function (results) {
                                if (results.data.data) vm.workgroups = results.data.data;
                        });
                }

                function setDefaults() {
                        if (sessionData.currentWorkgroup) $http({ method: 'GET', url: AppResources.baseUrl + AppResources.api + 'catalogo/bodega' + '?id=' + sessionData.currentWorkgroup }).then(function (results) {
                                if (results.data.data[0]) vm.workgroupName = results.data.data[0].nombreBodega;
                        });
                }

                vm.cancel = function () {
                        $mdDialog.cancel();
                };

                vm.ok = function () {
                        $http({
                                method: 'PUT',
                                url: AppResources.baseUrl + AppResources.api + AppResources.login,
                                data: { subject: sessionData.subject, workgroupId: vm.workgroupId }
                        }).then(actionSuccess, actionError);
                };

                function actionSuccess(results) {
                        localStorage.setItem(sessionData.authTokenName, results.data.data[0][sessionData.authTokenName]);
                        $state.reload();
                        $mdDialog.hide(vm.workgroupName);
                }

                function actionError() {
                        swal('¡Error!', 'Ocurrió un error al intentar elegir una bodega. Por favor intentelo de nuevo o contacte a su administrador de Sistemas.', 'error');
                }

                vm.setWorkgroupId = function (workgroup) {
                        if (workgroup) vm.workgroupId = workgroup.id;
                };

                activate();
                // ==============================================================================================================================================================
        };
})();
'use strict';

(function () {
    'use strict';

    function componentcontroller() {
        var vm = this;
        var randomNumber = Math.floor(Math.random() * 100 + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) vm.queryDetails.resource.isLoading.get();

                //Default value
                return false;
            }
        };

        //Label - Input Behavior
        vm.canShowEditableFields = {
            get: function get() {
                if (vm.showEditableFields) return vm.showEditableFields();

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors = {
            get: function get() {
                if (vm.evaluateErrors) return vm.evaluateErrors({ name: vm.name.get() });

                return false;
            }
        };

        //Error validations
        vm.isRequired = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isRequired) return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };

        vm.requiredMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage) {
                    if (vm.componentConstruction.requiredMessage.getter) return vm.componentConstruction.requiredMessage.getter();

                    if (vm.componentConstruction.requiredMessage.text) return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.multipleMessage = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.multipleMessage) {
                    if (vm.componentConstruction.multipleMessage.getter) return vm.componentConstruction.multipleMessage.getter();

                    if (vm.componentConstruction.multipleMessage.text) return vm.componentConstruction.multipleMessage.text;
                }

                //Default value
                return 'Error en la elección del elemento, vuelva a seleccionarlo';
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };

        vm.name = {
            get: function get() {
                if (getCleanedString(vm.title.get()) != '') return getCleanedString(vm.title.get());
                return 'entifixselect' + randomNumber;
            }
        };

        vm.isForm = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null) return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };

        vm.isMultipleDisplay = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isMultipleDisplay) return vm.componentConstruction.isMultipleDisplay;

                //Default value
                return false;
            }
        };

        vm.isMultiple = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isMultiple) return vm.componentConstruction.isMultiple;

                //Default value
                return false;
            }
        };

        vm.tooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.tooltip) {
                    if (vm.componentConstruction.tooltip.getter) return vm.componentConstruction.tooltip.getter();

                    if (vm.componentConstruction.tooltip.text) return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.collection = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.collection) {
                    if (vm.componentConstruction.collection.getter) return vm.componentConstruction.collection.getter();
                    if (vm.componentConstruction.collection.elements) return vm.componentConstruction.collection.elements;
                }

                //Default value
                return null;
            }
        };

        vm.nullValueLabel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel) return vm.componentConstruction.nullValueLabel;

                return 'SIN REGISTROS';
            }
            //=======================================================================================================================================================================


            //Methods________________________________________________________________________________________________________________________________________________________________ 
            //=======================================================================================================================================================================

        };vm.$onInit = function () {
            loadCollection();
            checkoutputs();
            vm.searchText;
        };

        function loadCollection() {
            if (vm.collection.get()) vm.items = vm.collection.get();else {
                if (!vm.isMultipleDisplay.get()) {
                    vm.queryDetails.resource.getEnumerationBind(vm.componentConstruction.displayPropertyName, function (enumResult) {
                        vm.items = enumResult;
                    });
                } else {
                    prepareMultiDisplayParameters();
                    vm.queryDetails.resource.getEnumerationBindMultiDisplay(vm.parameters);
                }
            }
        };

        function prepareMultiDisplayParameters() {
            var actionSuccess = function actionSuccess(enumResult) {
                vm.items = enumResult;
            };
            vm.parameters = {
                displayProperties: vm.componentConstruction.displayProperties,
                actionSuccess: actionSuccess,
                actionError: vm.queryDetails.actionError,
                filters: vm.queryDetails.filters
            };
        }

        function checkoutputs() {
            vm.componentBindingOut = {
                selectedEntity: {
                    get: function get() {
                        return vm.getValue();
                    }
                }
            };

            if (vm.init) vm.init();
        };

        vm.getDisplayValue = function () {
            if (!vm.isMultiple.get()) {
                if (vm.valueModel && vm.items && vm.items.length > 0) {
                    var item = vm.items.filter(function (e) {
                        return e.Value == vm.valueModel;
                    })[0];
                    if (item) return item.Display;
                }
            } else {
                if (vm.valueModel && vm.items && vm.items.length > 0) {
                    var item = '';
                    vm.valueModel.forEach(function (valueModel) {
                        item += vm.items.filter(function (e) {
                            return e.Value == valueModel;
                        })[0].Display;
                    });
                    if (item) return item;
                }
            }
            return vm.nullValueLabel.get();
        };

        vm.getValue = function () {
            if (vm.valueModel && vm.items && vm.items.length > 0) {
                var item = vm.items.filter(function (e) {
                    return e.Value == vm.valueModel;
                })[0];
                if (item) return item;
            }

            return null;
        };

        vm.runOnChangeTrigger = function () {
            var entity = vm.items.filter(function (e) {
                return e.Value == vm.valueModel;
            })[0];
            if (vm.onChange) vm.onChange({ oldValue: vm.valueModel, newValue: vm.valueModel, entity: entity });
        };

        function getCleanedString(stringToClean) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) {
                stringToClean = stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g, "");
            stringToClean = stringToClean.replace(/á/gi, "a");
            stringToClean = stringToClean.replace(/é/gi, "e");
            stringToClean = stringToClean.replace(/í/gi, "i");
            stringToClean = stringToClean.replace(/ó/gi, "o");
            stringToClean = stringToClean.replace(/ú/gi, "u");
            stringToClean = stringToClean.replace(/ñ/gi, "n");
            return stringToClean;
        }

        vm.cleanSearch = function () {
            vm.searchText = '';
        };

        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = [];

    var component = {
        bindings: {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            queryDetails: '<',
            componentConstruction: '<',
            componentBindingOut: '=',
            onChange: '&'
        },
        //templateUrl: 'dist/shared/components/entifixSelect/entifixSelect.html',
        template: '<div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}" ng-if="!vm.isMultiple.get()"> \
                        <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                        <div ng-if="vm.isForm.get()"> \
                            <md-input-container ng-if="vm.canShowEditableFields.get()" class="entifix-select-width"> \
                                <label>{{vm.title.get()}}</label> \
                                <md-select \
                                    ng-model="vm.valueModel" \
                                    ng-required="vm.isRequired.get()" \
                                    ng-change="vm.runOnChangeTrigger()" \
                                    name="{{vm.name.get()}}" \
                                    aria-label="{{vm.name.get()}}" \
                                    md-on-close="vm.cleanSearch()" \
                                    data-md-container-class="selectSelectHeader"> \
                                    <md-select-header class="select-header"> \
                                        <input type="search" ng-model="vm.searchText" placeholder="Buscar {{vm.title.get()}} ..." class="header-searchbox md-text" ng-keydown="$event.stopPropagation()"/> \
                                    </md-select-header> \
                                    <md-optgroup label={{vm.title.get()}}> \
                                        <md-option ng-repeat="item in vm.items | filter:vm.searchText" ng-value="item.Value">{{item.Display}}</md-option> \
                                    </md-optgroup> \
                                </md-select> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div>  \
                            </md-input-container> \
                            <div ng-if="!vm.canShowEditableFields.get()"> \
                                <label>{{vm.title.get()}}</label><br/> \
                                <strong>{{vm.getDisplayValue()}}</strong> \
                            </div> \
                        </div> \
                        <div ng-if="!vm.isForm.get()"> \
                            <md-input-container class="entifix-select-width"> \
                                <label>{{vm.title.get()}}</label> \
                                <md-select \
                                    ng-model="vm.valueModel" \
                                    ng-required="vm.isRequired.get()" \
                                    ng-change="vm.runOnChangeTrigger()" \
                                    name="{{vm.name.get()}}" \
                                    aria-label="{{vm.name.get()}}" \
                                    md-on-close="vm.cleanSearch()" \
                                    data-md-container-class="selectSelectHeader"> \
                                    <md-select-header class="select-header"> \
                                        <input type="search" ng-model="vm.searchText" placeholder="Buscar {{vm.title.get()}} ..." class="header-searchbox md-text" ng-keydown="$event.stopPropagation()"/> \
                                    </md-select-header> \
                                    <md-optgroup label={{vm.title.get()}}> \
                                        <md-option ng-repeat="item in vm.items | filter:vm.searchText" ng-value="item.Value">{{item.Display}}</md-option> \
                                    </md-optgroup> \
                                </md-select> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div> \
                            </md-input-container> \
                        </div> \
                    </div> \
                    <div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}" ng-if="vm.isMultiple.get()"> \
                        <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                        <div ng-if="vm.isForm.get()"> \
                            <md-input-container ng-if="vm.canShowEditableFields.get()" class="entifix-select-width"> \
                                <label>{{vm.title.get()}}</label> \
                                <md-select \
                                    ng-model="vm.valueModel" \
                                    ng-required="vm.isRequired.get()" \
                                    ng-change="vm.runOnChangeTrigger()" \
                                    name="{{vm.name.get()}}" \
                                    aria-label="{{vm.name.get()}}" \
                                    md-on-close="vm.cleanSearch()" \
                                    data-md-container-class="selectSelectHeader" \
                                    multiple=""> \
                                    <md-select-header class="select-header"> \
                                        <input type="search" ng-model="vm.searchText" placeholder="Buscar {{vm.title.get()}} ..." class="header-searchbox md-text" ng-keydown="$event.stopPropagation()"/> \
                                    </md-select-header> \
                                    <md-optgroup label={{vm.title.get()}}> \
                                        <md-option ng-repeat="item in vm.items | filter:vm.searchText" ng-value="item.Value">{{item.Display}}</md-option> \
                                    </md-optgroup> \
                                </md-select> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-multiple">{{vm.multipleMessage.get()}}</div> \
                                </div>  \
                            </md-input-container> \
                            <div ng-if="!vm.canShowEditableFields.get()"> \
                                <label>{{vm.title.get()}}</label><br/> \
                                <strong>{{vm.getDisplayValue()}}</strong> \
                            </div> \
                        </div> \
                        <div ng-if="!vm.isForm.get()"> \
                            <md-input-container class="entifix-select-width"> \
                                <label>{{vm.title.get()}}</label> \
                                <md-select \
                                    ng-model="vm.valueModel" \
                                    ng-required="vm.isRequired.get()" \
                                    ng-change="vm.runOnChangeTrigger()" \
                                    name="{{vm.name.get()}}" \
                                    aria-label="{{vm.name.get()}}" \
                                    md-on-close="vm.cleanSearch()" \
                                    data-md-container-class="selectSelectHeader" \
                                    multiple=""> \
                                    <md-select-header class="select-header"> \
                                        <input type="search" ng-model="vm.searchText" placeholder="Buscar {{vm.title.get()}} ..." class="header-searchbox md-text" ng-keydown="$event.stopPropagation()"/> \
                                    </md-select-header> \
                                    <md-optgroup label={{vm.title.get()}}> \
                                        <md-option ng-repeat="item in vm.items | filter:vm.searchText" ng-value="item.Value">{{item.Display}}</md-option> \
                                    </md-optgroup> \
                                </md-select> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                    <div ng-message="md-multiple">{{vm.multipleMessage.get()}}</div> \
                                </div> \
                            </md-input-container> \
                        </div> \
                    </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixSelect', component);
})();
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    var module = angular.module('entifix-js');

    componentController.$inject = ['BaseComponentFunctions', 'EntifixNotification', '$timeout', 'EntifixPager', '$stateParams', '$state', 'EntifixResource', '$mdMenu'];

    function componentController(BaseComponentFunctions, EntifixNotification, $timeout, EntifixPager, $stateParams, $state, EntifixResource, $mdMenu) {
        var vm = this;
        var cont = 0;
        var onLoading = true;
        var isFirstLoad = true;
        // Properties & Fields ===================================================================================================================================================

        //Fields
        var _isloading = false;
        var _total = 0;
        var _canShowSearchText = true;
        var _transformValues;

        // Main
        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isLoading.get();
                return _isloading;
            }
        };

        vm.isDeleting = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isDeleting.get();
                return false;
            }
        };

        vm.total = {
            get: function get() {
                return _total;
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                return 'Listado';
            }
        };

        vm.icon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.icon) return vm.componentConstruction.title.icon;
                }

                //Default value
                return 'menu';
            }

            // search button 
        };vm.canSearch = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.search) return true;

                //Default value
                return false;
            }
        };

        vm.searchIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.search && vm.componentConstruction.search.icon) return vm.componentConstruction.search.icon;

                //Default value
                return 'search';
            }
        };

        vm.searchText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.search && vm.componentConstruction.search.text) return '' + vm.componentConstruction.search.text;

                //Default value
                return 'Buscar';
            }
        };

        vm.canShowSearchText = {
            get: function get() {
                return _canShowSearchText;
            },
            set: function set(value) {
                _canShowSearchText = value;
            }
        };

        // add button
        vm.canAdd = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.add) return true;

                //Default value
                return false;
            }
        };

        vm.multipleAddOptions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.options) return true;

                //Default value
                return false;
            }
        };

        vm.addIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.icon) return vm.componentConstruction.add.icon;

                //Default value
                return 'add';
            }
        };

        vm.addText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.text) return vm.componentConstruction.add.text;

                //Default value
                return 'Nuevo';
            }
        };

        // edit button
        vm.canEdit = {
            get: function get() {
                if (vm.componentConstruction && vm.connectionComponent.elementsSelection() == 1) {
                    if (vm.componentConstruction.edit && vm.componentConstruction.edit.enable != null) {
                        if (vm.componentConstruction.edit.enable instanceof Object && vm.componentConstruction.edit.enable.getter) return vm.componentConstruction.edit.enable.getter();else if (vm.componentConstruction.edit.enable != null) return vm.componentConstruction.edit.enable;
                    } else if (vm.componentConstruction.edit) return true;
                }

                //Default value
                return false;
            }
        };

        vm.multipleEditOptions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.options) return true;

                //Default value
                return false;
            }
        };

        vm.editIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.icon) return vm.componentConstruction.edit.icon;

                //Default value
                return 'visibility';
            }
        };

        vm.editText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.text) return vm.componentConstruction.edit.text;

                //Default value
                return 'Detalle';
            }
        };

        // remove button
        vm.canRemove = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.connectionComponent.elementsSelection() >= 1) return true;

                //Default value
                return false;
            }
        };

        vm.multipleRemoveOptions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.options) return true;

                //Default value
                return false;
            }
        };

        vm.removeIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.icon) return vm.componentConstruction.remove.icon;

                //Default value
                return 'delete';
            }
        };

        vm.removeText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.text) return vm.componentConstruction.remove.text;

                //Default value
                return 'Eliminar';
            }
        };

        vm.sheetIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.sheetIcon && vm.componentConstruction.sheetIcon.icon) return vm.componentConstruction.sheetIcon.icon;

                //Default value
                return 'poll';
            }
        };

        vm.sheetText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.sheetText && vm.componentConstruction.sheetText.text) return vm.componentConstruction.sheetText.text;

                //Default value
                return 'Descargar Excel';
            }
        };

        vm.canDownloadSheet = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.canDownloadSheet != null) return vm.componentConstruction.canDownloadSheet;

                //Default value
                return true;
            }
        };

        vm.allPagesText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.allPagesText && vm.componentConstruction.allPagesText.text) return vm.componentConstruction.allPagesText.text;

                //Default value
                return 'Descargar todas las páginas';
            }
        };

        vm.currentPageText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.currentPageText && vm.componentConstruction.currentPageText.text) return vm.componentConstruction.currentPageText.text;

                //Default value
                return 'Descargar página actual';
            }
        };

        vm.columnsText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.columnsText) return vm.componentConstruction.columnsText;

                //Default value
                return 'Columnas';
            }
        };

        vm.customSearchText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.customSearchText) return vm.componentConstruction.customSearchText;

                //Default value
                return 'Búsqueda Avanzada';
            }
        };

        vm.propertiesOperators = {
            defaults: function defaults() {
                if (vm.componentConstruction && vm.componentConstruction.defaultOperators) return vm.componentConstruction.defaultOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' }, { display: 'Mayor que', operator: '>' }, { display: 'Menor que', operator: '<' }, { display: 'Mayor o igual que', operator: '>=' }, { display: 'Menor o igual que', operator: '<=' }, { display: 'Diferente', operator: '<>' }, { display: 'Incluya', operator: '%' }];
            },

            strings: function strings() {
                if (vm.componentConstruction && vm.componentConstruction.stringOperators) return vm.componentConstruction.stringOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' }, { display: 'Diferente', operator: '<>' }, { display: 'Incluya', operator: '%' }];
            },

            enums: function enums() {
                if (vm.componentConstruction && vm.componentConstruction.enumOperators) return vm.componentConstruction.enumOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' }, { display: 'Diferente', operator: '<>' }];
            }
        };

        vm.operatorsText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.operatorsText) return vm.componentConstruction.operatorsText;

                //Default value
                return 'Operadores';
            }
        };

        vm.searchIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.searchIcon) return vm.componentConstruction.searchIcon;

                //Default value
                return 'search';
            }
        };

        vm.valueToSearchText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.valueToSearchText) return vm.componentConstruction.valueToSearchText;

                //Default value
                return 'Valor';
            }
        };

        vm.addFilterText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.addFilterText) return vm.componentConstruction.addFilterText;

                //Default value
                return 'Agregar';
            }
        };

        vm.selectColumns = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.selectColumns != null) return vm.componentConstruction.selectColumns;

                //Default value
                return true;
            }
        };

        vm.queryParams = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.queryParams != null) return vm.componentConstruction.queryParams;

                //Default value
                return true;
            }
        };

        vm.isMovement = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.isMovement != null) return vm.componentConstruction.isMovement;

                //Default value
                return false;
            }
        };

        vm.startDateText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.startDateText) return vm.componentConstruction.startDateText;

                //Default value
                return 'Fecha Documento Del';
            }
        };

        vm.startDateProperty = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getStartDateProperty()) return vm.queryDetails.resource.getStartDateProperty();

                //Default value
                return 'fechaDocumento';
            }
        };

        vm.endDateText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.endDateText) return vm.componentConstruction.endDateText;

                //Default value
                return 'Fecha Documento Al';
            }
        };

        vm.endDateProperty = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getEndDateProperty()) return vm.queryDetails.resource.getEndDateProperty();

                //Default value
                return 'fechaDocumento';
            }
        };

        vm.notAppliedText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.notAppliedText) return vm.componentConstruction.notAppliedText;

                //Default value
                return { basic: 'Pendientes', extended: 'Mostrar únicamente registros Pendientes' };
            }
        };

        vm.notApplyProperty = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getNotApplyProperty()) return vm.queryDetails.resource.getNotApplyProperty();

                //Default value
                return 'estado';
            }
        };

        vm.notApplyValue = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.notApplyValue) return vm.componentConstruction.notApplyValue;

                //Default value
                return 'REGISTRADO';
            }
        };

        vm.selectAllText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.selectAllText) return vm.componentConstruction.selectAllText;

                //Default value
                return 'Seleccionar todos';
            }
        };

        vm.pagerConfiguration = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.pagerConfiguration) return vm.componentConstruction.pagerConfiguration;

                //Default value
                return null;
            }
        };

        vm.blockTableOnChangeView = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.blockTableOnChangeView) return vm.componentConstruction.blockTableOnChangeView;

                //Default value
                return false;
            }
            // =======================================================================================================================================================================

            // Methods ===============================================================================================================================================================

        };vm.$onInit = function () {
            setdefaults();
            createconnectioncomponent();
            setDefaultsTable();
            activate();

            checkoutputs();
        };

        function setdefaults() {
            setProperties();
            createComponents();

            if (vm.isMovement.get()) setDateProperties();

            vm.componentConstruction.reload = vm.$onInit;
        };

        function createconnectioncomponent() {
            //object to connect to sub-component
            vm.connectionComponent = {};

            //Pager instance creation
            vm.pager = new EntifixPager(vm.queryDetails, vm.pagerConfiguration.get(), vm.componentConstruction.transformData ? vm.componentConstruction.transformData.columns : []);
            vm.pager.searchTextGetter.set(function () {
                if (vm.canShowSearchText.get() && vm.textBoxSearchValue && vm.textBoxSearchValue.length > 0) return vm.textBoxSearchValue;
                return null;
            });

            vm.pager.searchArrayGetter.set(function () {
                if (vm.canShowSearchText.get() && vm.searchArray && vm.searchArray.length > 0) return vm.searchArray;
                return null;
            });

            vm.pager.columnsSelectedGetter.set(function () {
                if (vm.columnsSelected && vm.columnsSelected.length > 0) return vm.columnsSelected;
                return null;
            });

            vm.connectionComponent.pager = vm.pager;
            vm.connectionComponent.tablePropertiesNavigation = { get: function get() {
                    return vm.tablePropertiesNavigation;
                } };
            vm.connectionComponent.onChangePageSize = vm.onChangePageSize;

            //Connection Component Properties __________________________________________________________________________________________


            //Connection Component Methods _____________________________________________________________________________________________

            vm.connectionComponent.elementsSelection = function () {
                if (vm.connectionComponent.pager != null && vm.connectionComponent.pager.currentData != null && vm.connectionComponent.pager.currentData.length > 0) return vm.connectionComponent.pager.currentData.filter(function (value) {
                    return value.$selected == true;
                }).length;
                return 0;
            };

            vm.connectionComponent.getSelectedElements = function () {
                if (vm.connectionComponent.pager != null && vm.connectionComponent.pager.currentData != null) return vm.connectionComponent.pager.currentData.filter(function (value) {
                    return value.$selected == true;
                });
                return [];
            };

            vm.connectionComponent.sortTable = function (column) {
                if (!column.$selected) column.$selected = true;else column.$selected = false;

                vm.tablePropertiesNavigation.filter(function (p) {
                    return p.display != column.display;
                }).forEach(function (p) {
                    p.$selected = null;
                });
                setClassColumn();
                vm.connectionComponent.pager.sortTableColumns.set([{ property: 'orderby', value: (column.property.pageProperty || column.property.name) + (column.$selected ? ';asc' : ';desc') }]);
                vm.connectionComponent.pager.reload();
            };

            vm.connectionComponent.singleElementSelection = function (element, forceSelection) {
                if (vm.connectionComponent.allowSelection()) {
                    if (vm.connectionComponent.elementsSelection() > 1 || forceSelection) element.$selected = true;else element.$selected = !element.$selected;

                    vm.connectionComponent.pager.currentData.filter(function (value) {
                        return value != element;
                    }).forEach(function (value) {
                        value.$selected = false;
                    });

                    if (element.$selected) vm.connectionComponent.selectedElement = element;else vm.connectionComponent.selectedElement = null;

                    vm.connectionComponent.onChangeElementsSelection();
                }
            };

            vm.connectionComponent.multipleElementsSelection = function (element) {
                if (vm.connectionComponent.allowSelection()) {
                    element.$selected = !element.$selected;

                    if (element.$selected) vm.connectionComponent.selectedElement = element;else {
                        var selection = vm.connectionComponent.pager.currentData.filter(function (value) {
                            return value.$selected === true;
                        });

                        if (selection.length > 0) vm.connectionComponent.selectedElement = selection[0];else vm.connectionComponent.selectedElement = null;
                    }

                    vm.connectionComponent.onChangeElementsSelection();
                }
            };

            vm.connectionComponent.directEditionElement = function (element) {
                if (vm.componentConstruction.edit) {
                    if (vm.blockTableOnChangeView.get()) vm.isChangingView = true;
                    vm.connectionComponent.singleElementSelection(element, true);
                    vm.editElement();
                }
            };

            vm.connectionComponent.checkAll = function (allSelected) {
                if (allSelected && vm.connectionComponent.pager.currentData) vm.connectionComponent.pager.currentData.forEach(function (element) {
                    element.$selected = true;
                });else if (vm.connectionComponent.pager.currentData) vm.connectionComponent.pager.currentData.forEach(function (element) {
                    element.$selected = false;
                });
            };

            vm.connectionComponent.showColumn = function (column) {
                var columnsFilter = vm.columnsSelected.filter(function (c) {
                    return c == column;
                });
                if (columnsFilter && columnsFilter.length > 0) return true;
                return false;
            };

            vm.connectionComponent.onChangeElementsSelection = function () {};
            vm.connectionComponent.allowSelection = function () {
                return true;
            };

            //Transform values to show in columns
            vm.connectionComponent.transformValue = function (value, name) {
                if (value != null && vm.componentConstruction && vm.componentConstruction.transformData) {
                    var transformColumn = vm.componentConstruction.transformData.columns.filter(function (tc) {
                        return tc.property == name;
                    })[0];

                    //Transform dates
                    if (transformColumn.type == 'date' || transformColumn.type == 'datetime') return transformDate(value, transformColumn.type, true);

                    //Transform navigation
                    if (transformColumn.type == 'navigation') {
                        if (_transformValues && _transformValues.length > 0) {
                            var tempCollectionConf = _transformValues.filter(function (tv) {
                                return tv.propertyName == name;
                            });
                            if (tempCollectionConf.length > 0) {
                                var tempCollectionValues = tempCollectionConf[0].enumResult;
                                if (tempCollectionValues && tempCollectionValues.length > 0) {
                                    var idValue = value;
                                    if (value instanceof Object) idValue = transformColumn.resource.getId(value);

                                    var tempValues = tempCollectionValues.filter(function (enumValue) {
                                        return enumValue.Value == idValue;
                                    });
                                    if (tempValues.length > 0) return tempValues[0].Display;
                                }
                            }
                        }
                    }

                    if (transformColumn.type == 'bool') return transformBool(value);
                }
            };
        };

        function createDynamicComponent() {
            var res = BaseComponentFunctions.CreateStringHtmlComponentAndBindings(vm.componentConstruction, 'bindCtrl.connectionComponent.objectBindings');
            vm.stringhtmlcomponent = res.stringhtml;
            vm.connectionComponent.objectBindings = res.objectbindings;
        };

        function activate() {
            if (vm.componentConstruction) createDynamicComponent();

            if (vm.componentBehavior) {
                vm.connectionComponent.showMultiselectColumn = vm.componentBehavior.showMultiselectColumn || false;
                vm.collapsed = vm.componentBehavior.initCollapsed || false;
            }

            vm.connectionComponent.pager.reload();
        };

        function checkoutputs() {
            vm.componentBindingOut = {
                pager: vm.pager,
                recreateDynamicComponent: createDynamicComponent,
                reloadPagination: function reloadPagination() {
                    if (!vm.pager.isLoading.get()) vm.pager.reload();
                },
                allowedActions: { canEdit: vm.canEdit, canRemove: vm.canRemove, canAdd: vm.canAdd },
                cleanFilters: function cleanFilters() {
                    vm.cleanFilters();
                }
            };
        };

        function transformDate(value, type, isForDisplay) {
            if (type == 'date' || type == 'datetime' && value) {
                value = new Date(value);
                var year = value.getFullYear().toString();
                var month = (value.getMonth() + 1).toString();
                var day = value.getDate().toString();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                if (type == 'datetime') {
                    var hours = value.getHours().toString();
                    var minutes = value.getMinutes().toString();
                    var seconds = value.getSeconds().toString();
                    if (hours.length < 2) hours = '0' + hours;
                    if (minutes.length < 2) minutes = '0' + minutes;
                    if (seconds.length < 2) seconds = '0' + seconds;

                    if (isForDisplay) return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
                    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                } else if (isForDisplay) return day + '-' + month + '-' + year;
                return year + '-' + month + '-' + day;
            }
            return value;
        }

        function transformBool(value) {
            if (value) return 'Si';
            return 'No';
        }

        //Defatult behavior for tool box
        vm.searchElement = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSearch) vm.componentBehavior.events.onSearch();

            if (vm.componentConstruction.search.customAction) vm.componentConstruction.search.customAction();else defaultSearch();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSearched) vm.componentBehavior.events.onSearched();
        };

        vm.addElement = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAdd) vm.componentBehavior.events.onAdd();

            if (vm.componentConstruction.add.customAction) vm.componentConstruction.add.customAction();else defaultAdd();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAdded) vm.componentBehavior.events.onAdded();
        };

        vm.editElement = function () {
            var elementToEdit = vm.connectionComponent.selectedElement;

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit) vm.componentBehavior.events.onEdit();

            if (vm.componentConstruction.edit.customAction) vm.componentConstruction.edit.customAction(elementToEdit);else defaultEdit();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdited) vm.componentBehavior.events.onEdited();
        };

        vm.removeElement = function () {
            var elementsToDelete = vm.connectionComponent.getSelectedElements();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemove) vm.componentBehavior.events.onRemove();

            if (vm.componentConstruction.remove.customAction) vm.componentConstruction.remove.customAction(elementsToDelete);else defaultRemove();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemoved) vm.componentBehavior.events.onRemoved();
        };

        vm.processElement = function () {
            var elementToProcess = vm.connectionComponent.selectedElement;
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcess) vm.componentBehavior.events.onProcess();

            if (vm.componentConstruction.process.customAction) vm.componentConstruction.process.customAction(elementToProcess);else defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed) vm.componentBehavior.events.onProcessed();
        };

        function defaultAdd() {};

        function defaultEdit() {};

        function defaultRemove() {
            var message = '¿Está seguro de elminar el registro seleccionado?';

            if (vm.connectionComponent.elementsSelection() > 1) message = '¿Está seguro de eliminar todos los registros seleccionados?';

            EntifixNotification.confirm(message, 'Confirmación requerida', function () {
                var elementsToDelete = vm.connectionComponent.getSelectedElements();

                var requests = vm.connectionComponent.elementsSelection();
                var ok = 0;
                var e = 0;

                var checkCompleted = function checkCompleted(isError) {
                    if (isError) e++;else ok++;

                    if (e + ok >= requests) {
                        if (e == 0) EntifixNotification.success('Todos los registros fueron eliminados exitosamente');else EntifixNotification.error('Algunos registros no pudieron ser eliminados');

                        vm.connectionComponent.pager.reload();
                        vm.queryDetails.resource.onMultipleDeletion.set(false);
                    }
                };

                if (elementsToDelete.length > 1) vm.queryDetails.resource.onMultipleDeletion.set(true);
                vm.connectionComponent.getSelectedElements().forEach(function (element) {
                    vm.queryDetails.resource.deleteEntity(element, function () {
                        checkCompleted(false);
                    }, function () {
                        checkCompleted(true);
                    });
                });
            });
        };

        function defaultProcess() {};

        function defaultSearch() {
            _canShowSearchText = !_canShowSearchText;

            if (!_canShowSearchText) {
                vm.textBoxSearchValue = null;
                cleanSearch();
            }
        };

        // Autosearch control
        var plannedRecharge;

        function rechargeTable() {
            vm.connectionComponent.pager.reload();
            return null;
        };

        function cleanPlannedRecharge() {
            if (plannedRecharge) {
                $timeout.cancel(plannedRecharge);
                plannedRecharge = null;
            }
        };

        function cleanSearch() {
            cleanPlannedRecharge();
            rechargeTable();
        };

        vm.keypressTextBoxSearch = function (keyEvent) {
            cleanPlannedRecharge();
            if (keyEvent.which === 13) rechargeTable();
        };

        vm.onChangeSearch = function () {
            cleanPlannedRecharge();
            plannedRecharge = $timeout(rechargeTable, 1500);
            vm.pager.page = 1;
            filters = null;
            if (vm.queryParams.get()) $state.go('.', { searchText: vm.textBoxSearchValue, page: 1 }, { notify: false });
        };

        //Filters control
        function setProperties() {
            vm.searchArray = [], vm.tableProperties = [], vm.tablePropertiesNavigation = [], vm.columnsSelected = [];
            vm.resourceMembers = vm.queryDetails.resource.getMembersResource.get();
            vm.resourceMembers.forEach(function (property) {
                vm.tableProperties.push({ display: getDisplay(property), type: property.transformType || 'text', property: property });if (property.default) vm.columnsSelected.push(getDisplay(property));
            });
            vm.tablePropertiesNavigation = vm.tableProperties.filter(function (p) {
                return p.property.paginable;
            });
            setClassColumn();
            vm.operators = vm.propertiesOperators.defaults();
        }

        function setClassColumn() {
            vm.tablePropertiesNavigation.forEach(function (property) {
                if (property.$selected) property.class = 'md-column sortable sort-descent';else if (property.$selected == false) property.class = 'md-column sortable sort-ascent';else property.class = 'md-column sortable';
            });
        }

        function setDateProperties() {
            if (!vm.queryDetails.constantFilters) {
                vm.queryDetails.constantFilters = {};
                vm.queryDetails.constantFilters.getter = function () {
                    return [];
                };
            }
        }

        function setDefaultsTable() {
            //Page sets default value
            if ($stateParams.page && vm.queryParams.get()) vm.pager.page = $stateParams.page;

            //Items per page sets default value
            if ($stateParams.itemsPerPage && vm.queryParams.get()) vm.pager.size = $stateParams.itemsPerPage;

            //Search text sets default value
            if ($stateParams.searchText && vm.queryParams.get()) {
                vm.textBoxSearchValue = $stateParams.searchText;
                vm.onChangeSearch();
            }

            //Custom search array sets default value
            if ($stateParams.customSearch && vm.queryParams.get()) {
                vm.customSearch = true;
                vm.searchArray = JSON.parse($stateParams.customSearch);
                vm.textBoxSearchValueChips = JSON.parse($stateParams.chips);
            } else vm.customSearch = false;

            //Date filters
            if ($stateParams.startDate && vm.queryParams.get()) vm.startDate = new Date($stateParams.startDate);

            if ($stateParams.endDate && vm.queryParams.get()) vm.endDate = new Date($stateParams.endDate);

            if (vm.startDate || vm.endDate) vm.searchItemsDate(true);
        }

        function createComponents() {
            vm.customSearchCC = {
                title: { text: vm.customSearchText.get() },
                tooltip: { text: vm.customSearchText.get() },
                isSwitch: true,
                isForm: false,
                includeValue: false
            };

            vm.valueToSearchCC = {
                title: { text: vm.valueToSearchText.get() },
                hasTime: false,
                hasMinutes: false,
                isForm: false,
                mapping: { method: function method(entity) {
                        return entity.label;
                    } }
            };

            vm.valueToSearchDTCC = {
                title: { text: vm.valueToSearchText.get() },
                isForm: false
            };

            vm.valueToSearchQD = {
                title: { text: vm.valueToSearchText.get() },
                isForm: false
            };

            vm.chipsCC = _defineProperty({
                isForm: false,
                transformChip: vm.transformchip,
                onRemove: vm.onremove,
                readOnly: true
            }, 'onRemove', removeChip);

            vm.startDateCC = {
                title: { text: vm.startDateText.get() },
                isForm: false,
                hasMinutes: false,
                hasTime: false
            };

            vm.endDateCC = {
                title: { text: vm.endDateText.get() },
                isForm: false,
                hasMinutes: false,
                hasTime: false
            };

            vm.notAppliedCC = {
                title: { text: vm.notAppliedText.get().basic },
                tooltip: { text: vm.notAppliedText.get().extended },
                isSwitch: true,
                isForm: false,
                includeValue: false
            };
        }

        vm.onChangeColumn = function () {
            vm.valueToSearch = null;

            if (vm.columnToSearch) {
                if (vm.columnToSearch.property && vm.columnToSearch.property.resource) vm.valueToSearchQD = { resource: new EntifixResource(vm.columnToSearch.property.resource) };

                if (vm.columnToSearch.type == 'text') vm.operators = vm.propertiesOperators.strings();else if (vm.columnToSearch.type == 'enum') vm.operators = vm.propertiesOperators.enums();else vm.operators = vm.propertiesOperators.defaults();
            }
        };

        vm.onChangeSwitch = function (value) {
            cleanCustomSearchValues(true, value);
            vm.connectionComponent.pager.reload();
        };

        vm.onChangePageSize = function (size) {
            if (vm.pager.totalData < vm.pager.size) {
                vm.pager.page = 1;
                if (vm.queryParams.get()) $state.go('.', { itemsPerPage: vm.pager.size, page: 1 }, { notify: false });
            } else if (vm.queryParams.get()) $state.go('.', { itemsPerPage: vm.pager.size }, { notify: false });

            if (!size) {
                if (!isFirstLoad) vm.pager.reload();else isFirstLoad = false;
            } else {
                vm.pager.size = size;
                vm.pager.reload();
            }
        };

        vm.onChangePage = function () {
            vm.pager.reload();
            if (vm.queryParams.get()) $state.go('.', { page: vm.pager.page }, { notify: false });
        };

        vm.addChip = function () {
            if (vm.columnToSearch.display && vm.operator.operator && vm.valueToSearch) {
                vm.valueToSearch = transformDate(vm.valueToSearch, vm.columnToSearch.type);
                if (vm.operator.operator == '%') vm.textBoxSearchValueChips.push(vm.columnToSearch.display + ' = ' + vm.operator.operator + vm.valueToSearch + vm.operator.operator);else vm.textBoxSearchValueChips.push(vm.columnToSearch.display + ' ' + vm.operator.operator + ' ' + vm.valueToSearch);
                vm.searchArray.push({ property: vm.columnToSearch.property, operator: vm.operator.operator, value: vm.valueToSearch });
            }
            cleanCustomSearchValues();
            setParametersAddChip();
            vm.connectionComponent.pager.reload();
        };

        function removeChip(chip, index) {
            vm.searchArray.splice(index, 1);
            if (vm.searchArray.length > 0 && vm.textBoxSearchValueChips.length > 0 && vm.queryParams.get()) $state.go('.', { customSearch: JSON.stringify(vm.searchArray), chips: JSON.stringify(vm.textBoxSearchValueChips) }, { notify: false });else if (vm.queryParams.get()) $state.go('.', { customSearch: null, chips: null }, { notify: false });
            vm.connectionComponent.pager.reload();
            filters = null;
        }

        function cleanCustomSearchValues(cleanParams, value, cleanDates) {
            vm.columnToSearch = null;
            vm.operator = null;
            vm.valueToSearch = null;
            vm.textBoxSearchValue = null;
            filters = null;

            if (cleanParams) {
                if (!value) {
                    vm.searchArray = [];
                    vm.pager.page = 1;
                    if (vm.queryParams.get()) $state.go('.', { customSearch: null, chips: null, page: vm.pager.page }, { notify: false });
                } else if (vm.queryParams.get()) $state.go('.', { customSearch: null, chips: null, searchText: null }, { notify: false });
                vm.textBoxSearchValueChips = [];
            }

            if (cleanDates) {
                if (vm.queryDetails.constantFilters) vm.queryDetails.constantFilters.getter = function () {
                    return [];
                };
                vm.startDate = null;
                vm.endDate = null;
                vm.notApplied = false;
                $state.go('.', { customSearch: null, chips: null, searchText: null, page: vm.pager.page, itemsPerPage: vm.pager.size, startDate: null, endDate: null }, { notify: false });
            }
        }

        vm.cleanFilters = function () {
            cleanCustomSearchValues(true, false, true);
            vm.connectionComponent.pager.reload();
        };

        function setParametersAddChip() {
            vm.pager.page = 1;
            if (vm.queryParams.get()) $state.go('.', { customSearch: JSON.stringify(vm.searchArray), chips: JSON.stringify(vm.textBoxSearchValueChips), page: vm.pager.page }, { notify: false });
        }

        function getDisplay(property) {
            if (property.display) return property.display;
            if (property.name) return getCleanedString(property.name);
            return null;
        }

        function getCleanedString(stringToClean) {
            return stringToClean.charAt(0).toUpperCase() + stringToClean.substring(1, stringToClean.length);
        }

        vm.searchItemsDate = function (skipReload) {
            vm.queryDetails.constantFilters.getter = function () {
                return [{ property: vm.startDateProperty.get(), value: 'gte;' + transformDate(vm.startDate, 'datetime') }, { property: vm.endDateProperty.get(), value: 'lte;' + transformDate(vm.endDate, 'datetime') }, { property: vm.notApplyProperty.get(), value: vm.notApplyValue.get() }];
            };
            if (!skipReload) vm.connectionComponent.pager.reload();
        };

        vm.onChangeDateStart = function (value) {
            $state.go('.', { startDate: transformDate(vm.startDate, 'datetime') }, { notify: false });
        };

        vm.onChangeDateEnd = function (value) {
            $state.go('.', { endDate: transformDate(vm.endDate, 'datetime') }, { notify: false });
        };

        vm.onChangeNotApplied = function (value) {
            vm.queryDetails.constantFilters = {};
            var constantFilters = [];
            if (value) constantFilters.push({ property: vm.notApplyProperty.get(), value: vm.notApplyValue.get() });
            if (vm.startDate && vm.endDate) constantFilters.push({ property: vm.startDateProperty.get(), value: 'gte;' + transformDate(vm.startDate, 'datetime') }, { property: vm.endDateProperty.get(), value: 'lte;' + transformDate(vm.endDate, 'datetime') });
            vm.queryDetails.constantFilters.getter = function () {
                return constantFilters;
            };
            vm.connectionComponent.pager.reload();
        };

        vm.selectAllItems = function () {
            onLoading = false;
            if (cont % 2 == 0) {
                vm.columnsSelected = [];
                vm.resourceMembers.forEach(function (property) {
                    vm.columnsSelected.push(getDisplay(property));
                });
            } else {
                vm.columnsSelected = [];
                vm.resourceMembers.forEach(function (property) {
                    if (property.default) vm.columnsSelected.push(getDisplay(property));
                });
            }
            cont++;
        };

        vm.reloadAllSelected = function () {
            if (!onLoading && cont % 2 != 0) vm.columnsSelected.push(vm.selectAllText.get());else if (!onLoading) {
                var index = vm.columnsSelected.indexOf(vm.selectAllText.get());
                if (index > 0) vm.columnsSelected.splice(index, 1);
            }
        };

        var originatorEv;
        vm.openSheetMenu = function ($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        var filters, templateUrl;
        vm.fil = filters;
        vm.downloadSheet = function (allPages) {
            if (!filters) filters = vm.queryDetails.resource.getCompleteFiltersUrl.get(vm.textBoxSearchValue, vm.searchArray, vm.columnsSelected, vm.getConstantFilters()) + '&export=true';

            templateUrl = vm.queryDetails.resource.getCompleteResourceUrl.get();

            if (allPages) templateUrl += filters;else templateUrl += '/' + (vm.pager.page - 1) * vm.pager.size + '/' + vm.pager.size + filters;

            vm.queryDetails.resource.getFile(templateUrl, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        };

        vm.getConstantFilters = function () {
            var filters = [];
            if (vm.pager.getConstantFilters()) filters = filters.concat(vm.pager.getConstantFilters());
            if (vm.queryDetails.sort) filters = filters.concat(vm.queryDetails.sort);
            return filters;
        };

        // =======================================================================================================================================================================
    };

    var component = {
        //templateUrl: 'dist/shared/components/entifixTable/entifixTable.html',
        template: '<br/> \
                    <div ng-class="{\'whirl double-up whirlback\': bindCtrl.isChangingView}"> \
                        <md-card md-whiteframe="4" ng-if="bindCtrl.canSearch.get()" layout-padding layout="column"> \
                            <div ng-if="bindCtrl.isMovement.get()"> \
                                <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex> \
                                    <div layout-xs="column" layout-gt-xs="row" flex> \
                                        <div flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.startDate" component-construction="bindCtrl.startDateCC" on-change="bindCtrl.onChangeDateStart(value)"></entifix-date-time-picker> \
                                        </div> \
                                        <div flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.endDate" component-construction="bindCtrl.endDateCC" on-change="bindCtrl.onChangeDateEnd(value)"></entifix-date-time-picker> \
                                        </div> \
                                    </div> \
                                    <div layout-xs="column" layout-gt-xs="row" flex> \
                                        <div flex layout layout-align="center center"> \
                                            <md-button class="md-primary btn-success" ng-click="bindCtrl.searchItemsDate()" ng-disabled="!bindCtrl.startDate || !bindCtrl.endDate"> \
                                                <md-icon class="material-icons">{{bindCtrl.searchIcon.get()}}</md-icon> &nbsp;{{bindCtrl.searchText.get()}} \
                                            </md-button> \
                                        </div> \
                                        <div flex layout layout-align="center center"> \
                                            <entifix-checkbox-switch value-model="bindCtrl.notApplied" component-construction="bindCtrl.notAppliedCC" on-change="bindCtrl.onChangeNotApplied(value)"></entifix-checkbox-switch> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                            <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex ng-if="bindCtrl.customSearch"> \
                                <div layout-xs="column" layout-gt-xs="row" flex> \
                                    <div flex> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.columnsText.get()}}</label> \
                                            <md-select \
                                                ng-model="bindCtrl.columnToSearch" \
                                                aria-label="{{bindCtrl.columnsText.get()}}" \
                                                ng-change="bindCtrl.onChangeColumn()"> \
                                                <md-option ng-repeat="item in bindCtrl.tablePropertiesNavigation" ng-value="item">{{item.display}}</md-option> \
                                            </md-select> \
                                        </md-input-container> \
                                    </div> \
                                    <div flex> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.operatorsText.get()}}</label> \
                                            <md-select \
                                                ng-model="bindCtrl.operator" \
                                                aria-label="{{bindCtrl.operatorsText.get()}}"> \
                                                <md-option ng-repeat="item in bindCtrl.operators" ng-value="item">{{item.display}}</md-option> \
                                            </md-select> \
                                        </md-input-container> \
                                    </div> \
                                </div> \
                                <div layout-sm="column" layout-gt-sm="row" flex> \
                                    <div flex> \
                                        <div ng-if="!bindCtrl.columnToSearch || bindCtrl.columnToSearch.type == \'text\' || bindCtrl.columnToSearch.type == \'navigation\'" flex> \
                                            <entifix-input value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC"></entifix-input> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'date\'" flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC"></entifix-date-time-picker> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'datetime\'" flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchDTCC"></entifix-date-time-picker> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'enum\'" flex> \
                                            <entifix-autocomplete value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC" query-details="bindCtrl.valueToSearchQD" component-binding-out="bindCtrl.valueToSearchE"></entifix-autocomplete> \
                                        </div> \
                                    </div> \
                                    <div flex layout layout-align="center center"> \
                                        <md-button class="md-primary btn-success" ng-click="bindCtrl.addChip()" ng-disabled="!bindCtrl.columnToSearch || !bindCtrl.operator || !bindCtrl.valueToSearch"> \
                                            <md-icon class="material-icons">{{bindCtrl.searchIcon.get()}}</md-icon> &nbsp;{{bindCtrl.addFilterText.get()}} \
                                        </md-button> \
                                    </div> \
                                </div> \
                            </div> \
                            <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex> \
                                <div layout-xs="column" layout-gt-xs="row" flex-xs="100" flex-gt-sm="75"> \
                                    <div flex ng-if="!bindCtrl.customSearch"> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.searchText.get()}}</label> \
                                            <input type="text" ng-model="bindCtrl.textBoxSearchValue" ng-keypress="bindCtrl.keypressTextBoxSearch($event)" ng-change="bindCtrl.onChangeSearch()"> \
                                        </md-input-container> \
                                    </div> \
                                    <div flex ng-if="bindCtrl.customSearch"> \
                                        <entifix-chip value-model="bindCtrl.textBoxSearchValueChips" component-construction="bindCtrl.chipsCC"></entifix-chip> \
                                    </div> \
                                </div> \
                                <div layout-xs="column" layout-gt-xs="row" flex-xs="100" flex-gt-sm="25"> \
                                    <div flex layout layout-align="center center"> \
                                        <div flex layout layout-align="center center"> \
                                            <entifix-checkbox-switch value-model="bindCtrl.customSearch" component-construction="bindCtrl.customSearchCC" on-change="bindCtrl.onChangeSwitch(v)"></entifix-checkbox-switch> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                        </md-card> \
                        <div layout="column"> \
                            <md-card md-whiteframe="4"> \
                                <md-content layout-padding> \
                                    <div layout="column"> \
                                        <div flex layout-align="end center"> \
                                            <section layout-xs="column" layout="row" layout-align="end center"> \
                                                <div> \
                                                    <md-button class="md-primary btn-success" ng-click="bindCtrl.addElement()" ng-disabled="!(bindCtrl.canAdd.get() && !bindCtrl.multipleAddOptions.get())" ng-if="bindCtrl.componentConstruction.add"> \
                                                        <md-icon class="material-icons">{{bindCtrl.addIcon.get()}}</md-icon> &nbsp;{{bindCtrl.addText.get()}} \
                                                    </md-button> \
                                                    <md-button class="md-warn btn-danger" ng-click="bindCtrl.removeElement()" ng-disabled="!(bindCtrl.canRemove.get() && !bindCtrl.multipleRemoveOptions.get())"  ng-if="bindCtrl.componentConstruction.remove"> \
                                                        <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon> &nbsp;{{bindCtrl.removeText.get()}} \
                                                    </md-button> \
                                                    <md-button class="md-accent btn-warning" ng-click="bindCtrl.editElement()" ng-disabled="!(bindCtrl.canEdit.get() && !bindCtrl.multipleEditOptions.get())" ng-if="bindCtrl.componentConstruction.edit"> \
                                                        <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon> &nbsp;{{bindCtrl.editText.get()}} \
                                                    </md-button> \
                                                    <md-menu md-position-mode="target-right target" ng-click="bindCtrl.openSheetMenu($mdMenu, $event)" ng-if="bindCtrl.canDownloadSheet.get()"> \
                                                        <md-button class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.ds()"> \
                                                            <md-tooltip>{{bindCtrl.sheetText.get()}}</md-tooltip> \
                                                            <md-icon class="material-icons">{{bindCtrl.sheetIcon.get()}}</md-icon> \
                                                        </md-button> \
                                                        <md-menu-content> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadSheet(true)"> \
                                                                    <md-tooltip>{{bindCtrl.allPagesText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_none</md-icon>{{bindCtrl.allPagesText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                            <md-menu-divider></md-menu-divider> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadSheet()"> \
                                                                    <md-tooltip>{{bindCtrl.currentPageText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_1</md-icon>{{bindCtrl.currentPageText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                        </md-menu-content> \
                                                    </md-menu> \
                                                </div> \
                                            </section> \
                                        </div> \
                                        <div class="md-table-head" layout> \
                                            <div flex flex-gt-md="65" layout layout-align="start center" ng-if="bindCtrl.selectColumns.get()"> \
                                                <md-input-container> \
                                                    <label>{{bindCtrl.columnsText.get()}}</label> \
                                                    <md-select \
                                                        ng-model="bindCtrl.columnsSelected" \
                                                        multiple \
                                                        aria-label="{{bindCtrl.columnsText.get()}}" \
                                                        ng-change="bindCtrl.reloadAllSelected()"> \
                                                        <md-option ng-click="bindCtrl.selectAllItems()">{{bindCtrl.selectAllText.get()}}</md-option> \
                                                        <md-option ng-repeat="item in bindCtrl.tableProperties">{{item.display}}</md-option> \
                                                    </md-select> \
                                                </md-input-container> \
                                            </div> \
                                            <div flex layout layout-align="end center"> \
                                                <md-input-container ng-show="bindCtrl.pager.showPageControls.get()"> \
                                                    <md-select \
                                                        ng-model="bindCtrl.pager.size" \
                                                        ng-change="bindCtrl.onChangePageSize()" \
                                                        aria-label="Page Controls"> \
                                                        <md-option ng-repeat="optionSize in bindCtrl.pager.pageSizes" ng-value="optionSize">{{optionSize}}</md-option> \
                                                    </md-select> \
                                                </md-input-container> \
                                            </div> \
                                        </div> \
                                        <div class="md-table-container"> \
                                            <div compile="bindCtrl.stringhtmlcomponent"></div> \
                                        </div> \
                                        <br/> \
                                        <div layout-xs="column" layout-md="row" layout-lg="row" layout-xl="row"> \
                                            <div flex flex-md="35" flex-md="35" flex-lg="30" flex-xl="35"> \
                                                <h5>{{bindCtrl.pager.getDescriptionText()}}</h5> \
                                            </div> \
                                            <div flex layout layout-align="end center"> \
                                                <grid-pagination \
                                                    max-size="10" \
                                                    boundary-links="true" \
                                                    class="pagination mdl-shadow--2dp" \
                                                    ng-if="bindCtrl.pager.totalData > bindCtrl.pager.size" \
                                                    total-items="bindCtrl.pager.totalData" \
                                                    ng-model="bindCtrl.pager.page" \
                                                    ng-change="bindCtrl.onChangePage()" \
                                                    items-per-page="bindCtrl.pager.size"> \
                                                </grid-pagination> \
                                            </div> \
                                        </div> \
                                    </div> \
                                </md-content> \
                            </md-card> \
                        </div> \
                    </div>',
        controller: componentController,
        controllerAs: 'bindCtrl',
        bindings: {
            componentConstruction: '<',
            componentBehavior: '<',
            componentBindingOut: '=',
            queryDetails: '='
        }

        //Register component 
    };module.component('entifixTable', component);
})();
'use strict';

(function () {
    'use strict';

    var entifixEnvironmentModule = angular.module('entifix-js');

    // CONTROLLER ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    entifixEnvironmentModule.controller('EntifixEntityModalController', controller);

    controller.$inject = ['$mdDialog', 'EntifixNotifier', '$timeout', 'BaseComponentFunctions', 'EntifixNotification', '$rootScope', 'componentConstruction', 'componentBehavior', 'componentBindingOut', 'queryDetails'];

    function controller($mdDialog, EntifixNotifier, $timeout, BaseComponentFunctions, EntifixNotification, $rootScope, componentConstruction, componentBehavior, componentBindingOut, queryDetails) {
        var vm = this;

        vm.componentConstruction = componentConstruction();
        vm.componentBehavior = componentBehavior();
        vm.componentBindingOut = componentBindingOut();
        vm.queryDetails = queryDetails();

        // Properties & Fields ===================================================================================================================================================

        //Fields
        var _isloading = false;
        var _notifier = null;

        var _statesForm = {
            edit: 1,
            view: 2
        };

        var _state = _statesForm.edit;

        // Main

        vm.entity = {
            get: function get() {
                if (vm.connectionComponent) return vm.connectionComponent.entity;
                return null;
            },
            set: function set(value) {
                if (vm.connectionComponent) {
                    var oldValue = vm.connectionComponent.entity;
                    vm.connectionComponent.entity = value;

                    if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onChangeEntity) vm.componentBehavior.events.onChangeEntity(oldValue, value);
                }
            }
        };

        vm.isLoading = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isLoading.get();
                return false;
            }
        };

        vm.isSaving = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isSaving.get();
                return false;
            }
        };

        vm.isDeleting = {
            get: function get() {
                if (vm.queryDetails && vm.queryDetails.resource) return vm.queryDetails.resource.isDeleting.get();
                return false;
            }
        };

        vm.onTask = {
            get: function get() {
                var response = vm.isLoading.get() || vm.isSaving.get() || vm.isDeleting.get();

                return response;
            }
        };

        vm.size = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.size) return vm.componentConstruction.size;

                //Default value
                return 'md-md';
            }
        };

        vm.title = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.title) {
                    if (vm.componentConstruction.title.entityName) {
                        if (!vm.connectionComponent.showEditableFields.get()) return 'Editar ' + vm.componentConstruction.title.entityName;else return 'Agregar ' + vm.componentConstruction.title.entityName;
                    }

                    if (vm.componentConstruction.title.entityProperty && vm.entity.get()) {
                        if (!vm.connectionComponent.showEditableFields.get()) return 'Editar ' + vm.entity.get()[vm.componentConstruction.title.entityProperty];else return 'Agregar ' + vm.entity.get()[vm.componentConstruction.title.entityProperty];
                    }

                    if (vm.componentConstruction.title.getter) return vm.componentConstruction.title.getter();

                    if (vm.componentConstruction.title.text) return vm.componentConstruction.title.text;
                }

                //Default value
                if (!vm.connectionComponent.showEditableFields.get()) return 'Editar Registro';
                return 'Agregar Registro';
            }
        };

        vm.icon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.icon) {
                    if (vm.componentConstruction.icon.text) return vm.componentConstruction.icon.text;
                }

                //Default value
                return 'menu';
            }
        };

        // cancel button
        vm.canCancel = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.cancelIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.icon) return vm.componentConstruction.cancel.icon;

                //Default value
                return 'clear';
            }
        };

        vm.cancelText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.text) {
                    if (vm.componentConstruction.cancel.text.getter) return vm.componentConstruction.cancel.text.getter();else if (vm.componentConstruction.cancel.text) return vm.componentConstruction.cancel.text;
                };

                //Default value
                return 'Cancelar';
            }
        };

        vm.cancelHref = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.href) {
                    if (vm.componentConstruction.cancel.href instanceof Object && vm.componentConstruction.cancel.href.getter) return vm.componentConstruction.cancel.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.cancel.href;
                }

                //Default value
                return null;
            }
        };

        // ok button
        vm.canOk = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && _state == _statesForm.view) return true;

                //Default value
                return false;
            }
        };

        vm.okIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.componentConstruction.ok.icon) return vm.componentConstruction.ok.icon;

                //Default value
                return 'done';
            }
        };

        vm.okText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.componentConstruction.ok.text) return '' + vm.componentConstruction.ok.text;

                //Default value
                return 'Aceptar';
            }
        };

        // edit button
        vm.canEdit = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.view) return true;

                //Default value
                return false;
            }
        };

        vm.editIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.icon) return vm.componentConstruction.edit.icon;

                //Default value
                return 'create';
            }
        };

        vm.editText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit) {
                    if (vm.componentConstruction.edit.text instanceof Object && vm.componentConstruction.edit.text.getter) return vm.componentConstruction.edit.text.getter();else if (vm.componentConstruction.edit.text) return vm.componentConstruction.edit.text;
                };

                //Default value
                return 'Editar';
            }
        };

        vm.editHref = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.href) {
                    if (vm.componentConstruction.edit.href instanceof Object && vm.componentConstruction.edit.href.getter) return vm.componentConstruction.edit.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.edit.href;
                }

                //Default value
                return null;
            }
        };

        // save button
        vm.canSave = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.saveIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.componentConstruction.save.icon) return '' + vm.componentConstruction.save.icon;

                //Default value
                return 'save';
            }
        };

        vm.saveText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save) {
                    if (vm.componentConstruction.save.text instanceof Object && vm.componentConstruction.save.text.getter) return vm.componentConstruction.save.text.getter();else if (vm.componentConstruction.save.text) return vm.componentConstruction.save.text;
                };

                //Default value
                return 'Guardar';
            }
        };

        vm.saveHref = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.componentConstruction.save.href) {
                    if (vm.componentConstruction.save.href instanceof Object && vm.componentConstruction.save.href.getter) return vm.componentConstruction.save.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.save.href;
                }

                //Default value
                return null;
            }
        };

        // remove button
        vm.canRemove = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.edit) return true;

                //Default value
                return false;
            }
        };

        vm.removeIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.icon) return vm.componentConstruction.remove.icon;

                //Default value
                return 'delete';
            }
        };

        vm.removeText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove) {
                    if (vm.componentConstruction.remove.text instanceof Object && vm.componentConstruction.remove.text.getter) return vm.componentConstruction.remove.text.getter();else if (vm.componentConstruction.remove.text) return vm.componentConstruction.remove.text;
                };

                //Default value
                return 'Eliminar';
            }
        };

        vm.removeHref = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.href) {
                    if (vm.componentConstruction.remove.href instanceof Object && vm.componentConstruction.remove.href.getter) return vm.componentConstruction.remove.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.remove.href;
                }

                //Default value
                return null;
            }
        };

        //process button
        vm.canProcess = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && _state == _statesForm.view && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && !vm.queryDetails.resource.isProcessedEntity(vm.entity.get())) return true;

                //Default value
                return false;
            }
        };

        vm.processIcon = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.componentConstruction.process.icon) return vm.componentConstruction.process.icon;

                //Default value
                return 'done_all';
            }
        };

        vm.processText = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.componentConstruction.process.text) return '' + vm.componentConstruction.process.text;

                //Default value
                return 'Procesar';
            }
        };

        vm.allowActions = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.allowActions != null) return vm.componentConstruction.allowActions;

                //Default value
                return true;
            }
        };

        vm.saveTooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.saveTooltip) return vm.componentConstruction.saveTooltip;

                //Default value
                return 'Todos los campos obligatorios deben estar correctos';
            }
        };

        vm.historyTooltip = {
            get: function get() {
                if (vm.componentConstruction && vm.componentConstruction.historyTooltip) return vm.componentConstruction.historyTooltip;

                //Default value
                return 'Mostrar Bitácora';
            }
        };

        var _canViewHistory = true;
        vm.canViewHistory = {
            get: function get() {
                if (_canViewHistory) return true;
                return false;
            },

            set: function set(value) {
                _canViewHistory = value;
            }
        };

        vm.history = {
            get: function get() {
                return $rootScope.showHistory;
            },
            set: function set() {
                $rootScope.showHistory = !$rootScope.showHistory;
            }
        };

        // =======================================================================================================================================================================

        // Methods ===============================================================================================================================================================

        function activate() {
            setdefaults();
            createconnectioncomponent();

            if (vm.componentConstruction) createDynamicComponent();

            checkoutputs();
        };

        function setdefaults() {
            _notifier = new EntifixNotifier(vm.queryDetails.resource);
        };

        function createconnectioncomponent() {
            vm.connectionComponent = {};

            // Connection Component Properties __________________________________________________________________________________________
            // ==========================================================================================================================

            vm.connectionComponent.IsCreating = true;

            if (vm.componentBindingOut.object) {
                _state = _statesForm.view;
                vm.entity.set(vm.componentBindingOut.object);
            } else vm.entity.set({});

            vm.connectionComponent.entity = vm.entity.get();
            if (vm.queryDetails.resource) {
                vm.connectionComponent.resource = vm.queryDetails.resource;
            }

            vm.connectionComponent.showEditableFields = {
                get: function get() {
                    return _state == _statesForm.edit;
                },
                set: function set(value) {
                    if (value == true) _state = _statesForm.edit;
                    if (value == false) _state = _statesForm.view;
                }
            };

            vm.connectionComponent.isSaving = vm.isSaving;
            vm.connectionComponent.history = vm.history;
            vm.connectionComponent.canViewHistory = vm.canViewHistory;

            vm.connectionComponent.canCancel = { get: function get() {
                    return vm.canCancel.get();
                } };
            vm.connectionComponent.canRemove = { get: function get() {
                    return vm.canRemove.get();
                } };
            vm.connectionComponent.canSave = { get: function get() {
                    return vm.canSave.get();
                } };
            vm.connectionComponent.canEdit = { get: function get() {
                    return vm.canEdit.get();
                } };
            vm.connectionComponent.canOk = { get: function get() {
                    return vm.canOk.get();
                } };
            vm.connectionComponent.canProcess = { get: function get() {
                    return vm.canProcess.get();
                } };

            vm.connectionComponent.cancelText = { get: function get() {
                    return vm.cancelText.get();
                } };
            vm.connectionComponent.removeText = { get: function get() {
                    return vm.removeText.get();
                } };
            vm.connectionComponent.saveText = { get: function get() {
                    return vm.saveText.get();
                } };
            vm.connectionComponent.editText = { get: function get() {
                    return vm.editText.get();
                } };
            vm.connectionComponent.okText = { get: function get() {
                    return vm.okText.get();
                } };
            vm.connectionComponent.processText = { get: function get() {
                    return vm.processText.get();
                } };

            vm.connectionComponent.cancelIcon = { get: function get() {
                    return vm.cancelIcon.get();
                } };
            vm.connectionComponent.removeIcon = { get: function get() {
                    return vm.removeIcon.get();
                } };
            vm.connectionComponent.saveIcon = { get: function get() {
                    return vm.saveIcon.get();
                } };
            vm.connectionComponent.editIcon = { get: function get() {
                    return vm.editIcon.get();
                } };
            vm.connectionComponent.okIcon = { get: function get() {
                    return vm.okIcon.get();
                } };
            vm.connectionComponent.processIcon = { get: function get() {
                    return vm.processIcon.get();
                } };

            vm.connectionComponent.cancel = { invoke: function invoke() {
                    vm.cancel();
                } };
            vm.connectionComponent.remove = { invoke: function invoke() {
                    vm.remove();
                } };
            vm.connectionComponent.edit = { invoke: function invoke() {
                    vm.edit();
                } };
            vm.connectionComponent.ok = { invoke: function invoke() {
                    vm.ok();
                } };
            vm.connectionComponent.save = { invoke: function invoke() {
                    vm.save();
                } };
            vm.connectionComponent.process = { invoke: function invoke() {
                    vm.process();
                } };

            vm.connectionComponent.onTask = { get: function get() {
                    return vm.onTask.get();
                } };
            vm.connectionComponent.saveTooltip = { get: function get() {
                    return vm.saveTooltip.get();
                } };
            vm.connectionComponent.entityForm = { valid: function valid() {
                    return vm.entityForm.$valid;
                } };

            vm.connectionComponent.evaluateErrors = {
                get: function get(name) {
                    return evaluateErrors(name);
                }
            };

            function evaluateErrors(property) {
                var errors = {};
                for (var error in vm.entityForm.$error) {
                    var propertyValue = vm.entityForm.$error[error];

                    if (propertyValue instanceof Array) propertyValue.forEach(function (element) {
                        if (element.$name == property) errors[error] = true;
                    });
                }

                return errors;
            }

            // ==========================================================================================================================


            // Connection Component Methods _____________________________________________________________________________________________
            // ==========================================================================================================================

            var searchForm = function searchForm() {
                if (vm.entityForm) vm.connectionComponent.entityForm = vm.entityForm;else $timeout(searchForm, 200);
            };

            searchForm();
        };

        function createDynamicComponent() {
            var res = BaseComponentFunctions.CreateStringHtmlComponentAndBindings(vm.componentConstruction, 'bindCtrl.connectionComponent.objectBindings');
            vm.stringhtmlcomponent = res.stringhtml;
            vm.connectionComponent.objectBindings = res.objectbindings;
        };

        function checkoutputs() {
            vm.componentBindingOut = {
                showEditableFields: vm.connectionComponent.showEditableFields,
                entity: vm.entity,
                recreateDynamicComponent: createDynamicComponent
            };

            if (vm.componentBehavior && vm.componentBehavior.afterConstruction) vm.componentBehavior.afterConstruction();
        };

        vm.cancel = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCancel) vm.componentBehavior.events.onCancel();

            if (vm.componentConstruction.cancel.customAction) vm.componentConstruction.cancel.customAction();else defaultCancel();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCanceled) vm.componentBehavior.events.onCanceled();
        };

        vm.ok = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onOk) vm.componentBehavior.events.onOk();

            if (vm.componentConstruction.ok.customAction) vm.componentConstruction.ok.customAction(defaultOk);else defaultOk();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAfterOk) vm.componentBehavior.events.onAfterOk();
        };

        vm.edit = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit) vm.componentBehavior.events.onEdit();

            if (vm.componentConstruction.edit.customAction) vm.componentConstruction.edit.customAction(vm.entity.get(), defaultOk);else defaultEdit();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdited) vm.componentBehavior.events.onEdited();
        };

        vm.save = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSave) vm.componentBehavior.events.onSave(vm.entity.get());

            if (vm.componentConstruction.save.customAction) vm.componentConstruction.save.customAction(vm.entity.get(), defaultOk, setViewState);else defaultSave();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSaved) vm.componentBehavior.events.onSaved();
        };

        vm.remove = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemove) vm.componentBehavior.events.onRemove();

            if (vm.componentConstruction.remove.customAction) vm.componentConstruction.remove.customAction(vm.entity.get(), defaultOk);else defaultRemove();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemoved) vm.componentBehavior.events.onRemoved();
        };

        vm.process = function () {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcess) vm.componentBehavior.events.onProcess();

            if (vm.componentConstruction.process.customAction) vm.componentConstruction.process.customAction(vm.entity.get(), defaultOk, setViewState);else defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed) vm.componentBehavior.events.onProcessed();
        };

        function defaultCancel() {
            if (vm.queryDetails.resource.isNewEntity(vm.connectionComponent.entity)) $mdDialog.cancel();else {
                _state = _statesForm.view;
                reloadEntity();
            }
        };

        function defaultOk() {
            $mdDialog.hide();
        };

        function defaultEdit() {
            _state = _statesForm.edit;
        };

        function defaultSave() {
            vm.queryDetails.resource.saveEntity(vm.connectionComponent.entity, function (response, saveSuccess) {
                if (saveSuccess) {
                    if (response && response.data.data) vm.entity.set(response.data.data);
                    defaultOk();
                }
            });
        };

        function defaultProcess() {
            vm.connectionComponent.entity[vm.queryDetails.resource.getOpProperty.get()] = 'PROCESAR';
            defaultSave();
        };

        function defaultRemove() {
            EntifixNotification.confirm('Está seguro de eliminar el registro', 'Confirmación requerida', function () {
                vm.queryDetails.resource.deleteEntity(vm.connectionComponent.entity, function () {
                    defaultOk();
                });
            });
        };

        vm.submit = function () {
            vm.save();
        };

        function reloadEntity() {
            if (vm.entity.get()) vm.queryDetails.resource.loadAsResource(vm.entity.get(), function (entityReloaded) {
                vm.entity.set(entityReloaded);
            });
        };

        // =======================================================================================================================================================================

        function setViewState(view, entity) {
            if (view) _state = _statesForm.view;else _state = _statesForm.edit;

            vm.entity.set(entity);
        }

        activate();
    };

    // FACTORY ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    entifixEnvironmentModule.factory('EntifixEntityModal', entityModal);
    entityModal.$inject = ['$mdDialog'];

    function entityModal($mdDialog) {
        var entityModal = function entityModal(_componentConstruction, _componentBehavior, _componentBindingOut, _queryDetails) {
            var vm = this;

            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:


            //Properties ===>>>>:


            //==============================================================================================================================================================================


            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================
            vm.openModal = function () {
                if (_componentConstruction && _componentConstruction.event) var event = _componentConstruction.event;

                if (_componentConstruction && _componentConstruction.clickOutsideToClose != null) var clickOutsideToClose = _componentConstruction.clickOutsideToClose;else var clickOutsideToClose = false;

                if (_componentConstruction && _componentConstruction.escapeToClose != null) var escapeToClose = _componentConstruction.escapeToClose;else var escapeToClose = true;

                if (_componentConstruction && _componentConstruction.fullscreen != null) var fullscreen = _componentConstruction.fullscreen;else var fullscreen = true;

                $mdDialog.show({
                    //templateUrl: 'dist/shared/controls/entifixEntityModal/entifixEntityModal.html',
                    template: '<md-dialog aria-label="{{bindCtrl.title.get()}}" ng-class="{\'whirl double-up whirlback\': bindCtrl.onTask.get() }" class="{{bindCtrl.size.get()}}"> \
                                                    <md-toolbar> \
                                                        <div class="md-toolbar-tools" md-colors="{color: \'default-primary-50\'}" layout> \
                                                            <div flex layout layout-align="start center"> \
                                                                <div class="md-icon-button"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon></div> \
                                                                <h2>&nbsp{{bindCtrl.title.get()}}</h2> \
                                                            </div> \
                                                            <div flex layout layout-align="end center" ng-if="bindCtrl.canViewHistory.get()"> \
                                                                <md-button layout layout-align="end end" class="md-primary btn-success md-fab md-mini" ng-click="bindCtrl.history.set()"> \
                                                                    <md-tooltip>{{bindCtrl.historyTooltip.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">history</md-icon> \
                                                                </md-button> \
                                                            </div> \
                                                        </div> \
                                                    </md-toolbar> \
                                                    <form name="bindCtrl.entityForm" novalidate ng-submit="bindCtrl.entityForm.$valid && bindCtrl.submit()"> \
                                                        <md-dialog-content> \
                                                            <md-content layout-padding> \
                                                                <div compile="bindCtrl.stringhtmlcomponent" flex="100"></div> \
                                                            </md-content> \
                                                        </md-dialog-content> \
                                                        <md-dialog-actions layout="row" ng-if="bindCtrl.allowActions.get()"> \
                                                            <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canCancel.get()" ng-click="bindCtrl.cancel()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.cancelHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.cancelIcon.get()}}</md-icon>&nbsp;{{bindCtrl.cancelText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-warn" ng-show="bindCtrl.canRemove.get()" ng-click="bindCtrl.remove()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.removeHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon>&nbsp;{{bindCtrl.removeText.get()}} \
                                                            </md-button> \
                                                            <md-button type="submit" class="md-primary" ng-show="bindCtrl.canSave.get()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                                                <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                                                <md-icon class="material-icons">{{bindCtrl.saveIcon.get()}}</md-icon>&nbsp;{{bindCtrl.saveText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-accent" ng-show="bindCtrl.canEdit.get()" ng-click="bindCtrl.edit()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.editHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon>&nbsp;{{bindCtrl.editText.get()}} \
                                                            </md-button> \
                                                            <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canOk.get()" ng-click="bindCtrl.ok()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.okHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.okIcon.get()}}</md-icon>&nbsp;{{bindCtrl.okText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-primary" ng-show="bindCtrl.canProcess.get()" ng-click="bindCtrl.process()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                                                <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                                                <md-icon class="material-icons">{{bindCtrl.processIcon.get()}}</md-icon>&nbsp;{{bindCtrl.processText.get()}} \
                                                            </md-button> \
                                                        </md-dialog-actions> \
                                                    </form> \
                                                </md-dialog>',
                    controller: 'EntifixEntityModalController',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: clickOutsideToClose,
                    escapeToClose: escapeToClose,
                    fullscreen: fullscreen,
                    controllerAs: 'bindCtrl',
                    multiple: true,
                    locals: {
                        componentConstruction: function componentConstruction() {
                            return _componentConstruction;
                        },
                        componentBehavior: function componentBehavior() {
                            return _componentBehavior;
                        },
                        componentBindingOut: function componentBindingOut() {
                            return _componentBindingOut;
                        },
                        queryDetails: function queryDetails() {
                            return _queryDetails;
                        }
                    }
                }).then(function (results) {}, function () {});
            };

            //==============================================================================================================================================================================
        };

        return entityModal;
    };
})();