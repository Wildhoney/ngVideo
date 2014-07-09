(function($angular) {

    "use strict";

    $angular.module('ngVideo').directive('ngVideoScreen', function ngVideoDirectiveScreen() {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'CA',

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

    });

})(window.angular);