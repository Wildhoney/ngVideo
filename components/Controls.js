(function($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @directive ngVideoControls
     * @type {Function}
     */
    module.directive('viControls', ['ngVideoOptions', function ngVideoControlsDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Function}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @method play
                 * @return {void}
                 */
                $scope.play = function play() {
                    $scope.player.play();
                };

                /**
                 * @method pause
                 * @return {void}
                 */
                $scope.pause = function pause() {
                    $scope.player.pause();
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
    createControlDirective('play');
    createControlDirective('pause');

})(window.angular);