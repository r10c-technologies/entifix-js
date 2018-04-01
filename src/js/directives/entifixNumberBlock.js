(function(){
    'use strict';
 
    angular.module('entifix-js').directive('entifixNumberBlock', function () {
        return {
            restrict: 'A',
            link: function($scope,elem,attrs) {
                if (attrs.numberValidation == "true")
                {
                    elem.bind('keydown', function(e) {
                        var code = e.keyCode || e.which;
                        if (!(  code === 8 || // backspace
                                code === 46 || // delete
                                code === 110 || code === 190 || // decimal point
                                code === 9 || // tab
                                code === 37 || // left arrow
                                code === 39 || // right arrow
                                (code >= 48 && code <= 57) || (code >= 96 && code <= 105))) { // numbers
                            e.preventDefault();
                        }
                    });
                }
            }
        }
    });
})();