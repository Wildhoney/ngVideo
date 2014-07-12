(function($angular) {

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
    module.directive('viMessages', ['ngVideoOptions', 'ngVideoMessages',

        function ngMessagesDirective(ngVideoOptions, ngVideoMessages) {

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
                controller: ['$scope', function controller($scope) {

                    /**
                     * @property messages
                     * @type {Array}
                     */
                    $scope.messages = [];

                }],

                link: function link(scope) {

                    console.log(scope.player);

                    // Iterate over our messages to register their events.
                    $angular.forEach(ngVideoMessages, function forEach(messageModel) {

                        scope.player[messageModel.event] = function eventTriggered() {

                            // Push the message model into our messages array when it has been
                            // triggered by the player.
                            scope.messages.push(messageModel);

                        };

                    });

                }

            }

        }]);

})(window.angular);