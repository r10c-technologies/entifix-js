(function () {
    'use strict';

    angular.module('entifix-js')
        .service('EntifixNotification', service);

    service.$inject = [];

    function service() {
        var vm = this;

        vm.success = function (options) {
            let body = options.body || 'Acción realizada correctamente';
            let header = options.header || '¡Hecho!';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: 'bottom-end', timer: 3000 });
                toast({ type: 'success', title: header + " " + body });
            }
            else {
                swal(header, body, 'success');
            }
        };

        vm.error = function (options) {
            let body = options.body || 'Error al realizar la acción solicitada';
            let header = options.header || '¡Error!';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: 'bottom-end', timer: 3000 });
                toast({ type: 'error', title: header + " " + body });
            }
            else {
                swal(header, body, 'error');
            }
        };

        vm.info = function (options) {
            let body = options.body || '';
            let header = options.header || 'Información';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: 'bottom-end', timer: 3000 });
                toast({ type: 'info', title: header + " " + body });
            }
            else {
                swal(header, body, 'info');
            }
        };

        vm.warning = function (options) {
            let body = options.body || '';
            let header = options.header || 'Precaución';

            if (options.isToast) {
                const toast = swal.mixin({ toast: true, position: 'bottom-end', timer: 3000 });
                toast({ type: 'warning', title: header + " " + body });
            }
            else {
                swal(header, body, 'warning');
            }
        };

        vm.confirm = function (options) {
            let header = options.header || '¿Está seguro de proceder?';

            swal({
                title: header,
                text: options.body,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((response) => { if (response.value && options.actionConfirm) options.actionConfirm(); else if (options.actionCancel) options.actionCancel(); });

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
            var _savedMessage = 'Registro guardado correctamente';
            var _deletedMessage = 'Registro eliminado correctamente';
            var _errorSaveMessage = 'No se pudo guardar el registro correctamente. Por favor inténtelo de nuevo';
            var _errorDeleteMessage = 'No se pudo eliminar el registro correctamente. Por favor inténtelo de nuevo';
            var _errorValidationMessage = 'No se pudo guardar el registro porque no todos los datos están correctos';


            // Properties
            vm.savedMessage =
                {
                    get: () => { return _savedMessage; },
                    set: (value) => { _savedMessage = value; }
                };

            vm.deletedMessage =
                {
                    get: () => { return _deletedMessage; },
                    set: (value) => { _deletedMessage = value; }
                };

            vm.errorSaveMessage =
                {
                    get: () => { return _errorSaveMessage; },
                    set: (value) => { _savedMessage = value; }
                };

            vm.errorDeleteMessage =
                {
                    get: () => { return errorDeleteMessage; },
                    set: (value) => { errorDeleteMessage = value; }
                };

            vm.errorValidationMessage =
                {
                    get: () => { return _errorValidationMessage; },
                    set: (value) => { errorValidationMessage = value; }
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
                if (args.message)
                    message = args.message;

                EntifixNotification.success({ "body": message, "header": undefined, "isToast": isToast});
            };

            function deleted(args) {
                var message = _deletedMessage;
                if (args.message)
                    message = args.message;

                EntifixNotification.success({ "body": message, "header": undefined, "isToast": isToast});
            };

            function errorSave(args) {
                var message = _errorSaveMessage;
                if (args.message)
                    message = args.message;

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast});
            };

            function errorDelete(args) {
                var message = _errorDeleteMessage;
                if (args.message)
                    message = args.message;

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast});
            };

            function nonValidSave(args) {
                var message = _errorValidationMessage;
                if (args.message)
                    message = args.message;

                EntifixNotification.error({ "body": message, "header": undefined, "isToast": isToast});
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };
})();