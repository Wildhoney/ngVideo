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
             * @property scope
             * @type {Boolean}
             */
            scope: true,

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property videos
                 * @type {Array}
                 */
                $scope.videos = ngVideoPlaylist;

                /**
                 * @method currentIndex
                 * @return {Number}
                 */
                $scope.currentIndex = function currentIndex() {
                    return ngVideoPlaylist.currentIndex($scope.video);
                };

                /**
                 * @method tentativelyOpen
                 * @param index {Number}
                 * @return {void}
                 */
                $scope.tentativelyOpen = function tentativelyOpen(index) {

                    if (typeof ngVideoPlaylist[index] === 'undefined') {

                        // Nothing can be done if the attempted index doesn't exist in
                        // the playlist array.
                        return;

                    }

                    // Otherwise everything is okay to play the specified video!
                    $scope.open(ngVideoPlaylist[index]);

                };

                /**
                 * @method next
                 * @return {void}
                 */
                $scope.next = function next() {
                    $scope.tentativelyOpen($scope.currentIndex() + 1);
                };

                /**
                 * @method previous
                 * @return {void}
                 */
                $scope.previous = function previous() {
                    $scope.tentativelyOpen($scope.currentIndex() - 1);
                };

                /**
                 * @method first
                 * @return {void}
                 */
                $scope.first = function first() {
                    $scope.tentativelyOpen(0);
                };

                /**
                 * @method last
                 * @return {void}
                 */
                $scope.last = function last() {
                    $scope.tentativelyOpen(ngVideoPlaylist.length - 1);
                };

            }]

        }

    }]);

})(window.angular);