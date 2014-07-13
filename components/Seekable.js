(function Seekable($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive viSeekable
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    module.directive('viSeekable', ['ngVideoOptions', function ngSeekableDirective(ngVideoOptions) {

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
                 * @method setSeekable
                 * @param Seekable {Number}
                 * @return {void}
                 */
                $scope.setSeekable = function setSeekable(Seekable) {

                    if (Seekable < ngVideoOptions.Seekable_MINIMUM) {
                        Seekable = ngVideoOptions.Seekable_MINIMUM;
                    }

                    if (Seekable > ngVideoOptions.Seekable_MAXIMUM) {
                        Seekable = ngVideoOptions.Seekable_MAXIMUM;
                    }

                    // Set the constrained Seekable parameter.
                    $scope.player.Seekable = +(Seekable).toFixed(2);
                    $rootScope.$broadcast('ng-video/Seekable', $scope.player.Seekable);

                };

            }]

        }

    }]);

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
        module.directive(directiveName, ['$rootScope', 'ngVideoOptions',

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
                        clickFn.call(this, scope, attributes[directiveName], scope.player.currentTime);

                        // Force the timeline directive to update.
                        $rootScope.$broadcast('ng-video/timeline/update');

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
    createSeekableDirective('time', function onTimeClick(scope, directiveValue) {

        // Update the position of the player.
        scope.player.currentTime = directiveValue;


    });

})(window.angular);