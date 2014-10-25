(function Controls($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * List of actions that are available on the video player.
     *
     * @property actions
     * @type {String[]}
     */
    var actions = ['play', 'pause'];

    /**
     * @directive viControls
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    module.directive('viControls', ['ngVideoOptions',

    function ngControlsDirective(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @method play
                 * @return {void}
                 */
                $scope.play = function play() {
                    $scope.player.play();
                    $scope.$apply();
                };

                /**
                 * @method pause
                 * @return {void}
                 */
                $scope.pause = function pause() {
                    $scope.player.pause();
                    $scope.$apply();
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
    $angular.forEach(actions, function forEach(actionName) {
        createControlDirective(actionName);
    });

})(window.angular);