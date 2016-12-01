angular.module('Dalet').filter('null', function () {
        return function (value) {
            if (!value) return 'Sin valor';
            else return value;

        };
    });