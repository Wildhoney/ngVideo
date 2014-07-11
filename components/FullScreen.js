(function($angular) {

    "use strict";

    /**
     * @directive viFullScreen
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viFullScreen', ['ngVideoOptions',

    function ngFullScreenDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property scope
             * @type {Boolean}
             */
            scope: true,

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                element.bind('click', function onClick() {
                    scope.fullScreen();
                });

            }

        }

    }]);

})(window.angular);