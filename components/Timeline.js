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

                });

            }

        }

    }]);

})(window.angular);