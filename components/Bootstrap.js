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
        REFRESH: 50,
        SCREEN: 'vi-screen'
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
                 * @method attachEvents
                 * @param player {Object}
                 * @return {void}
                 */
                $scope.attachEvents = function attachEvents(player) {

                    (function setupBasicEvents() {

                        /**
                         * @method $setProperty
                         * @param property {String}
                         * @param value {String|Number|Boolean}
                         * @return {Function}
                         */
                        var $setProperty = function $setProperty(property, value) {

                            return function() {
                                $scope[property] = value;
                                $scope.$apply();
                            };

                        };

                        // Configure the simple events that respond to the player's state.
                        player.bind('play', $setProperty('playing', true));
                        player.bind('pause', $setProperty('playing', false));
                        player.bind('ended', $setProperty('playing', false));
                        player.bind('loadstart', $setProperty('loading', true));

                    }());

                    // Once the video data has been loaded and the video is ready to be played.
                    player.bind('loadeddata', function onLoadEnd() {

                        $scope.$apply(function apply() {

                            $scope.loading = false;
                            $rootScope.$broadcast('ng-video/reset');

                            if ($scope.playing) {

                                // If we're already determined to be playing then force
                                // the starting of the video.
                                $scope.play();

                            }

                        });

                    });

                };

                /**
                 * Responsible for taking a video model and loading it
                 * into the video node.
                 *
                 * @method open
                 * @param videoModel {Object}
                 * @return {void}
                 */
                $scope.open = function open(videoModel) {

                    if (!('src' in videoModel) || !('type' in videoModel)) {

                        // Ensure a valid video model has been passed to open.
                        video.throwException("Passed an invalid video model to open");

                    }

                    // Attach the video's source to the video node, and load the video
                    // for playing.
                    $scope.player.setAttribute('src', videoModel.src);
                    $scope.player.setAttribute('type', videoModel.type);
                    $scope.player.load();

                }

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                // Attempt to find the video node.
                var player = element.find('video');

                // Ensure the video player exists.
                if (player.length === 0 || typeof player.attr(ngVideoOptions.SCREEN) === 'undefined') {
                    video.throwException("Must add ng-video-screen directive");
                }

                // We have the video player so store its instance.
                scope.player = player[0];

                // Set-up the events to be fired.
                scope.attachEvents(player);

                if (scope.video) {

                    // Change the source of the video, and type if necessary.
                    scope.open(scope.video)

                }

            }

        }

    }]);

})(window.angular);