(function($angular) {

    "use strict";

    /**
     * @directive viPlaylist
     * @type {Function}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viPlaylist', ['ngVideoPlaylist', 'ngVideoOptions',

    function ngPlaylistDirective(ngVideoPlaylist, ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Function}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property videos
                 * @type {Array}
                 */
                $scope.videos = ngVideoPlaylist;

                /**
                 * @method next
                 * @return {void}
                 */
                $scope.next = function next() {};

                /**
                 * @method previous
                 * @return {void}
                 */
                $scope.previous = function previous() {};

                /**
                 * @method first
                 * @return {void}
                 */
                $scope.first = function first() {};

                /**
                 * @method last
                 * @return {void}
                 */
                $scope.last = function last() {};

            }]

        }

    }]);

})(window.angular);