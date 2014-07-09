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
     * @property directiveControlsName
     * @type {String}
     */
    var directiveControlsName = 'viControlsItem';

    /**
     * @directive ngVideoControlsButton
     * @type {Function}
     */
    module.directive(directiveControlsName, ['video', 'ngVideoOptions',

        function viControlsItem(video, ngVideoOptions) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: ngVideoOptions.RESTRICT,

                /**
                 * @method link
                 * @return {void}
                 */
                link: function link(scope, element, attrs) {

                    // Discover the type of the control.
                    var type = attrs[directiveControlsName];

                    // Ensure the control type is currently supported.
                    if (typeof scope[type] !== 'function') {
                        video.throwException("Control type '" + type + "' is unsupported");
                    }

                    element.bind('click', scope[type]);

                }

            }

        }]);

})(window.angular);