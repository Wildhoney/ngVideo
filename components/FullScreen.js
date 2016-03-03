(function FullScreen($angular) {

    "use strict";
    /**
     * @method createFullScreenDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createFullScreenDirective = function createFullScreenDirective(name, clickFn) {

        /**
         * @property directiveLabel
         * @type {String}
         */
        var directiveLabel = name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viVolumeItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive('viFullScreen' + directiveLabel, ['$window', 'ngVideoOptions',

        function viVolumeItem($window, ngVideoOptions) {

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

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, $window.document);
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viFullScreenOpen
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('open', function onFullScreenOpenClick(scope) {
        scope.openFullScreen();
    });

    /**
     * @directive viFullScreenClose
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('close', function onFullScreenCloseClick(scope) {
        scope.closeFullScreen();
    });

    /**
     * @directive viFullScreenToggle
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('toggle', function onFullScreenToggleClick(scope, document) {

        /**
         * @method inFullScreen
         * @return {Boolean}
         */
        var inFullScreen = function inFullScreen() {

            if (document.fullscreenElement) {

                // W3C.
                return !!document.fullscreenElement;

            } else if (document.mozFullscreenElement) {

                // Mozilla.
                return !!document.mozFullscreenElement;

            } else if (document.webkitFullscreenElement) {

                // Webkit.
                return !!document.webkitFullscreenElement;

            }

        };

        if (!inFullScreen()) {

            // Determine if we're currently in full-screen mode, and then deduce which method
            // to call based on the result.
            scope.openFullScreen();
            return;

        }

        // Close the full screen mode if we're still full screen.
        scope.closeFullScreen();

    });

})(window.angular);