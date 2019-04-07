(function () {
    'use strict';
   
    function componentcontroller(mdcDateTimeDialog, $scope, EntifixDateGenerator, EntifixStringUtils, $timeout)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);
        var plannedRecharge;

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        vm.canShowEditableFields =
        {
            get: () =>
            {
                if (vm.showEditableFields)
                    return vm.showEditableFields;

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
                if (vm.title.get() != '')
                    return EntifixStringUtils.getCleanedString(vm.title.get())
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
        
        vm.defaultValue =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.defaultValue != null)
                    return vm.componentConstruction.defaultValue;

                //Default value
                return false;
            }
        };

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
                var placeholder = '';
                if (vm.hasDate.get()) placeholder += 'dd/mm/aaaa';
                if (vm.hasTime.get() && vm.hasDate.get()) placeholder += ' hh:mm'; else if (vm.hasTime.get()) placeholder += 'hh:mm';
                return placeholder;
            }
        };
        
        vm.minDate = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.minDate)
                {
                    if (vm.componentConstruction.minDate.getter)
                        return moment(vm.componentConstruction.minDate.getter(), vm.format.value);
                    
                    if (vm.componentConstruction.minDate.text)
                        return moment(vm.componentConstruction.minDate.text, vm.format.value);
                }

                //Default value
                return undefined;
            }
        };
        
        vm.maxDate = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxDate)
                {
                    if (vm.componentConstruction.maxDate.getter)
                        return moment(vm.componentConstruction.maxDate.getter(), vm.format.value);
                    
                    if (vm.componentConstruction.maxDate.text)
                        return moment(vm.componentConstruction.maxDate.text, vm.format.value);
                }

                //Default value
                return undefined;
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
                if (vm.hasDate.get()) format += 'DD-MM-YYYY';
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

        vm.$onInit = () =>
        {
            setValues();
            if (!vm.valueModel && vm.defaultValue.get()) vm.valueModel = new Date();
        };

        function updateDateString() 
        {            
            if (!(vm.valueModel instanceof Date)) {
                var dateValueModel = transformStringToDate(vm.valueModel);
                vm.valueModel = dateValueModel;
            }
            else
                var dateValueModel = vm.valueModel;

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
            vm.dateString = date.getDate() + " de " + meses[date.getMonth()] + " de " + date.getFullYear() + " " + hours;
        }

        vm.getDateString = () =>
        {
            if (vm.valueModel)
            {
                updateDateString();
                return vm.dateString;
            }
            else if (!vm.canShowEditableFields.get()) return vm.nullValueLabel.get();
        }

        vm.displayDialogEdit = () =>
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
                maxDate: vm.maxDate.get(),
                minDate: vm.minDate.get(),
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
            .then((date) => {
                if (!(date instanceof Date))
                    vm.valueModel = transformStringToDate(value);
                else
                    vm.valueModel = date;
            }, 
            () => { });

        };

        vm.runOnChangeTrigger = () =>
        {
            updateDateString();
            if (vm.onChange)
                vm.onChange( { value: vm.valueModel } );

            cleanPlannedRecharge();
            plannedRecharge = $timeout(setValues, 1500);
        }

        function transformStringToDate(value)
        {
            return EntifixDateGenerator.transformStringToDate(value);
        }

        $scope.$watch(() => { return vm.valueModel; }, (newValue, oldValue) => { if (vm.onChange) vm.onChange({ value: newValue }); cleanPlannedRecharge(); plannedRecharge = $timeout(setValues, 1500); vm.dateString = vm.getDateString(); } );

        function cleanPlannedRecharge()
        {
            if (plannedRecharge)
            {
                $timeout.cancel(plannedRecharge);
                plannedRecharge = null;
            }
        };

        function setValues()
        {
            vm.isForm.value = vm.isForm.get();
            vm.tooltip.value = vm.tooltip.get();
            vm.title.value = vm.title.get();
            vm.format.value = vm.format.get();
            vm.name.value = vm.name.get();
            vm.isRequired.value = vm.isRequired.get();
            vm.isDisabled.value = vm.isDisabled.get();
            vm.disableParentScroll.value = vm.disableParentScroll.get();
            vm.autoOk.value = vm.autoOk.get();
            vm.requiredMessage.value = vm.requiredMessage.get();
            vm.editInput.value = vm.editInput.get();
            vm.parseMessage.value = vm.parseMessage.get();
            vm.clickOutsideToClose.value = vm.clickOutsideToClose.get();
            vm.hasDate.value = vm.hasDate.get();
            vm.placeholder.value = vm.placeholder.get();
            vm.minDate.value = vm.minDate.get();
            vm.maxDate.value = vm.maxDate.get();
            vm.okText.value = vm.okText.get();
            vm.todayText.value = vm.todayText.get();
            vm.cancelText.value = vm.cancelText.get();
            vm.weekStart.vale = vm.weekStart.get();
            vm.weekDays.value = vm.weekDays.get();
            vm.weekDays.value = vm.weekDays.get();
            vm.nullValueLabel.value = vm.nullValueLabel.get();
            vm.hasTime.value = vm.hasTime.get();
            vm.hasMinutes.vale = vm.hasMinutes.get();
            vm.shortTime.value = vm.shortTime.get();
            vm.dateString = vm.getDateString();
        }
        //=======================================================================================================================================================================        
    };

    componentcontroller.$inject = ['mdcDateTimeDialog', '$scope', 'EntifixDateGenerator', 'EntifixStringUtils', '$timeout'];

    var component = 
    {
        bindings: 
        {
            valueModel: '=',
            showEditableFields: '=',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'src/shared/components/entifixDateTimePicker/entifixDateTimePicker.html',
        template: '<div ng-if="vm.isForm.value"> \
                    <md-tooltip ng-if="vm.tooltip.value" md-direction="left">{{vm.tooltip.value}}</md-tooltip> \
                    <div ng-if="vm.canShowEditableFields.get()" layout layout-align="center center" class="datetimepicker"> \
                        <md-input-container flex> \
                            <label>{{vm.title.value + ": " + vm.dateString}}</label> \
                            <input mdc-datetime-picker \
                                type="text" \
                                ng-model="vm.valueModel" \
                                id="{{vm.name.value}}" \
                                name="{{vm.name.value}}" \
                                format="{{vm.format.value}}" \
                                short-time="vm.shortTime.value" \
                                min-date="vm.minDate.value" \
                                max-date="vm.maxDate.value" \
                                date="vm.hasDate.value" \
                                time="vm.hasTime.value" \
                                minutes="vm.hasMinutes.value" \
                                cancel-text="{{vm.cancelText.value}}" \
                                today-text="{{vm.todayText.value}}" \
                                ok-text="{{vm.okText.value}}" \
                                week-start="vm.weekStart.value" \
                                weeks-days="vm.weeksDays.value" \
                                show-todays-date \
                                disable-parent-scroll="vm.disableParentScroll.value" \
                                auto-ok="vm.autoOk.value" \
                                edit-input="vm.editInput.value" \
                                click-outside-to-close="vm.clickOutsideToClose.value" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-disabled="vm.isDisabled.value" \
                                ng-required="vm.isRequired.value"/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.value}}</div> \
                                    <div ng-message="parse">{{vm.parseMessage.value}}</div> \
                                </div> \
                        </md-input-container> \
                        <div flex="5"> \
                        <md-button class="md-primary md-icon-button" style="top:-12px;left:-12px;" ng-click="vm.displayDialogEdit()"> \
                            <md-icon class="material-icons">today</md-icon> \
                        </md-button> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.canShowEditableFields.get()"> \
                        <label>{{vm.title.value}}</label><br/> \
                        <strong>{{vm.dateString}}</strong> \
                    </div> \
                </div> \
                <div ng-if="!vm.isForm.value"> \
                    <md-tooltip ng-if="vm.tooltip.value" md-direction="left">{{vm.tooltip.value}}</md-tooltip> \
                    <div layout layout-align="center center" layout- class="datetimepicker"> \
                        <md-input-container flex> \
                            <label>{{vm.title.value + ": " + vm.dateString}}</label> \
                            <input mdc-datetime-picker \
                                type="text" \
                                ng-model="vm.valueModel" \
                                id="{{vm.name.value}}" \
                                name="{{vm.name.value}}" \
                                format="{{vm.format.value}}" \
                                short-time="vm.shortTime.value" \
                                min-date="vm.minDate.value" \
                                max-date="vm.maxDate.value" \
                                date="vm.hasDate.value" \
                                time="vm.hasTime.value" \
                                minutes="vm.hasMinutes.value" \
                                cancel-text="{{vm.cancelText.value}}" \
                                today-text="{{vm.todayText.value}}" \
                                ok-text="{{vm.okText.value}}" \
                                week-start="vm.weekStart.value" \
                                weeks-days="vm.weeksDays.value" \
                                show-todays-date \
                                disable-parent-scroll="vm.disableParentScroll.value" \
                                auto-ok="vm.autoOk.value" \
                                edit-input="vm.editInput.value" \
                                click-outside-to-close="vm.clickOutsideToClose.value" \
                                ng-change="vm.runOnChangeTrigger()" \
                                ng-disabled="vm.isDisabled.value" \
                                ng-required="vm.isRequired.value"/> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.value}}</div> \
                                    <div ng-message="parse">{{vm.parseMessage.value}}</div> \
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