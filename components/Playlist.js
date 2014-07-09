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
                 * @method playVideo
                 * @param model {Object}
                 * @return {void}
                 */
                $scope.playVideo = function playVideo(model) {

                    // Change the source of the video, and type if necessary.
                    $scope.player.setAttribute('src', model.src);
                    $scope.player.setAttribute('type', model.type);
                    $scope.player.load();

                };

            }]

        }

    }]);

})(window.angular);