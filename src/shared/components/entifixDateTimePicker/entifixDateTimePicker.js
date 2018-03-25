(function () {
    'use strict';
   
    function componentcontroller(mdcDateTimeDialog, $scope)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        vm.canShowEditableFields =
        {
            get: () =>
            {
                if (vm.showEditableFields)
                    return vm.showEditableFields();

                return false;
            }
        };

        vm.canEvaluateErrors =
        {
            get: () =>
            {
                if (vm.evaluateErrors)
                    return vm.evaluateErrors( { name: vm.name.get() } );

                return false;
            }
        };
        
        vm.isRequired =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isRequired)
                    return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };
        
        vm.requiredMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage)
                {
                    if (vm.componentConstruction.requiredMessage.getter)
                        return vm.componentConstruction.requiredMessage.getter();
                    
                    if (vm.componentConstruction.requiredMessage.text)
                        return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };
        
        vm.parseMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.parseMessage)
                {
                    if (vm.componentConstruction.parseMessage.getter)
                        return vm.componentConstruction.parseMessage.getter();
                    
                    if (vm.componentConstruction.parseMessage.text)
                        return vm.componentConstruction.parseMessage.text;
                }

                //Default value
                if (vm.hasDate.get() && vm.hasTime.get())
                    return 'Este campo debe ser una fecha y hora válidas';
                else if (vm.hasDate.get() && !vm.hasTime.get())
                    return 'Este campo debe ser una fecha válida';
                    else if (vm.hasTime.get() && !vm.hasDate.get())
                        return 'Este campo debe ser una hora válida';
            }
        };
        
        vm.isDisabled =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isDisabled)
                    return vm.componentConstruction.isDisabled;

                //Default value
                return false;
            }
        };
        
        vm.title = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {
                    if (vm.componentConstruction.title.getter)
                        return vm.componentConstruction.title.getter();
                    
                    if (vm.componentConstruction.title.text)
                        return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };
         
        vm.name = 
        {
            get: () =>
            {
                if (getCleanedString(vm.title.get()) != '')
                    return getCleanedString(vm.title.get())
                return 'entifixdatetimepicker' + randomNumber;
            }
        };
        
        vm.isForm =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null)
                    return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };
        
        vm.disableParentScroll =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.disableParentScroll != null)
                    return vm.componentConstruction.disableParentScroll;

                //Default value
                return true;
            }
        };
        
        vm.autoOk =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.autoOk != null)
                    return vm.componentConstruction.autoOk;

                //Default value
                return true;
            }
        };
        
        vm.editInput =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.editInput)
                    return vm.componentConstruction.editInput;

                //Default value
                return true;
            }
        };
        
        vm.clickOutsideToClose =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.clickOutsideToClose)
                    return vm.componentConstruction.clickOutsideToClose;

                //Default value
                return false;
            }
        };

        vm.tooltip = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.tooltip)
                {
                    if (vm.componentConstruction.tooltip.getter)
                        return vm.componentConstruction.tooltip.getter();
                    
                    if (vm.componentConstruction.tooltip.text)
                        return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };

        vm.nullValueLabel =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel)
                    return vm.componentConstruction.nullValueLabel;
                
                return 'SIN REGISTROS';
            }
        }

        // Date Picker Configuration -------------------------------------------------------------------------------------------------------------------------------------------------
        vm.hasDate =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.hasDate != null)
                    return vm.componentConstruction.hasDate;

                //Default value
                return true;
            }
        };
        
        vm.placeholder =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.placeholder)
                {
                    if (vm.componentConstruction.placeholder.getter)
                        return vm.componentConstruction.placeholder.getter();
                    
                    if (vm.componentConstruction.placeholder.text)
                        return vm.componentConstruction.placeholder.text;
                }

                //Default value
                var ph = '';
                if (vm.hasDate.get()) ph += 'dd/mm/aaaa';
                if (vm.hasTime.get() && vm.hasDate.get()) ph += ' hh:mm'; else if (vm.hasTime.get()) ph += 'hh:mm';
                return ph;
            }
        };
        
        vm.minDate = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.minDate)
                {
                    if (vm.componentConstruction.minDate.getter)
                        return vm.componentConstruction.minDate.getter();
                    
                    if (vm.componentConstruction.minDate.text)
                        return vm.componentConstruction.minDate.text;
                }

                //Default value
                return '01/01/1900';
            }
        };
        
        vm.maxDate = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxDate)
                {
                    if (vm.componentConstruction.maxDate.getter)
                        return vm.componentConstruction.maxDate.getter();
                    
                    if (vm.componentConstruction.maxDate.text)
                        return vm.componentConstruction.maxDate.text;
                }

                //Default value
                return '01/01/2100';
            }
        };
        
        vm.format =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.format)
                {
                    if (vm.componentConstruction.format.getter)
                        return vm.componentConstruction.format.getter();
                    
                    if (vm.componentConstruction.format.text)
                        return vm.componentConstruction.format.text;
                }

                //Default value
                var format = '';
                if (vm.hasDate.get()) format += 'DD/MM/YYYY';
                if (vm.hasTime.get() && vm.hasDate.get()) format += ' HH'; else if (vm.hasTime.get()) format += 'HH';
                if (vm.hasTime.get() && vm.shortTime.get()) format += ':mm a'; else if (vm.hasTime.get()) format += ':mm';
                return format;
            }
        };
        
        vm.okText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.okText)
                {
                    if (vm.componentConstruction.okText.getter)
                        return vm.componentConstruction.okText.getter();
                    
                    if (vm.componentConstruction.okText.text)
                        return vm.componentConstruction.okText.text;
                }

                //Default value
                return 'Aceptar';
            }
        };
        
        vm.todayText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.todayText)
                {
                    if (vm.componentConstruction.todayText.getter)
                        return vm.componentConstruction.todayText.getter();
                    
                    if (vm.componentConstruction.todayText.text)
                        return vm.componentConstruction.todayText.text;
                }

                //Default value
                return 'Hoy';
            }
        };
        
        vm.cancelText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.cancelText)
                {
                    if (vm.componentConstruction.cancelText.getter)
                        return vm.componentConstruction.cancelText.getter();
                    
                    if (vm.componentConstruction.cancelText.text)
                        return vm.componentConstruction.cancelText.text;
                }

                //Default value
                return 'Cancelar';
            }
        };
        
        vm.weekStart =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.weekStart)
                {
                    if (vm.componentConstruction.weekStart.getter)
                        return vm.componentConstruction.weekStart.getter();
                    
                    if (vm.componentConstruction.weekStart.text)
                        return vm.componentConstruction.weekStart.text;
                }

                //Default value
                return "0";
            }
        };
        
        vm.weekDays =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.weekDays)
                    return vm.componentConstruction.weekDays;

                //Default value
                return false;
            }
        };
        
        // Time Picker Configuration -------------------------------------------------------------------------------------------------------------------------------------------------
        vm.hasTime =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.hasTime != null)
                    return vm.componentConstruction.hasTime;

                //Default value
                return true;
            }
        };

        vm.hasMinutes =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.hasMinutes != null)
                    return vm.componentConstruction.hasMinutes;

                //Default value
                return true;
            }
        };
        
        vm.shortTime =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.shortTime != null)
                    return vm.componentConstruction.shortTime;

                //Default value
                return true;
            }
        };
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function()
        {
            SetDefaultsValues();
            init();
        };

        //Default values
        function SetDefaultsValues() 
        {
            
        };
        
        //Constructor
        function init() 
        {
            
        };

        function getCleanedString(stringToClean){
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) 
                stringToClean= stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');

            stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g,"");
            stringToClean = stringToClean.replace(/á/gi,"a");
            stringToClean = stringToClean.replace(/é/gi,"e");
            stringToClean = stringToClean.replace(/í/gi,"i");
            stringToClean = stringToClean.replace(/ó/gi,"o");
            stringToClean = stringToClean.replace(/ú/gi,"u");
            stringToClean = stringToClean.replace(/ñ/gi,"n");
            return stringToClean;
        }

        vm.getDateString = function(skip)
        {
            if (vm.valueModel)
            {
                var dateValueModel = new Date(vm.valueModel);
                if (dateValueModel instanceof Date)
                {
                    var date = dateValueModel;
                    var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                    var diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
                    var hours = "";
                    var minutes = "";

                    if (vm.hasTime.get())
                    {
                        hours = date.getHours().toString();
                        minutes = date.getMinutes().toString();
                        if (hours.length < 2)
                            hours = '0' + hours;
                        if (minutes.length < 2)
                            minutes = '0' + minutes;

                        hours = parseInt(hours);
                        
                        if (hours > 12)
                            hours = (hours - 12).toString() + ':' + minutes + ' ' + 'pm';
                        else if (hours == 12)
                            hours = hours.toString() + ':' + minutes + ' ' + 'pm';
                            else
                                hours = hours.toString() + ':' + minutes + ' ' + 'am';
                    }

                    return date.getDate() + " de " + meses[date.getMonth()] + " de " + date.getFullYear() + " " + hours;
                }
                else
                    return vm.valueModel;            
            }
            else if (!skip) return vm.nullValueLabel.get();
        }

        vm.displayDialogEdit = function () {

            if (vm.hasDate.get())
            {
                mdcDateTimeDialog.show({
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
                    weekDays: vm.weekDays.get(),
                    weekStart: vm.weekStart.get(),
                    disableParentScroll: vm.disableParentScroll.get(),
                    autoOk: vm.autoOk.get(),
                    editInput: vm.editInput.get(),
                    clickOutsideToClose: vm.clickOutsideToClose.get()
                })
                .then(function (date) {
                    vm.valueModel = new Date(date.toString());
                }, function(){ console.log('Selección cancelada'); });
            }
            else
            {
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
                })
                .then(function (date) {
                    vm.valueModel = new Date(date.toString());
                }, function(){ console.log('Selección cancelada'); });
            }

        };

        vm.runOnChangeTrigger = function()
        {
            if (vm.onChange)
                vm.onChange( { value: vm.valueModel } );
        }

        $scope.$watch(function() { return vm.valueModel; }, function(newValue, oldValue) { if (vm.onChange) vm.onChange({ value: newValue }); } )
        //=======================================================================================================================================================================        
    };

    componentcontroller.$inject = ['mdcDateTimeDialog', '$scope'];

    var component = 
    {
        bindings: 
        {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        templateUrl: 'src/shared/components/entifixDateTimePicker/entifixDateTimePicker.html',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixDateTimePicker', component);

})();