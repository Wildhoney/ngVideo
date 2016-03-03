(function Screen($angular) {

    "use strict";

    /**
     * @directive viScreen
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viScreen', ['ngVideoOptions',

    function ngScreenDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                if (ngVideoOptions.SCREEN_CHANGE) {

                    // When the video player screen is clicked, we'll toggle the playing
                    // state of the current video, if there is one.
                    element.bind('click', function() {

                        if (!scope.loading) {
                            scope.toggleState();
                        }

                    });

                }

            }

        }

    }]);

})(window.angular);