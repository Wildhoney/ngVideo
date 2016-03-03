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