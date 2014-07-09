(function($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive ngVideoControls
     * @type {Function}
     */
    module.directive('viPlaylist', ['ngVideoPlaylist', 'ngVideoOptions',

        function ngVideoPlaylistDirective(ngVideoPlaylist, ngVideoOptions) {

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