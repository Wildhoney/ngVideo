(function Feedback($angular, $math) {

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
            controller: ['$rootScope', '$scope', '$interval', '$window', 'ngVideoOptions',

                function controller($rootScope, $scope, $interval, $window, ngVideoOptions) {

                    /**
                     * @property interval
                     * @type {Object}
                     */
                    $scope.interval = {};

                    /**
                     * @property lastUpdate
                     * @type {Number}
                     */
                    $scope.lastUpdate = 0;

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
                     * @property buffering
                     * @type {Boolean}
                     */
                    $scope.buffering = false;

                    /**
                     * @property lastTime
                     * @type {Number}
                     * @private
                     */
                    var lastTime = 0;

                    /**
                     * @method grabStatistics
                     * @return {void}
                     */
                    $scope.grabStatistics = function grabStatistics() {

                        var player = $scope.player;

                        // Determine if we're currently buffering.
                        if (lastTime === player.currentTime && !player.paused) {
                            $scope.buffering = true;
                            return;
                        }

                        // Log the last time and ensure we're not displaying the buffering message.
                        lastTime = player.currentTime;
                        $scope.buffering = false;

                        // Iterate over each property we wish to listen to.
                        $angular.forEach(requiredProperties, function forEach(property) {

                            $scope[property] = !isNaN($scope.player[property]) ? $scope.player[property]
                                                                               : $scope[property];

                        });

                        if ($scope.player.buffered.length !== 0) {

                            // Update the buffered amount.
                            $scope.buffered = $math.round(player.buffered.end(0) / player.duration) * 100;

                        }

                        if ($scope.player.muted) {

                            // When muted the actual volume level is zero.
                            $scope.volume = 0;

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

                    /**
                     * @method updateVolume
                     * @return {void}
                     */
                    var updateVolume = function updateVolume() {
                        $scope.volume = $scope.player.volume;
                    };

                    // When we need to force the refreshing of the volume.
                    $scope.$on('ng-video/volume', updateVolume);

                    // When we need to force the refreshing of the properties.
                    $scope.$on('ng-video/feedback/refresh', $scope.grabStatistics);

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

                    // Also register the event natively from the player itself.
                    $scope.$on('ng-video/attach-events', function(event, player) {
                        player.bind('timeupdate', $scope.grabStatistics);
                        player.bind('volumechange', updateVolume);

                    });

                }]

        }

    }]);

})(window.angular, window.Math);