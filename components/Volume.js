(function($angular) {

    "use strict";

    /**
     * @directive viVolume
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viVolume', ['ngVideoOptions',

    function ngVolumeDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                return $scope;

            }]

        }

    }]);

})(window.angular);