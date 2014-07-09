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
             * @property link
             * @return {void}
             */
            link: function() {

            }

        }

    }]);

})(window.angular);