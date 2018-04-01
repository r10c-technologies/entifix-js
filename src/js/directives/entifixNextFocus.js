(function(){
    'use strict';
 
    angular.module('entifix-js').directive('entifixNextFocus', function () {
        return {
            restrict: 'A',
            link: function($scope,elem,attrs) {

                elem.bind('keydown', function(e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 39 || code === 9) {
                        var focusNext;
                        var len;
                        e.preventDefault();
                        var pageElems = document.querySelectorAll(attrs.nextFocus),
                            elem = e.target
                            focusNext = false,
                            len = pageElems.length;
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
                            elem = e.target
                            focusPrevious = false,
                            len = pageElems.length;
                        for (var i = len-1; i >= 0; i--) {
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
        }
    });
})();