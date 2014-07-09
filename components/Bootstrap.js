/**
 * @module ngVideo
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/ngVideo
 */
(function Bootstrap($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo', []);

    /**
     * @constant ngVideoOptions
     * @type {Object}
     */
    module.constant('ngVideoOptions', {
        RESTRICT: 'CA'
    });

    /**
     * @value ngVideoPlaylist
     * @type {Object}
     */
    module.value('ngVideoPlaylist', []);

    /**
     * @service video
     * @type {Function}
     */
    module.service('video', ['$rootScope', '$timeout', 'ngVideoPlaylist',

        function videoService($rootScope, $timeout, ngVideoPlaylist) {

            var service = {};

            /**
             * @method addSource
             * @param type {String}
             * @param src {String}
             * @return {Object}
             */
            service.addSource = function addSource(type, src) {

                // Add a new video to the playlist, and broadcast the success.
                var model = { type: type, src: src },
                    video = ngVideoPlaylist.push(model);

                $rootScope.$broadcast('ng-video/add', model);
                return video;

            };

            /**
             * @method throwException
             * @param message {String}
             */
            service.throwException = function throwException(message) {
                throw 'ngVideo: ' + message + '.';
            };

            /**
             * @method play
             * @return {Boolean}
             */
            service.play = function play() {

                if (ngVideoPlaylist.length === 0) {

                    // Unable to process the video if we have zero sources.
                    return false;

                }

                return true;

            };

            return service;

        }]);

    /**
     * @directive ngVideo
     * @type {Function}
     */
    module.directive('ngVideo', ['video', 'ngVideoPlaylist', 'ngVideoOptions',

        function ngVideoDirective(video, ngVideoPlaylist, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 * @default "CA"
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @property scope
                 * @type {Boolean}
                 * @default true
                 */
                scope: true,

                /**
                 * @property controller
                 * @type {Function}
                 * @param $scope {Object}
                 */
                controller: ['$scope', function controller($scope) {

                    /**
                     * @constant SOURCE_HTML
                     * @type {String}
                     */
                    $scope.SOURCE_HTML = '<source src="{{src}}" type="video/{{type}}" />';

                    /**
                     * @property video
                     * @type {Object|null}
                     */
                    $scope.video = ngVideoPlaylist[0] || null;

                    /**
                     * @property player
                     * @type {Object}
                     */
                    $scope.player = {};

                }],

                /**
                 * @method link
                 * @return {void}
                 */
                link: function link(scope, element) {

                    // Attempt to find the video node.
                    var player = element.find('video');

                    // Ensure the video player exists.
                    if (player.length === 0 || typeof player.attr('ng-video-screen') === 'undefined') {
                        video.throwException("Must add ng-video-screen directive");
                    }

                    // We have the video player so store its instance.
                    scope.player = player[0];

                }

            }

        }]);

})(window.angular);