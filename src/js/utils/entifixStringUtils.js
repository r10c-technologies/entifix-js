

(function(){
    'use strict';

    angular.module('entifix-js').service('EntifixStringUtils', service);

    service.$inject = [];

    function service ()
    {
        var vm = this;

        // Properties and fields
        // =========================================================================================================================

        // Fields
        let specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

        // Properties
        
        // =========================================================================================================================


        // Methods
        // =========================================================================================================================

        function activate()
        {

        };

        vm.getCleanedString = function(stringToClean)
        {
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

        // =========================================================================================================================

        // Constructor call
        activate();
    };

})();