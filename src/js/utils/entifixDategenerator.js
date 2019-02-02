

(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixDateGenerator', factory);

    factory.$inject = [];

    function factory ()
    {
        return function()
        {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields

            // Properties
            
            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            function activate()
            {

            };

            vm.transformStringToDate = function(value)
            {
                if (isInvalidDate(value))
                {
                    var dayOrYear = value.split("-");
                    if (dayOrYear.length > 0 && dayOrYear[0].length > 2)
                        var isToDisplay = false;
                    else
                        var isToDisplay = true;

                    if (value.length > 10)
                        var isDateTime = true;
                    else
                        var isDateTime = false;

                    if (value && !(value instanceof Date))
                    {
                        if (isDateTime)
                        {
                            if (isToDisplay)
                            {
                                var reggie = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
                                var dateArray = reggie.exec(value); 
                                return new Date((+dateArray[3]),(+dateArray[2])-1,(+dateArray[1]),(+dateArray[4]),(+dateArray[5]),(+dateArray[6]));
                            }
                            else
                            {
                                var reggie  = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                                var dateArray = reggie.exec(value); 
                                return new Date((+dateArray[1]),(+dateArray[2])-1,(+dateArray[3]),(+dateArray[4]),(+dateArray[5]),(+dateArray[6]));
                            }
                        }
                        else
                        {
                            if (isToDisplay)
                            {
                                var reggie = /(\d{2})-(\d{2})-(\d{4})/;
                                var dateArray = reggie.exec(value);
                                return new Date((+dateArray[3]),(+dateArray[2])-1,(+dateArray[1]));    
                            }
                            else
                            {
                                var reggie  = /(\d{4})-(\d{2})-(\d{2})/;
                                var dateArray = reggie.exec(value);
                                return new Date((+dateArray[3]),(+dateArray[2])-1,(+dateArray[1]));    
                            }
                        }
                    }
                    else if (value)
                    {
                        return value;
                    }
                    else
                        return null;
                }
                else 
                    return new Date(value);
            }

            vm.transformDateToString = function(value, type, isToDisplay)
            {
                var valueToReturn;
                var type = type.toUpperCase();
                if (value instanceof Date)
                {
                    if (type == 'DATE' || type == 'DATETIME')
                    {
                        var year = value.getFullYear();
                        var month = (value.getMonth() + 1).toString();
                        var day = value.getDate().toString();
        
                        if (month.length < 2)
                            month = '0' + month;
                        if (day.length < 2)
                            day = '0' + day;

                        if (isToDisplay)
                            valueToReturn = day + '-' + month + '-' + year;
                        else
                            valueToReturn = year + '-' + month + '-' + day;
                    }
    
                    if (type == 'DATETIME' || type == 'TIME')
                    {
                        var hours = value.getHours().toString();
                        var minutes = value.getMinutes().toString();
                        var seconds = value.getSeconds().toString();

                        if (hours.length < 2)
                            hours = '0' + hours;
                        if (minutes.length < 2)
                            minutes = '0' + minutes;
                        if (seconds.length < 2)
                            seconds = '0' + seconds;

                        if (type == 'DATETIME')
                            valueToReturn += ' ';
                        
                        valueToReturn += hours + ':' + minutes + ':' + seconds;
                    }
                    return valueToReturn;
                }
                return value;
            }

            function isInvalidDate(value) 
            {
                let valueDate = new Date(value);
                if (valueDate === 'Invalid Date' || isNaN(valueDate))
                    return true;
                return false;
            }

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };

})();