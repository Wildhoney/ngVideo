/**
 * @module ngVideo
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/ngVideo
 */
(function Service($angular) {

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
        SCREEN_CHANGE: true,
        TIMELINE_CHANGE: true,
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
         * @property forceVideo
         * @type {String}
         */
        service.forceVideo = '';

        /**
         * @method addSource
         * @param type {String}
         * @param src {String}
         * @param immediatelyPlay {Boolean}
         * @return {Object}
         */
        service.addSource = function addSource(type, src, immediatelyPlay) {

            // Add a new video to the playlist, and broadcast the success.
            var model = { type: type, src: src };
            ngVideoPlaylist.push(model);

            $rootScope.$broadcast('ng-video/add', model);

            if (immediatelyPlay) {
                service.forceVideo = model;
            }

            return model;

        };

        /**
         * @method multiSource
         * @return {MultiSource}
         */
        service.multiSource = function multiSource() {

            /**
             * @class MultiSource
             * @constructor
             */
            function MultiSource() {}

            /**
             * @property prototype
             * @type {Object}
             */
            MultiSource.prototype = {

                /**
                 * @property sources
                 * @type {Array}
                 */
                sources: [],

                /**
                 * @method addSource
                 * @param type {String}
                 * @param src {String}
                 * @return {void}
                 */
                addSource: function addSource(type, src) {
                    this.sources.push({ type: type, src: src });
                },

                /**
                 * @method save
                 * @param immediatelyPlay {Boolean}
                 * @return {Object}
                 */
                save: function save(immediatelyPlay) {

                    ngVideoPlaylist.push(this.sources);
                    $rootScope.$broadcast('ng-video/add', this.sources);

                    if (immediatelyPlay) {
                        service.forceVideo = this.sources;
                    }

                    return this.sources;

                }

            };

            return new MultiSource();

        };

        /**
         * @method throwException
         * @param message {String}
         * @return {void}
         */
        service.throwException = function throwException(message) {
            throw 'ngVideo: ' + message + '.';
        };

        return service;

    }]);

})(window.angular);

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

(function Buffer($angular) {

    "use strict";

    /**
     * @directive viBuffer
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viBuffer', ['ngVideoOptions',

    function ngBufferDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property template
             * @type {String}
             */
            template: '<canvas height="{{height}}" width="{{width}}"></canvas>',

            /**
             * @property scope
             * @type {Boolean}
             */
            scope: true,

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                // Configure the width and the height.
                scope.height = ngVideoOptions.BUFFER_HEIGHT;
                scope.width  = ngVideoOptions.BUFFER_WIDTH;

                var canvas  = element.find('canvas')[0],
                    context = canvas.getContext('2d');

                // Observe the `lastUpdate` which provides a live data-stream when a
                // video is playing.
                scope.$watch('lastUpdate', function watch() {

                    var buffered = scope.player.buffered,
                        duration = scope.player.duration,
                        count    = buffered.length,
                        width    = canvas.width,
                        height   = canvas.height;

                    // Determine the fill colour of the buffer bar.
                    context.fillStyle = ngVideoOptions.BUFFER_COLOUR;

                    while (count--) {

                        // Fill in the rectangle according to the buffered object.
                        var x = buffered.start(count) / duration * width,
                            y = buffered.end(count) / duration * width;

                        context.fillRect(x, 0, y - x, height);

                    }

                });

            }

        }

    }]);

})(window.angular);

(function Controls($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * List of actions that are available on the video player.
     *
     * @property actions
     * @type {String[]}
     */
    var actions = ['play', 'pause'];

    /**
     * @directive viControls
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    module.directive('viControls', ['ngVideoOptions',

    function ngControlsDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @method play
                 * @return {void}
                 */
                $scope.play = function play() {
                    $scope.player.play();
                    $scope.$apply();
                };

                /**
                 * @method pause
                 * @return {void}
                 */
                $scope.pause = function pause() {
                    $scope.player.pause();
                    $scope.$apply();
                };

            }]

        }

    }]);

    /**
     * @method createControlDirective
     * @param name {String}
     * @return {Object}
     */
    var createControlDirective = function createControlDirective(name) {

        /**
         * @property directiveLabel
         * @type {String}
         */
        var directiveLabel = name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viControlsItem
         * @type {Function}
         */
        module.directive('viControls' + directiveLabel, ['video', 'ngVideoOptions',

        function viControlsItem(video, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @param scope {Object}
                 * @param element {Object}
                 * @return {void}
                 */
                link: function link(scope, element) {

                    // Ensure the control type is currently supported.
                    if (typeof scope[name] !== 'function') {
                        video.throwException("Control type '" + name + "' is unsupported");
                    }

                    element.bind('click', scope[name]);

                }

            }

        }]);

    };

    // Attach all of our control item directives.
    $angular.forEach(actions, function forEach(actionName) {
        createControlDirective(actionName);
    });

})(window.angular);

(function Feedback($angular, $math) {

    "use strict";

    /**
     * @property requiredProperties
     * @type {String[]}
     */
    var requiredProperties = ['duration', 'currentTime', 'volume', 'playbackRate'];

    /**
     * @directive viFeedback
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viFeedback', ['ngVideoOptions',

    function ngFeedbackDirective(ngVideoOptions) {

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
             * @param $interval {Function|Object}
             * @param $window {Object}
             * @param ngVideoOptions {Object}
             */
            controller: ['$rootScope', '$scope', '$interval', '$window', 'ngVideoOptions',

                function controller($rootScope, $scope, $interval, $window, ngVideoOptions) {

                    /**
                     * @property interval
                     * @type {Object}
                     */
                    $scope.interval = {};

                    /**
                     * @property lastUpdate
                     * @type {Number}
                     */
                    $scope.lastUpdate = 0;

                    /**
                     * @property duration
                     * @type {Number}
                     */
                    $scope.duration = 0;

                    /**
                     * @property volume
                     * @type {Number}
                     */
                    $scope.volume = 1;

                    /**
                     * @property playbackRate
                     * @type {Number}
                     */
                    $scope.playbackRate = 1;

                    /**
                     * @property currentTime
                     * @type {Number}
                     */
                    $scope.currentTime = 0;

                    /**
                     * @property percentagePlayed
                     * @type {Number}
                     */
                    $scope.percentagePlayed = 0;

                    /**
                     * @property buffered
                     * @type {Number}
                     */
                    $scope.buffered = 0;

                    /**
                     * @property buffering
                     * @type {Boolean}
                     */
                    $scope.buffering = false;

                    /**
                     * @property lastTime
                     * @type {Number}
                     * @private
                     */
                    var lastTime = 0;

                    /**
                     * @method grabStatistics
                     * @return {void}
                     */
                    $scope.grabStatistics = function grabStatistics() {

                        var player = $scope.player;

                        // Determine if we're currently buffering.
                        if (lastTime === player.currentTime && !player.paused) {
                            $scope.buffering = true;
                            return;
                        }

                        // Log the last time and ensure we're not displaying the buffering message.
                        lastTime = player.currentTime;
                        $scope.buffering = false;

                        // Iterate over each property we wish to listen to.
                        $angular.forEach(requiredProperties, function forEach(property) {

                            $scope[property] = !isNaN($scope.player[property]) ? $scope.player[property]
                                                                               : $scope[property];

                        });

                        if ($scope.player.buffered.length !== 0) {

                            // Update the buffered amount.
                            $scope.buffered = $math.round(player.buffered.end(0) / player.duration) * 100;

                        }

                        if ($scope.player.muted) {

                            // When muted the actual volume level is zero.
                            $scope.volume = 0;

                        }

                        // Calculate other miscellaneous properties.
                        $scope.percentagePlayed = ($scope.currentTime / $scope.duration) * 100;

                        // Notify everybody that the statistics have been updated!
                        $scope.lastUpdate = new $window.Date().getTime();

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

                    // When we need to force the refreshing of the statistics.
                    $scope.$on('ng-video/reset', function forceReset() {

                        $scope.player.currentTime = 0;
                        $scope.grabStatistics();

                    });

                    /**
                     * @method updateVolume
                     * @return {void}
                     */
                    var updateVolume = function updateVolume() {
                        $scope.volume = $scope.player.volume;
                    };

                    // When we need to force the refreshing of the volume.
                    $scope.$on('ng-video/volume', updateVolume);

                    // When we need to force the refreshing of the properties.
                    $scope.$on('ng-video/feedback/refresh', $scope.grabStatistics);

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

                    // Also register the event natively from the player itself.
                    $scope.$on('ng-video/attach-events', function(event, player) {
                        player.bind('timeupdate', $scope.grabStatistics);
                        player.bind('volumechange', updateVolume);

                    });

                }]

        }

    }]);

})(window.angular, window.Math);

(function FullScreen($angular) {

    "use strict";
    /**
     * @method createFullScreenDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createFullScreenDirective = function createFullScreenDirective(name, clickFn) {

        /**
         * @property directiveLabel
         * @type {String}
         */
        var directiveLabel = name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viVolumeItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive('viFullScreen' + directiveLabel, ['$window', 'ngVideoOptions',

        function viVolumeItem($window, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @param scope {Object}
                 * @param element {Object}
                 * @return {void}
                 */
                link: function link(scope, element) {

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, $window.document);
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viFullScreenOpen
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('open', function onFullScreenOpenClick(scope) {
        scope.openFullScreen();
    });

    /**
     * @directive viFullScreenClose
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('close', function onFullScreenCloseClick(scope) {
        scope.closeFullScreen();
    });

    /**
     * @directive viFullScreenToggle
     * @type {Function}
     * @param scope {Object}
     */
    createFullScreenDirective('toggle', function onFullScreenToggleClick(scope, document) {

        /**
         * @method inFullScreen
         * @return {Boolean}
         */
        var inFullScreen = function inFullScreen() {

            if (document.fullscreenElement) {

                // W3C.
                return !!document.fullscreenElement;

            } else if (document.mozFullscreenElement) {

                // Mozilla.
                return !!document.mozFullscreenElement;

            } else if (document.webkitFullscreenElement) {

                // Webkit.
                return !!document.webkitFullscreenElement;

            }

        };

        if (!inFullScreen()) {

            // Determine if we're currently in full-screen mode, and then deduce which method
            // to call based on the result.
            scope.openFullScreen();
            return;

        }

        // Close the full screen mode if we're still full screen.
        scope.closeFullScreen();

    });

})(window.angular);

(function Messages($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @constant TYPE
     * @type {Object}
     */
    var TYPE = { ERROR: 1, INFORMATION: 2, GENERAL: 3 };

    /**
     * @constant ngVideoMessages
     * @type {Object}
     */
    module.constant('ngVideoMessages', {
        CAN_PLAY:         { ref: 1, text: 'Can Play', type: TYPE.INFORMATION, event: 'canplay' },
        CAN_PLAY_THROUGH: { ref: 2, text: 'Can Play Through', type: TYPE.INFORMATION, event: 'canplaythrough' },
        DURATION_CHANGE:  { ref: 3, text: 'Duration Change', type: TYPE.GENERAL, event: 'durationchange' },
        EMPTIED:          { ref: 4, text: 'Emptied', type: TYPE.INFORMATION, event: 'emptied' },
        ENDED:            { ref: 5, text: 'Ended', type: TYPE.INFORMATION, event: 'ended' },
        ERROR:            { ref: 6, text: 'Error', type: TYPE.ERROR, event: 'error' },
        LOADED_DATA:      { ref: 7, text: 'Loaded Data', type: TYPE.INFORMATION, event: 'loadeddata' },
        LOADED_META_DATA: { ref: 8, text: 'Loaded Meta Data', type: TYPE.INFORMATION, event: 'loadedmetadata' },
        LOAD_START:       { ref: 9, text: 'Looking', type: TYPE.INFORMATION, event: 'loadstart' },
        PAUSE:            { ref: 10, text: 'Pause', type: TYPE.GENERAL, event: 'pause' },
        PLAY:             { ref: 11, text: 'Play', type: TYPE.GENERAL, event: 'play' },
        PLAYING:          { ref: 12, text: 'Playing', type: TYPE.GENERAL, event: 'playing' },
        PROGRESS:         { ref: 13, text: 'Progress', type: TYPE.INFORMATION, event: 'progress' },
        RATE_CHANGE:      { ref: 14, text: 'Rate Change', type: TYPE.INFORMATION, event: 'ratechange' },
        SEEKED:           { ref: 15, text: 'Seeked', type: TYPE.INFORMATION, event: 'seeked' },
        SEEKING:          { ref: 16, text: 'Seeking', type: TYPE.INFORMATION, event: 'seeking' },
        STALLED:          { ref: 17, text: 'Stalled', type: TYPE.ERROR, event: 'stalled' },
        SUSPEND:          { ref: 18, text: 'Suspended', type: TYPE.ERROR, event: 'suspend' },
        TIME_UPDATE:      { ref: 19, text: 'Time Update', type: TYPE.GENERAL, event: 'timeupdate' },
        VOLUME_CHANGE:    { ref: 19, text: 'Volume Change', type: TYPE.GENERAL, event: 'volumechange' },
        WAITING:          { ref: 20, text: 'Waiting', type: TYPE.INFORMATION, event: 'waiting' }
    });

    /**
     * @directive viMessages
     * @type {Function}
     * @param ngVideoOptions {Object}
     * @param ngVideoMessages {Object}
     */
    module.directive('viMessages', ['$window', 'ngVideoOptions', 'ngVideoMessages',

    function ngMessagesDirective($window, ngVideoOptions, ngVideoMessages) {

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
                 * @property messages
                 * @type {Array}
                 */
                $scope.messages = [];

                // Listen for the moment in which we can safely register the message events.
                $scope.$on('ng-video/attach-events', function registerMessageEvents(event, player) {

                    // Iterate over our messages to register their events.
                    $angular.forEach(ngVideoMessages, function forEach(messageModel) {

                        player.bind(messageModel.event, function eventTriggered() {

                            delete messageModel.$$hashKey;

                            // Create a copy to prevent duplicates.
                            messageModel = $angular.copy(messageModel);

                            // Push the message model into our messages array when it has been
                            // triggered by the player.
                            messageModel.date = new $window.Date();
                            $scope.messages.push(messageModel);
                            $scope.$apply();

                        });

                    });

                });

            }]

        }

    }]);

})(window.angular);

(function Meta($angular) {

    "use strict";

    /**
     * @directive viMeta
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viMeta', ['$window', 'ngVideoOptions',

    function ngMetaDirective($window, ngVideoOptions) {

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
             * @property require
             * @type {String}
             */
            require: 'ngModel',

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property duration
                 * @type {Number}
                 * @default 0
                 */
                $scope.duration = 0;

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @param attr {Object}
             * @param ngModel {Object}
             * @return {void}
             */
            link: function link(scope, element, attr, ngModel) {

                // Create the video node for reading the meta data.
                scope.player = $window.document.createElement('video');
                var video    = $angular.element(scope.player);

                // Prevent the preloading of the video content to save bandwidth.
                scope.player.setAttribute('preload', false);

                // Once the meta data for the video has been retrieved.
                video.bind('loadedmetadata', function onLoadedMetaData() {

                    // Read in the meta values.
                    scope.duration = scope.player.duration;
                    scope.$apply();

                    delete scope.player;

                });

                scope.$watch(function watchProperty() {

                    // Watch the ngModel and react once it updates.
                    return ngModel.$modelValue;

                }, function valueChanged(videoModel) {

                    scope.player.setAttribute('src', videoModel.src);
                    scope.player.load();

                });

            }

        }

    }]);

})(window.angular);

(function PlaybackRate($angular) {

    "use strict";

    /**
     * @method createPlaybackRateDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createPlaybackRateDirective = function createPlaybackRateDirective(name, clickFn) {

        /**
         * @property directiveName
         * @type {String}
         */
        var directiveName = 'viPlaybackRate' + name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viPlaybackRateItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive(directiveName, ['$rootScope', 'ngVideoOptions',

        function viPlaybackRateItem($rootScope, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @param scope {Object}
                 * @param element {Object}
                 * @param attributes {Object}
                 * @return {void}
                 */
                link: function link(scope, element, attributes) {

                    /**
                     * @method setPlaybackRate
                     * @param rate {Number}
                     * @return {void}
                     */
                    scope.setPlaybackRate = function setPlaybackRate(rate) {

                        // Update the current play rate and the default play rate for when another
                        // video is played.
                        scope.player.playbackRate        = rate;
                        scope.player.defaultPlaybackRate = rate;

                        // Force the refreshing of the statistics.
                        $rootScope.$broadcast('ng-video/feedback/refresh');

                    };

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, +attributes[directiveName], +scope.player.playbackRate);

                        // Force the timeline directive to update.
                        $rootScope.$broadcast('ng-video/feedback/refresh');
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viPlaybackRate
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     */
    createPlaybackRateDirective('', function onPlaybackRateClick(scope, directiveValue) {
        scope.setPlaybackRate(directiveValue);
    });

    /**
     * @directive viPlaybackRateNormalise
     * @type {Function}
     * @param scope {Object}
     */
    createPlaybackRateDirective('normalise', function onPlaybackRateNormaliseClick(scope) {
        scope.setPlaybackRate(1);
    });

    /**
     * @directive viPlaybackRateIncrement
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     * @param currentRate {Number}
     */
    createPlaybackRateDirective('increment', function onPlaybackRateIncrementClick(scope, directiveValue, currentRate) {
        scope.setPlaybackRate(currentRate + directiveValue);
    });

    /**
     * @directive viPlaybackRateDecrement
     * @type {Function}
     * @param scope {Object}
     * @param directiveValue {Number}
     * @param currentRate {Number}
     */
    createPlaybackRateDirective('decrement', function onPlaybackRateDecrementClick(scope, directiveValue, currentRate) {
        scope.setPlaybackRate(currentRate - directiveValue);
    });

})(window.angular);

(function Playlist($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive viPlaylist
     * @type {Function}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoOptions {Object}
     */
    module.directive('viPlaylist', ['ngVideoPlaylist', 'ngVideoOptions',

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

    /**
     * @directive viPlaylistVideo
     * @type {Function}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoOptions {Object}
     */
    module.directive('viPlaylistVideo', ['ngVideoPlaylist', 'ngVideoOptions',

    function ngPlaylistVideoDirective(ngVideoPlaylist, ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property require
             * @type {String}
             */
            require: 'ngModel',

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @param attr {Object}
             * @param ngModel {Object}
             * @return {void}
             */
            link: function link(scope, element, attr, ngModel) {

                scope.$watch(function watchProperty() {

                    // Watch the ngModel and react once it updates.
                    return ngModel.$modelValue;

                }, function valueChanged(videoModel) {

                    element.bind('click', function onClick() {

                        scope.$apply(function apply() {

                            // Open the video when the user clicks on the item in the playlist.
                            scope.open(videoModel);

                        });

                    });

                });

            }

        }

    }]);

})(window.angular);

(function Screen($angular) {

    "use strict";

    /**
     * @directive viScreen
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viScreen', ['ngVideoOptions',

    function ngScreenDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                if (ngVideoOptions.SCREEN_CHANGE) {

                    // When the video player screen is clicked, we'll toggle the playing
                    // state of the current video, if there is one.
                    element.bind('click', function() {

                        if (!scope.loading) {
                            scope.toggleState();
                        }

                    });

                }

            }

        }

    }]);

})(window.angular);

(function Seekable($angular) {

    "use strict";

    /**
     * @method createSeekableDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createSeekableDirective = function createSeekableDirective(name, clickFn) {

        /**
         * @property directiveName
         * @type {String}
         */
        var directiveName = 'viSeekable' + name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viSeekableItem
         * @type {Function}
         */
        $angular.module('ngVideo').directive(directiveName, ['$rootScope', 'ngVideoOptions',

        function viSeekableItem($rootScope, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @param scope {Object}
                 * @param element {Object}
                 * @param attributes {Object}
                 * @return {void}
                 */
                link: function link(scope, element, attributes) {

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, +attributes[directiveName], +scope.player.currentTime);

                        // Force the timeline directive to update.
                        $rootScope.$broadcast('ng-video/feedback/refresh');
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viVolumeTime
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('', function onTimeClick(scope, directiveValue) {
        scope.player.currentTime = directiveValue;
    });

    /**
     * @directive viSeekableIncrement
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('increment', function onIncrementClick(scope, directiveValue, currentTime) {
        scope.player.currentTime = currentTime + directiveValue;
    });

    /**
     * @directive viSeekableDecrement
     * @type {Function}
     * @param scope {Object}
     */
    createSeekableDirective('decrement', function onIncrementClick(scope, directiveValue, currentTime) {
        scope.player.currentTime = currentTime - directiveValue;
    });

})(window.angular);

(function Timeline($angular) {

    "use strict";

    /**
     * @directive viTimeline
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viTimeline', ['ngVideoOptions',

    function ngTimelineDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property template
             * @type {String}
             */
            template: '<input type="range" value="0" />',

            /**
             * @property replace
             * @type {Boolean}
             */
            replace: true,

            /**
             * @property scope
             * @type {Boolean}
             */
            scope: true,

            /**
             * @property link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function(scope, element) {

                /**
                 * @property wasPlaying
                 * @type {Boolean}
                 * @default false
                 */
                scope.wasPlaying = false;

                // When we need to force the resetting of the range.
                scope.$on('ng-video/reset', function resetRange() {
                    element.val(0);
                });

                if (ngVideoOptions.TIMELINE_CHANGE) {

                    // Whenever the user attempts to seek we'll pause to allow them to
                    // change it in peace.
                    element.bind('mousedown', function onMouseDown() {
                        scope.wasPlaying = scope.playing;
                        scope.pause();
                    });

                    // Whenever the user finishes seeking, we'll continue playing the video.
                    element.bind('mouseup', function onMouseUp() {

                        // Only resume if the video was playing before.
                        if (scope.wasPlaying) {
                            scope.play();
                        }

                    });

                    element.bind('change', function() {

                        // Calculate what the percentage means in terms of the video's
                        // new position, and update it!
                        scope.player.currentTime = (element.val() / 100) * scope.player.duration;

                    });

                }

                /**
                 * @method updatePosition
                 * @return {void}
                 */
                var updatePosition = function updatePosition() {

                    // Calculate the percentage for the range node, and update
                    // it accordingly.
                    var percentage = (scope.player.currentTime / scope.duration) * 100;
                    element.val(percentage);

                };

                // Listen for when the statistics have been updated.
                scope.$watch('lastUpdate', updatePosition);
                scope.$on('ng-video/seekable', updatePosition);

            }

        }

    }]);

})(window.angular);

(function Volume($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive viVolume
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    module.directive('viVolume', ['ngVideoOptions', function ngVolumeDirective(ngVideoOptions) {

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
            controller: ['$rootScope', '$scope', function controller($rootScope, $scope) {

                /**
                 * @method setVolume
                 * @param volume {Number}
                 * @return {void}
                 */
                $scope.setVolume = function setVolume(volume) {

                    if ($scope.player.muted && volume > 0) {

                        // Determine if the user is un-muting the player, which can be set
                        // as the `muted` attribute on the player itself.
                        $scope.player.muted = false;

                    }

                    if (volume < ngVideoOptions.VOLUME_MINIMUM) {
                        volume = ngVideoOptions.VOLUME_MINIMUM;
                    }

                    if (volume > ngVideoOptions.VOLUME_MAXIMUM) {
                        volume = ngVideoOptions.VOLUME_MAXIMUM;
                    }

                    // Set the constrained volume parameter.
                    $scope.player.volume = +(volume).toFixed(2);
                    $rootScope.$broadcast('ng-video/volume', $scope.player.volume);

                };

            }]

        }

    }]);

    /**
     * @method createVolumeDirective
     * @param name {String}
     * @param clickFn {Function}
     * @return {Object}
     */
    var createVolumeDirective = function createVolumeDirective(name, clickFn) {

        /**
         * @property directiveLabel
         * @type {String}
         */
        var directiveLabel = name.charAt(0).toUpperCase() + name.slice(1);

        /**
         * @directive viVolumeItem
         * @type {Function}
         */
        module.directive('viVolume' + directiveLabel, ['ngVideoOptions',

        function viVolumeItem(ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @param scope {Object}
                 * @param element {Object}
                 * @return {void}
                 */
                link: function link(scope, element) {

                    element.bind('click', function onClick() {

                        // Invoke the `clickFn` callback when the element has been clicked.
                        clickFn.call(this, scope, scope.player.volume, ngVideoOptions.VOLUME_STEPS);
                        scope.$apply();

                    });

                }

            }

        }]);

    };

    /**
     * @directive viVolumeDecrease
     * @type {Function}
     * @param scope {Object}
     * @param currentVolume {Number}
     * @param volumeSteps {Number}
     */
    createVolumeDirective('decrease', function onDecreaseClick(scope, currentVolume, volumeSteps) {
        scope.setVolume(currentVolume - volumeSteps);
    });

    /**
     * @directive viVolumeIncrease
     * @type {Function}
     * @param scope {Object}
     * @param currentVolume {Number}
     * @param volumeSteps {Number}
     */
    createVolumeDirective('increase', function onIncreaseClick(scope, currentVolume, volumeSteps) {
        scope.setVolume(currentVolume + volumeSteps);
    });

    /**
     * @directive viVolumeMute
     * @type {Function}
     * @param scope {Object}
     */
    createVolumeDirective('mute', function onMuteClick(scope) {
        scope.setVolume(0);
    });

    /**
     * @directive viVolumeLoudest
     * @type {Function}
     * @param scope {Object}
     */
    createVolumeDirective('loudest', function onLoudestClick(scope) {
        scope.setVolume(1);
    });

})(window.angular);