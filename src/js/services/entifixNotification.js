(function () {
    'use strict';

    angular.module('entifix-js')
        .service('EntifixNotification', service);

    service.$inject = [];

    function service() {
        var vm = this;

        vm.success = (options) => {
            let body = options.body || 'Acción realizada correctamente';
            let header = options.header || '¡Hecho!';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: options.position || 'bottom-end', timer: options.timer || 3000 });
                toast({ type: 'success', title: header + " " + body });
            }
            else {
                swal(header, body, 'success');
            }
        };

        vm.error = (options) => {
            let body = options.body || 'Error al realizar la acción solicitada';
            let header = options.header || '¡Error!';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: options.position || 'bottom-end', timer: options.timer || 3000 });
                toast({ type: 'error', title: header + " " + body });
            }
            else {
                swal(header, body, 'error');
            }
        };

        vm.info = (options) => {
            let body = options.body || '';
            let header = options.header || 'Información';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: options.position || 'bottom-end', timer: options.timer || 3000 });
                toast({ type: 'info', title: header + " " + body });
            }
            else {
                swal(header, body, 'info');
            }
        };

        vm.warning = (options) => {
            let body = options.body || '';
            let header = options.header || 'Precaución';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: options.position || 'bottom-end', timer: 3000 });
                toast({ type: 'warning', title: header + " " + body });
            }
            else {
                swal(header, body, 'warning');
            }
        };

        vm.confirm = (options) => {
            let header = options.header || '¿Está seguro de proceder?';

            swal({
                title: header,
                text: options.body,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((response) => {
                if (response.value && options.actionConfirm) {
                    options.actionConfirm(response);
                } else if (options.actionCancel) {
                    options.actionCancel(response);
                }
            }).catch(error => {
                if (options.actionCancel) {
                    options.actionCancel(error);
                }
            });

        };

        return vm;
    };

})();



(function () {
    'use strict';

    angular.module('entifix-js').factory('EntifixNotifier', factory);

    factory.$inject = ['EntifixNotification'];

    function factory(EntifixNotification) {
        return function (resource, isToast) {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields
            let _savedMessage = 'Registro guardado correctamente';
            let _deletedMessage = 'Registro eliminado correctamente';
            let _errorSaveMessage = 'No se pudo guardar el registro correctamente. Por favor inténtelo de nuevo';
            let _errorDeleteMessage = 'No se pudo eliminar el registro correctamente. Por favor inténtelo de nuevo';
            let _errorValidationMessage = 'No se pudo guardar el registro porque no todos los datos están correctos';


            // Properties
            vm.savedMessage = {
                get: () => { return _savedMessage; },
                set: (value) => { _savedMessage = value; }
            };

            vm.deletedMessage = {
                get: () => { return _deletedMessage; },
                set: (value) => { _deletedMessage = value; }
            };

            vm.errorSaveMessage = {
                get: () => { return _errorSaveMessage; },
                set: (value) => { _savedMessage = value; }
            };

            vm.errorDeleteMessage = {
                get: () => { return errorDeleteMessage; },
                set: (value) => { errorDeleteMessage = value; }
            };

            vm.errorValidationMessage = {
                get: () => { return _errorValidationMessage; },
                set: (value) => { errorValidationMessage = value; }
            };


            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            const activate = () => {
                resource.listenSaved(saved);
                resource.listenDeleted(deleted);
                resource.listenErrorSave(errorSave);
                resource.listenErrorDelete(errorDelete);
                resource.listenNonValidSave(nonValidSave);
            };

            const saved = args => {
                let message = _savedMessage;
                if (args.message) {
                    message = args.message;
                }

                EntifixNotification.success({ "body": message, "header": undefined, "isToast": isToast });
            };

            const deleted = args => {
                let message = _deletedMessage;
                if (args.message) {
                    message = args.message;
                }

                EntifixNotification.success({ "body": message, "header": undefined, "isToast": isToast });
            };

            const errorSave = args =>  {
                let message = _errorSaveMessage;
                if (args.message) {
                    message = args.message;
                }

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast });
            };

            const errorDelete = args =>  {
                let message = _errorDeleteMessage;
                if (args.message) {
                    message = args.message;
                }

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast });
            };

            const nonValidSave = args => {
                let message = _errorValidationMessage;
                if (args.message) {
                    message = args.message;
                }

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast });
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };
})();