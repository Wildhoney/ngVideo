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
                 * @method attachInterface
                 * @return {void}
                 */
                $scope.attachInterface = function attachInterface() {

                    /**
                     * @property controls
                     * @type {Object}
                     */
                    $scope.interface.controls = {

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