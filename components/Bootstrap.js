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
        SCREEN_DIRECTIVE: 'vi-screen',
        VOLUME_STEPS: 0.1,
        VOLUME_MINIMUM: 0,
        VOLUME_MAXIMUM: 1,
        BUFFER_COLOUR: '#dd4b39',
        BUFFER_HEIGHT: 1,
        BUFFER_WIDTH: 485
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
             * @type {Array}
             * @param $rootScope {Object}
             * @param $scope {Object}
             */
            controller: ['$window', '$rootScope', '$scope',

            function controller($window, $rootScope, $scope) {

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
                        player.bind('loadstart', $setProperty('loading', true));

                    }());

                    // Once the video data has been loaded and the video is ready to be played.
                    player.bind('loadeddata', function onLoadEnd() {

                        $scope.$apply(function apply() {

                            $scope.loading = false;
                            $rootScope.$broadcast('ng-video/reset');

                            if ($scope.playing || $scope.player.autoplay) {

                                // If we're already determined to be playing then force
                                // the starting of the video.
                                $scope.play();

                            }

                        });

                    });

                    // Once the video has finished playing.
                    player.bind('ended', function onEnded() {

                        $scope.$apply(function apply() {

                            /**
                             * @method $play
                             * @param index {Number}
                             * @return {void}
                             */
                            var $play = function $play(index) {

                                $scope.open(ngVideoPlaylist[index]);
                                $scope.video = ngVideoPlaylist[index];
                                $scope.player.play();

                            };

                            // Attempt to find the current video.
                            var index = ngVideoPlaylist.indexOf($scope.video);

                            if (index === -1 || typeof ngVideoPlaylist[index + 1] === 'undefined') {

                                if ($scope.player.loop) {

                                    // Determine if we should keep looping the playlist.
                                    $play(0);
                                    return;

                                }

                                // We're unable to find the next video, therefore we'll pause
                                // the whole process of updating the statistics.
                                $scope.player.pause();
                                return;

                            }

                            // Voila! Load the next video.
                            $play(index + 1);

                        });

                    });

                };

                /**
                 * Responsible for taking a video model and loading it into the video node.
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

                };

                /**
                 * Responsible for toggling the state of the video. If the video is currently
                 * playing, then we'll pause it, and vice-versa!
                 *
                 * @method toggleState
                 * @return {void}
                 */
                $scope.toggleState = function toggleState() {

                    if ($scope.playing) {
                        $scope.player.pause();
                        return;
                    }

                    $scope.player.play();

                };

                /**
                 * @method closeFullScreen
                 * @return {void}
                 */
                $scope.closeFullScreen = function openFullScreen() {

                    var document = $window.document;

                    if (document.exitFullscreen) {

                        // W3C.
                        document.exitFullscreen();

                    } else if (document.mozExitFullscreen) {

                        // Mozilla.
                        document.mozExitFullscreen();

                    } else if (document.webkitExitFullscreen) {

                        // Webkit.
                        document.webkitExitFullscreen();

                    }
                };

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                /**
                 * @property container
                 * @type {Object}
                 */
                scope.container = element[0];

                /**
                 * @method openFullScreen
                 * @return {void}
                 */
                scope.openFullScreen = function openFullScreen() {

                    if (scope.container.requestFullscreen) {

                        // W3C.
                        scope.container.requestFullscreen();

                    } else if (scope.container.mozRequestFullScreen) {

                        // Mozilla.
                        scope.container.mozRequestFullScreen();

                    } else if (scope.container.webkitRequestFullscreen) {

                        // Webkit.
                        scope.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

                    }

                };

                // Attempt to find the video node.
                var player = element.find('video');

//                player.bind('stalled', function() {
//                    console.log('Stalled');
//                });

                // Ensure the video player exists.
                if (player.length === 0 || typeof player.attr(ngVideoOptions.SCREEN_DIRECTIVE) === 'undefined') {
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