(function($angular) {

    "use strict";

    // In the end, everything will be okay. If it's not okay, it's not yet the end.
    var app = $angular.module('ngVideo', []);

    /**
     * @constant ngVideoOptions
     * @type {Object}
     */
    app.constant('ngVideoOptions', {

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
     * @param ngVideoOptions {Object}
     */
    app.directive('ngVideo', ['$sce', 'ngVideoOptions', function VideoDirective($sce, ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             * @default "CA"
             */
            restrict: ngVideoOptions.RESTRICT,

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
            template: '<video ng-src="{{videoUrl}}"></video><section ng-transclude class="ng-video-items"></section>',

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
                 * @method attachControls
                 * @return {Object}
                 */
                $scope.attachControls = function attachControls() {

                    return {

                        /**
                         * @method play
                         * @return {void}
                         */
                        play: function play() {
                            $scope.video.play();
                            $scope.isPaused = false;
                        },

                        /**
                         * @method pause
                         * @return {void}
                         */
                        pause: function pause() {
                            $scope.video.pause();
                            $scope.isPaused = true;
                        },

                        /**
                         * @method stop
                         * @return {void}
                         */
                        stop: function stop() {
                            $scope.video.pause();
                            $scope.isPaused = true;
                        }

                    };

                };

                /**
                 * @method attachSources
                 * @returns {Object}
                 */
                $scope.attachSources = function attachSources() {

                    return {

                        /**
                         * @method add
                         * @param source {String}
                         * @return {String}
                         */
                        add: function add(source) {

                            $scope.collection.push(source);
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
                 * @method attachInterface
                 * @return {void}
                 */
                $scope.attachInterface = function attachInterface() {

                    /**
                     * @property controls
                     * @type {Object}
                     */
                    $scope.interface.controls = $scope.attachControls();

                    /**
                     * @property sources
                     * @type {Object}
                     */
                    $scope.interface.sources = $scope.attachSources();

                };

                if ($scope.interface) {

                    // Attach the interface to the scope's interface.
                    $scope.attachInterface();

                }

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                scope.videoUrl = $sce.trustAsResourceUrl('http://www.w3schools.com/html/mov_bbb.mp4');

                // Memorise the video element.
                scope.video = element.find('video')[0];

            }

        }

    }]);

})(window.angular);