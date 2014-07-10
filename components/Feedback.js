(function($angular, $math) {

    "use strict";

    /**
     * @property requiredProperties
     * @type {String[]}
     */
    var requiredProperties = ['duration', 'currentTime', 'volume', 'playbackRate'];

    /**
     * @directive viFeedback
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viFeedback', ['ngVideoOptions',

    function ngFeedbackDirective(ngVideoOptions) {

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
             * @param $interval {Function|Object}
             * @param $window {Object}
             * @param ngVideoOptions {Object}
             */
            controller: ['$scope', '$interval', '$window', 'ngVideoOptions',

            function controller($scope, $interval, $window, ngVideoOptions) {

                /**
                 * @property duration
                 * @type {Number}
                 */
                $scope.duration = 0;

                /**
                 * @property volume
                 * @type {Number}
                 */
                $scope.volume = 1;

                /**
                 * @property playbackRate
                 * @type {Number}
                 */
                $scope.playbackRate = 1;

                /**
                 * @property lastUpdate
                 * @type {Number}
                 */
                $scope.lastUpdate = 0;

                /**
                 * @property currentTime
                 * @type {Number}
                 */
                $scope.currentTime = 0;

                /**
                 * @property percentagePlayed
                 * @type {Number}
                 */
                $scope.percentagePlayed = 0;

                /**
                 * @property buffered
                 * @type {Number}
                 */
                $scope.buffered = 0;

                /**
                 * @property interval
                 * @type {Object}
                 */
                $scope.interval = {};

                /**
                 * @method grabStatistics
                 * @return {void}
                 */
                $scope.grabStatistics = function grabStatistics() {

                    var player = $scope.player;

                    // Iterate over each property we wish to listen to.
                    $angular.forEach(requiredProperties, function forEach(property) {

                        $scope[property] = !isNaN($scope.player[property]) ? $scope.player[property]
                                                                           : $scope[property];

                    });

                    if ($scope.player.buffered.length !== 0) {

                        // Update the buffered amount.
                        $scope.buffered = $math.round(player.buffered.end(0) / player.duration) * 100;

                    }

                    // Calculate other miscellaneous properties.
                    $scope.percentagePlayed = ($scope.currentTime / $scope.duration) * 100;

                    // Notify everybody that the statistics have been updated!
                    $scope.lastUpdate = new $window.Date().getTime();

                };

                /**
                 * @method beginPolling
                 * @return {void}
                 */
                $scope.beginPolling = function beginPolling() {

                    // Update the statistics every so often.
                    $scope.interval = $interval($scope.grabStatistics, ngVideoOptions.REFRESH);

                };

                /**
                 * @method endPolling
                 * @return {void}
                 */
                $scope.endPolling = function endPolling() {
                    $interval.cancel($scope.interval);
                };

                // When we need to force the refreshing of the statistics.
                $scope.$on('ng-video/reset', function forceReset() {

                    $scope.player.currentTime = 0;
                    $scope.grabStatistics();

                });

                // When we need to force the refreshing of the volume.
                $scope.$on('ng-video/volume', function forceVolume(event, volume) {
                    $scope.volume = volume;
                });

                // Monitor the status of the video player.
                $scope.$watch('playing', function isPlaying(playing) {

                    // Update the statistics once.
                    $scope.grabStatistics();

                    if (playing) {

                        // Update the statistics periodically.
                        $scope.beginPolling();
                        return;

                    }

                    $scope.endPolling();

                });

            }]

        }

    }]);

})(window.angular, window.Math);