(function Seekable($angular) {

    "use strict";

    /**
     * @method createSeekableDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createSeekableDirective = function createSeekableDirective(name, clickFn) {

        /**
         * @property directiveName
         * @type {String}
         */
        var directiveName = 'viSeekable' + name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viSeekableItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive(directiveName, ['$rootScope', 'ngVideoOptions',

        function viSeekableItem($rootScope, ngVideoOptions) {

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
                 * @param attributes {Object}
                 * @return {void}
                 */
                link: function link(scope, element, attributes) {

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, +attributes[directiveName], +scope.player.currentTime);

                        // Force the timeline directive to update.
                        $rootScope.$broadcast('ng-video/feedback/refresh');
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viVolumeTime
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('', function onTimeClick(scope, directiveValue) {
        scope.player.currentTime = directiveValue;
    });

    /**
     * @directive viSeekableIncrement
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('increment', function onIncrementClick(scope, directiveValue, currentTime) {
        scope.player.currentTime = currentTime + directiveValue;
    });

    /**
     * @directive viSeekableDecrement
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('decrement', function onIncrementClick(scope, directiveValue, currentTime) {
        scope.player.currentTime = currentTime - directiveValue;
    });

})(window.angular);