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