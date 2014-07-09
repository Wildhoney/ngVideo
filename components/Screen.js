(function($angular) {

    "use strict";

    /**
     * @directive viScreen
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viScreen', ['ngVideoOptions',

    function ngScreenDirective(ngVideoOptions) {

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
            controller: ['$scope', '$interpolate', function controller($scope, $interpolate) {

                /**
                 * @method fetchHtml
                 * @param video {Object}
                 * @return {String}
                 */
                $scope.fetchHtml = function fetchHtml(video) {
                    return $interpolate($scope.SOURCE_HTML)(video);
                };

            }],

            /**
             * @method link
             * @return {void}
             */
            link: function link(scope, element) {

                element.append(scope.fetchHtml(scope.video));

            }

        }

    }]);

})(window.angular);