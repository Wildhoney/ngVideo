(function($angular) {

    "use strict";

    $angular.module('ngVideo').directive('viTimeline', ['ngVideoOptions',

        function ngVideoDirectiveTimeline(ngVideoOptions) {

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
                 * @property link
                 * @param scope {Object}
                 * @param element {Object}
                 * @return {void}
                 */
                link: function(scope, element) {

                    // Listen for when the statistics have been updated.
                    scope.$watch('lastUpdate', function onUpdate() {

                        if (scope.playing) {

                            // Calculate the percentage for the range node, and update
                            // it accordingly.
                            var percentage = (scope.currentTime / scope.duration) * 100;
                            element.val(percentage);

                        }

                        // Whenever the user attempts to seek we'll pause to allow them to
                        // change it in peace.
                        element.bind('mousedown', function onMouseDown() {
                            scope.pause();
                        });

                        // Whenever the user finishes seeking, we'll continue playing the video.
                        element.bind('mouseup', function onMouseUp() {
                            scope.play();
                        });

                        element.bind('change', function() {

                            // Calculate what the percentage means in terms of the video's
                            // new position, and update it!
                            scope.player.currentTime = (element.val() / 100) * scope.player.duration;

                        });

                    });

                }

            }

        }]);

})(window.angular);