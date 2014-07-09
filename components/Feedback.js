(function($angular) {

    "use strict";

    /**
     * @property requiredProperties
     * @type {String[]}
     */
    var requiredProperties = ['duration', 'currentTime'];

    $angular.module('ngVideo').directive('viFeedback', function ngVideoDirectiveScreen() {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'CA',

            /**
             * @property controller
             * @type {Function}
             * @param $scope {Object}
             */
            controller: ['$scope', '$interval', 'ngVideoOptions',

            function controller($scope, $interval, ngVideoOptions) {

                /**
                 * @property duration
                 * @type {Number}
                 */
                $scope.duration = 0;

                /**
                 * @property currentTime
                 * @type {Number}
                 */
                $scope.currentTime = 0;

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

                    // Iterate over each property we wish to listen to.
                    $angular.forEach(requiredProperties, function forEach(property) {
                        $scope[property] = $scope.player[property] || $scope[property];
                    });

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

    });

})(window.angular);