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
        RESTRICT: 'CA',
        REFRESH: 50
    });

    /**
     * @value ngVideoPlaylist
     * @type {Object}
     */
    module.value('ngVideoPlaylist', []);

    /**
     * @service video
     * @type {Function}
     * @param $rootScope {Object}
     * @param $timeout {Function|Object}
     * @param ngVideoPlaylist {Array}
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

            return service;

        }]);

    /**
     * @directive ngVideo
     * @type {Function}
     * @param video {Object}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoOptions {Object}
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
            controller: ['$rootScope', '$scope', function controller($rootScope, $scope) {

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

                /**
                 * @property playing
                 * @type {Boolean}
                 * @default false
                 */
                $scope.playing = false;

                /**
                 * @property loading
                 * @type {Boolean}
                 * @default true
                 */
                $scope.loading = true;

                /**
                 * Responsible for setting up the events to be fired based on
                 * the video's state.
                 *
                 * @method setupEvents
                 * @param player {Object}
                 * @return {void}
                 */
                $scope.setupEvents = function setupEvents(player) {

                    player.bind('play', function onPlay() {
                        $scope.playing = true;
                        $scope.$apply();
                    });

                    player.bind('pause', function onPause() {
                        $scope.playing = false;
                        $scope.$apply();
                    });

                    player.bind('ended', function onEnded() {
                        $scope.playing = false;
                        $scope.$apply();
                    });

                    player.bind('loadstart', function onLoadStart() {

                        $scope.loading = true;
                        $scope.$apply();

                    });

                    player.bind('loadeddata', function onLoadEnd() {

                        $scope.loading = false;
                        $rootScope.$broadcast('ng-video/reset');
                        $scope.$apply();

                        if ($scope.playing) {

                            // If we're already determined to be playing then force
                            // the starting of the video.
                            $scope.play();

                        }

                    });

                };

            }],

            /**
             * @method link
             * @return {void}
             */
            link: function link(scope, element) {

                // Attempt to find the video node.
                var player = element.find('video');

                // Ensure the video player exists.
                if (player.length === 0 || typeof player.attr('vi-screen') === 'undefined') {
                    video.throwException("Must add ng-video-screen directive");
                }

                // We have the video player so store its instance.
                scope.player = player[0];

                // Set-up the events to be fired.
                scope.setupEvents(player);

            }

        }

    }]);

})(window.angular);