/**
 * @module ngVideo
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/ngVideo
 */
(function Bootstrap($angular) {

    "use strict";

    /**
     * @directive ngVideo
     * @type {Function}
     * @param video {Object}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('ngVideo', ['$rootScope', 'video', 'ngVideoPlaylist', 'ngVideoOptions',

    function ngVideoDirective($rootScope, video, ngVideoPlaylist, ngVideoOptions) {

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
             * @param $window {Object}
             * @param $rootScope {Object}
             * @param $scope {Object}
             * @param video {Object}
             */
            controller: ['$window', '$rootScope', '$scope', 'video', function controller($window, $rootScope, $scope, video) {

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
                    player.bind('loadeddata', function onLoadedData() {

                        $scope.$apply(function apply() {

                            $scope.loading = false;
                            $rootScope.$broadcast('ng-video/reset');

                            if ($scope.playing || $scope.player.autoplay) {

                                // If we're already determined to be playing then force
                                // the starting of the video.
                                $scope.player.play();

                            }

                        });

                    });

                    // Once the video has finished playing.
                    player.bind('ended', function onEnded() {

                        $scope.$apply(function apply() {

                            /**
                             * @method playByIndex
                             * @param index {Number}
                             * @return {void}
                             */
                            var playByIndex = function playByIndex(index) {

                                $scope.open(ngVideoPlaylist[index]);
                                $scope.video = ngVideoPlaylist[index];
                                $scope.player.play();

                            };

                            // Attempt to find the current video.
                            var index = ngVideoPlaylist.indexOf($scope.video);

                            if (index === -1 || typeof ngVideoPlaylist[index + 1] === 'undefined') {

                                if ($scope.player.loop) {

                                    // Determine if we should keep looping the playlist.
                                    playByIndex(0);
                                    return;

                                }

                                // We're unable to find the next video, therefore we'll pause
                                // the whole process of updating the statistics.
                                $scope.player.pause();
                                return;

                            }

                            // Voila! Load the next video.
                            playByIndex(index + 1);

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

                    /**
                     * Responsible for determining if the video model that is about to be played
                     * is a valid model.
                     *
                     * @method assertValid
                     * @param videoModel {Object}
                     * @returns {Boolean}
                     */
                    var assertValid = function assertValid(videoModel) {

                        var isValid = ('src' in videoModel && 'type' in videoModel);

                        if (!isValid) {

                            // Throw an exception since the video model is no longer valid.
                            video.throwException("Passed an invalid video model to open");

                        }

                    };

                    /**
                     * @method loadVideo
                     * @param videoModel {Object}
                     * @return {void}
                     */
                    var loadVideo = function loadVideo(videoModel) {
                        $scope.video = videoModel;
                        $scope.player.setAttribute('src', videoModel.src);
                        $scope.player.setAttribute('type', videoModel.type);
                        $scope.player.load();
                    };

                    // Determine if the user has passed in a multi-source array.
                    if (videoModel instanceof Array) {

                        var foundVideo = false;

                        // Iterate over each video model to determine if it's playable.
                        $angular.forEach(videoModel, function forEach(model) {

                            // Assert the model is valid.
                            assertValid(model);

                            if (foundVideo) {

                                // We've already found a playable video in this collection.
                                return;

                            }

                            // Determine if the browser can play this type of media.
                            var canPlay = $scope.player.canPlayType('video/' + model.type);

                            if (canPlay) {

                                // Play the video since the browser most likely supports it.
                                loadVideo(model);

                            }

                        });

                        return;

                    }

                    // Assert the model is valid.
                    assertValid(videoModel);

                    // Otherwise it's a plain video model object.
                    loadVideo(videoModel);

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
                $scope.closeFullScreen = function closeFullScreen() {

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

                // Ensure the video player exists.
                if (player.length === 0 || typeof player.attr(ngVideoOptions.SCREEN_DIRECTIVE) === 'undefined') {
                    video.throwException("Must add ng-video-screen directive");
                }

                // We have the video player so store its instance.
                scope.player = player[0];

                // Set-up the events to be fired, and the event for notifying the message module
                // to set-up its own events.
                scope.attachEvents(player);
                $rootScope.$broadcast('ng-video/attach-events', player);

                if (scope.video) {

                    // Change the source of the video, and type if necessary.
                    scope.open(scope.video)

                }

                scope.$on('ng-video/add', function() {

                    if (ngVideoPlaylist.length === 1) {

                        // Open the newly added video if it's the first video.
                        scope.open(ngVideoPlaylist[0]);

                    }

                });

                scope.$watch(function watchSource() {

                    // Watch for any changes to the `forceVideo` parameter.
                    return video.forceVideo;

                }, function forcingVideo() {

                    if (video.forceVideo) {

                        // Play the video immediately!
                        scope.open(video.forceVideo);

                    }

                });

            }

        }

    }]);

})(window.angular);