(function($angular) {

    "use strict";

    // In the end, everything will be okay. If it's not okay, it's not yet the end.
    var app = $angular.module('ngVideo', []);

    /**
     * @constant ngVideoConstants
     * @type {Object}
     */
    app.constant('ngVideoConstants', {

        /**
         * @property restrict
         * @type {String}
         */
        RESTRICT: 'EA'

    });

    /**
     * @directive ngVideo
     * @type {Function}
     * @param video {Object}
     * @param ngVideoPlaylist {Array}
     * @param ngVideoConstants {Object}
     */
    app.directive('ngVideo', ['$sce', '$timeout', 'ngVideoConstants', function VideoDirective($sce, $timeout, ngVideoConstants) {

        return {

            /**
             * @property restrict
             * @type {String}
             * @default "CA"
             */
            restrict: ngVideoConstants.RESTRICT,

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                interface: '=ngModel'
            },

            /**
             * @property require
             * @type {String}
             */
            require: '?ngModel',

            /**
             * @property transclude
             * @type {Boolean}
             */
            transclude: true,

            /**
             * @property template
             * @type {String}
             */
            template: '<video ng-src="{{trustResource(video)}}"></video><section ng-transclude class="ng-video-items"></section>',

            /**
             * @property controller
             * @type {Array}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property isPaused
                 * @type {Boolean}
                 */
                $scope.isPaused = true;

                /**
                 * @property collection
                 * @type {Array}
                 */
                $scope.collection = [];

                /**
                 * @property videoElement
                 * @type {HTMLElement}
                 */
                $scope.videoElement = {};

                /**
                 * @method trustResource
                 * @param resourceUrl {String}
                 * @return {Object}
                 */
                $scope.trustResource = function trustResource(resourceUrl) {
                    return $sce.trustAsResourceUrl(resourceUrl);
                };

                /**
                 * @method getControls
                 * @return {Object}
                 */
                $scope.getControls = function getControls() {

                    return {

                        /**
                         * @method play
                         * @return {void}
                         */
                        play: function play() {
                            $scope.videoElement.play();
                            $scope.isPaused = false;
                        },

                        /**
                         * @method pause
                         * @return {void}
                         */
                        pause: function pause() {
                            $scope.videoElement.pause();
                            $scope.isPaused = true;
                        },

                        /**
                         * @method stop
                         * @return {void}
                         */
                        stop: function stop() {
                            $scope.videoElement.pause();
                            $scope.isPaused = true;
                        },

                        /**
                         * @method playPause
                         * @return {void}
                         */
                        playPause: function playPause() {

                            if ($scope.isPaused) {
                                this.play();
                                return;
                            }

                            this.pause();

                        }

                    };

                };

                /**
                 * @method getSources
                 * @returns {Object}
                 */
                $scope.getSources = function getSources() {

                    return {

                        /**
                         * @method add
                         * @param source {String}
                         * @return {String}
                         */
                        add: function add(source) {

                            $scope.collection.push(source);

                            var isAutoplay = $scope.videoElement.autoplay === true;

                            // Attempt to autoplay the video if it's the only video, there are no videos
                            // currently being played, and the `autoplay` option tells us to do so!
                            if (isAutoplay && !$scope.video && this.all().length === 1) {
                                $scope.video = source;
                                $scope.getControls().play();
                            }

                            return source;

                        },

                        /**
                         * @method remove
                         * @param source {String}
                         * @return {void}
                         */
                        remove: function remove(source) {
                            var index = $scope.collection.indexOf(source);
                            $scope.collection.splice(index, 1);
                        },

                        /**
                         * @method all
                         * @return {Array}
                         */
                        all: function all() {
                            return $scope.collection;
                        },

                        /**
                         * @method clear
                         * @return {void}
                         */
                        clear: function clear() {
                            $scope.collection.length = 0;
                        }

                    };

                };

                /**
                 * @method getOptions
                 * @return {Object}
                 */
                $scope.getOptions = function getOptions() {

                    return {

                        /**
                         * @method setAutoplay
                         * @param value {Boolean}
                         */
                        setAutoplay: function setAutoplay(value) {
                            $scope.videoElement.autoplay = !!value;
                        },

                        /**
                         * @method isAutoplay
                         * @return {Boolean}
                         */
                        isAutoplay: function isAutoplay() {
                            return $scope.videoElement.autoplay;
                        }

                    };

                };

                /**
                 * @method attachInterface
                 * @return {void}
                 */
                $scope.attachInterface = function attachInterface() {

                    /**
                     * @property controls
                     * @type {Object}
                     */
                    $scope.interface.controls = $scope.getControls();

                    /**
                     * @property sources
                     * @type {Object}
                     */
                    $scope.interface.sources = $scope.getSources();

                    /**
                     * @property options
                     * @type {Object}
                     */
                    $scope.interface.options = $scope.getOptions();

                };

                if ($scope.interface) {

                    // Attach the interface to the scope's interface.
                    $scope.attachInterface();

                    $timeout(function timeout() {

                        // Interface's directive has been attached!
                        $scope.$emit('$videoReady');

                    });

                }

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                // Memorise the video element.
                scope.videoElement = element.find('video')[0];

            }

        }

    }]);

})(window.angular);