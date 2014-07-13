(function PlaybackRate($angular) {

    "use strict";

    /**
     * @method createPlaybackRateDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createPlaybackRateDirective = function createPlaybackRateDirective(name, clickFn) {

        /**
         * @property directiveName
         * @type {String}
         */
        var directiveName = 'viPlaybackRate' + name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viPlaybackRateItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive(directiveName, ['$rootScope', 'ngVideoOptions',

        function viPlaybackRateItem($rootScope, ngVideoOptions) {

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

                    /**
                     * @method setPlaybackRate
                     * @param rate {Number}
                     * @return {void}
                     */
                    scope.setPlaybackRate = function setPlaybackRate(rate) {

                        // Update the current play rate and the default play rate for when another
                        // video is played.
                        scope.player.playbackRate        = rate;
                        scope.player.defaultPlaybackRate = rate;

                        // Force the refreshing of the statistics.
                        $rootScope.$broadcast('ng-video/feedback/refresh');

                    };

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, +attributes[directiveName], +scope.player.playbackRate);

                        // Force the timeline directive to update.
                        $rootScope.$broadcast('ng-video/feedback/refresh');
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viPlaybackRate
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     */
    createPlaybackRateDirective('', function onPlaybackRateClick(scope, directiveValue) {
        scope.setPlaybackRate(directiveValue);
    });

    /**
     * @directive viPlaybackRateNormalise
     * @type {Function}
     * @param scope {Object}
     */
    createPlaybackRateDirective('normalise', function onPlaybackRateNormaliseClick(scope) {
        scope.setPlaybackRate(1);
    });

    /**
     * @directive viPlaybackRateIncrement
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     * @param currentRate {Number}
     */
    createPlaybackRateDirective('increment', function onPlaybackRateIncrementClick(scope, directiveValue, currentRate) {
        scope.setPlaybackRate(currentRate + directiveValue);
    });

    /**
     * @directive viPlaybackRateDecrement
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     * @param currentRate {Number}
     */
    createPlaybackRateDirective('decrement', function onPlaybackRateDecrementClick(scope, directiveValue, currentRate) {
        scope.setPlaybackRate(currentRate - directiveValue);
    });

})(window.angular);