(function(){
    'use strict';
 
    angular.module('entifix-js')
            .directive('entifixElasticTextArea', [
                        '$timeout',
                            function($timeout) {
                                return {
                                    restrict: 'A',
                                    link: function($scope, element) {
                                        $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                                        var resize = function() {
                                            if ($scope.initialHeight != '')
                                            {
                                                element[0].style.height = $scope.initialHeight;
                                                $scope.initialHeight = ''
                                            }
                                            else
                                                element[0].style.height = "" + element[0].scrollHeight + "px";
                                        };
                                        element.on("input change", resize);
                                        $timeout(resize, 0);
                                    }
                                };
                            }
                        ]);
 
})();