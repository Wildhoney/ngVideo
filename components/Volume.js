(function Volume($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive viVolume
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    module.directive('viVolume', ['ngVideoOptions', function ngVolumeDirective(ngVideoOptions) {

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
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$rootScope', '$scope', function controller($rootScope, $scope) {

                /**
                 * @method setVolume
                 * @param volume {Number}
                 * @return {void}
                 */
                $scope.setVolume = function setVolume(volume) {

                    if ($scope.player.muted && volume > 0) {

                        // Determine if the user is un-muting the player, which can be set
                        // as the `muted` attribute on the player itself.
                        $scope.player.muted = false;

                    }

                    if (volume < ngVideoOptions.VOLUME_MINIMUM) {
                        volume = ngVideoOptions.VOLUME_MINIMUM;
                    }

                    if (volume > ngVideoOptions.VOLUME_MAXIMUM) {
                        volume = ngVideoOptions.VOLUME_MAXIMUM;
                    }

                    // Set the constrained volume parameter.
                    $scope.player.volume = +(volume).toFixed(2);
                    $rootScope.$broadcast('ng-video/volume', $scope.player.volume);

                };

            }]

        }

    }]);

    /**
     * @method createVolumeDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createVolumeDirective = function createVolumeDirective(name, clickFn) {

        /**
         * @property directiveLabel
         * @type {String}
         */
        var directiveLabel = name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viVolumeItem
         * @type {Function}
         */
        module.directive('viVolume' + directiveLabel, ['ngVideoOptions',

        function viVolumeItem(ngVideoOptions) {

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
                        clickFn.call(this, scope, scope.player.volume, ngVideoOptions.VOLUME_STEPS);
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viVolumeDecrease
     * @type {Function}
     * @param scope {Object}
     * @param currentVolume {Number}
     * @param volumeSteps {Number}
     */
    createVolumeDirective('decrease', function onDecreaseClick(scope, currentVolume, volumeSteps) {
        scope.setVolume(currentVolume - volumeSteps);
    });

    /**
     * @directive viVolumeIncrease
     * @type {Function}
     * @param scope {Object}
     * @param currentVolume {Number}
     * @param volumeSteps {Number}
     */
    createVolumeDirective('increase', function onIncreaseClick(scope, currentVolume, volumeSteps) {
        scope.setVolume(currentVolume + volumeSteps);
    });

    /**
     * @directive viVolumeMute
     * @type {Function}
     * @param scope {Object}
     */
    createVolumeDirective('mute', function onMuteClick(scope) {
        scope.setVolume(0);
    });

    /**
     * @directive viVolumeLoudest
     * @type {Function}
     * @param scope {Object}
     */
    createVolumeDirective('loudest', function onLoudestClick(scope) {
        scope.setVolume(1);
    });

})(window.angular);