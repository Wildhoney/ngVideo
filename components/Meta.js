(function Meta($angular) {

    "use strict";

    /**
     * @directive viMeta
     * @type {Function}
     * @param ngVideoOptions {Object}
     */
    $angular.module('ngVideo').directive('viMeta', ['$window', 'ngVideoOptions',

    function ngMetaDirective($window, ngVideoOptions) {

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
             * @property require
             * @type {String}
             */
            require: 'ngModel',

            /**
             * @property controller
             * @type {Array}
             * @param $scope {Object}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property duration
                 * @type {Number}
                 * @default 0
                 */
                $scope.duration = 0;

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @param attr {Object}
             * @param ngModel {Object}
             * @return {void}
             */
            link: function link(scope, element, attr, ngModel) {

                // Create the video node for reading the meta data.
                scope.player = $window.document.createElement('video');
                var video    = $angular.element(scope.player);

                // Prevent the preloading of the video content to save bandwidth.
                scope.player.setAttribute('preload', false);

                // Once the meta data for the video has been retrieved.
                video.bind('loadedmetadata', function onLoadedMetaData() {

                    // Read in the meta values.
                    scope.duration = scope.player.duration;
                    scope.$apply();

                    delete scope.player;

                });

                scope.$watch(function watchProperty() {

                    // Watch the ngModel and react once it updates.
                    return ngModel.$modelValue;

                }, function valueChanged(videoModel) {

                    scope.player.setAttribute('src', videoModel.src);
                    scope.player.load();

                });

            }

        }

    }]);

})(window.angular);