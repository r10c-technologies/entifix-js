(function(){
    'use strict';

    angular.module('entifix-js').filter('percentage', ['$filter', function ($filter) {
        return (input, decimals=2) => $filter('number')(input * 100, decimals) + '%';
      }]);
}());