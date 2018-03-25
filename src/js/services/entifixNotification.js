(function(){
    'use strict';

    angular.module('entifix-js')
            .service('EntifixNotification', service);

    service.$inject = [];

    function service()
    {
        var vm = this;

        vm.success = function(detalle, encabezado)
        {
            detalle = detalle || 'Acción realizada correctamente';
            encabezado = encabezado || '¡Hecho!';

            swal(encabezado, detalle, 'success');
        };

        vm.error = function(detalle, encabezado)
        {
            detalle = detalle || 'Error al realizar la acción solicitada';
            encabezado = encabezado || '¡Error!';

            swal(encabezado, detalle, 'error');
        };

        vm.info = function(detalle, encabezado)
        {
            detalle = detalle || 'Error al realizar la acción solicitada';
            encabezado = encabezado || 'Información';

            swal(encabezado, detalle, 'info');
        };

        vm.confirm = function(detalle, encabezado, actionConfirm, actionCancel)
        {
            encabezado = encabezado || '¿Está seguro de proceder?';
          
        swal({ title: encabezado, 
                text: detalle, 
                type: 'warning', 
                showCancelButton: true, 
                confirmButtonColor: '#DD6B55', 
                confirmButtonText: 'Sí',   
                cancelButtonText: 'No'}).then(actionConfirm,actionCancel);

        };

        return vm;
    };

})();



(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixNotifier', factory);

    factory.$inject = ['EntifixNotification'];

    function factory (EntifixNotification)
    {
        return function(resource)
        {
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

            function activate()
            {
                resource.listenSaved(saved);
                resource.listenDeleted(deleted);
                resource.listenErrorSave(errorSave);
                resource.listenErrorDelete(errorDelete);
                resource.listenNonValidSave(nonValidSave);
            };

            function saved(args)
            {
                var message = _savedMessage;
                if (args.friendlyMessage)
                    message = args.friendlyMessage;

                EntifixNotification.success(message);
            };

            function deleted(args)
            {
                var message = _deletedMessage;
                if (args.friendlyMessage)
                    message = args.friendlyMessage;

                EntifixNotification.success(message);
            };

            function errorSave(args)
            {
                var message = _errorSaveMessage;
                if (args.friendlyMessage)
                    message = args.friendlyMessage;

                EntifixNotification.error(message);
            };

            function errorDelete(args)
            {
                var message = _errorDeleteMessage;
                if (args.friendlyMessage)
                    message = args.friendlyMessage;

                EntifixNotification.error(message);
            };

            function nonValidSave(args)
            {
                var message = _errorValidationMessage;
                if (args.friendlyMessage)
                    message = args.friendlyMessage;

                EntifixNotification.error(message);
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };
})();