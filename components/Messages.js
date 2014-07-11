(function($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo', []);

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
        HAS_STALLED:    { ref: 1, text: 'Stalled', type: TYPE.ERROR },
        HAS_SEEKED:     { ref: 2, text: 'Seeked', type: TYPE.INFORMATION },
        IS_SEEKING:     { ref: 3, text: 'Seeking', type: TYPE.INFORMATION },
        HAS_SUSPENDED:  { ref: 4, text: 'Suspended', type: TYPE.ERROR }
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
                scope: true

            }

        }]);

})(window.angular);