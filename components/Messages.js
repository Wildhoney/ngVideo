(function Messages($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @constant TYPE
     * @type {{ERROR: number, INFORMATION: number}}
     */
    var TYPE = { ERROR: 1, INFORMATION: 2 };

    /**
     * @constant ngVideoMessages
     * @type {Object}
     */
    module.constant('ngVideoMessages', {
        HAS_STALLED:    { ref: 1, text: 'Stalled', type: TYPE.ERROR, event: 'stalled' },
        HAS_SEEKED:     { ref: 2, text: 'Seeked', type: TYPE.INFORMATION, event: 'seeked' },
        IS_SEEKING:     { ref: 3, text: 'Seeking', type: TYPE.INFORMATION, event: 'seeking' },
        HAS_SUSPENDED:  { ref: 4, text: 'Suspended', type: TYPE.ERROR, event: 'suspended' },
        IS_LOOKING:     { ref: 5, text: 'Looking', type: TYPE.INFORMATION, event: 'loadstart' }
    });

    /**
     * @directive viMessages
     * @type {Function}
     * @param ngVideoOptions {Object}
     * @param ngVideoMessages {Object}
     */
    module.directive('viMessages', ['$window', 'ngVideoOptions', 'ngVideoMessages',

        function ngMessagesDirective($window, ngVideoOptions, ngVideoMessages) {

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
                controller: ['$scope', '$timeout', function controller($scope, $timeout) {

                    /**
                     * @property messages
                     * @type {Array}
                     */
                    $scope.messages = [];

                    // Listen for the moment in which we can safely register the message events.
                    $scope.$on('ng-video/message/events', function registerMessageEvents(event, player) {

                        // Iterate over our messages to register their events.
                        $angular.forEach(ngVideoMessages, function forEach(messageModel) {

                            player.bind(messageModel.event, function eventTriggered() {

                                delete messageModel.$$hashKey;

                                // Push the message model into our messages array when it has been
                                // triggered by the player.
                                messageModel.date = new $window.Date();
                                $scope.messages.push(messageModel);
                                $scope.$apply();

                            });

                        });

                    });

                }]

            }

        }]);

})(window.angular);