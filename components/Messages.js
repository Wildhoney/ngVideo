(function Messages($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo');

    /**
     * @constant TYPE
     * @type {Object}
     */
    var TYPE = { ERROR: 1, INFORMATION: 2, GENERAL: 3 };

    /**
     * @constant ngVideoMessages
     * @type {Object}
     */
    module.constant('ngVideoMessages', {
        CAN_PLAY:         { ref: 1, text: 'Can Play', type: TYPE.INFORMATION, event: 'canplay' },
        CAN_PLAY_THROUGH: { ref: 2, text: 'Can Play Through', type: TYPE.INFORMATION, event: 'canplaythrough' },
        DURATION_CHANGE:  { ref: 3, text: 'Duration Change', type: TYPE.GENERAL, event: 'durationchange' },
        EMPTIED:          { ref: 4, text: 'Emptied', type: TYPE.INFORMATION, event: 'emptied' },
        ENDED:            { ref: 5, text: 'Ended', type: TYPE.INFORMATION, event: 'ended' },
        ERROR:            { ref: 6, text: 'Error', type: TYPE.ERROR, event: 'error' },
        LOADED_DATA:      { ref: 7, text: 'Loaded Data', type: TYPE.INFORMATION, event: 'loadeddata' },
        LOADED_META_DATA: { ref: 8, text: 'Loaded Meta Data', type: TYPE.INFORMATION, event: 'loadedmetadata' },
        LOAD_START:       { ref: 9, text: 'Looking', type: TYPE.INFORMATION, event: 'loadstart' },
        PAUSE:            { ref: 10, text: 'Pause', type: TYPE.GENERAL, event: 'pause' },
        PLAY:             { ref: 11, text: 'Play', type: TYPE.GENERAL, event: 'play' },
        PLAYING:          { ref: 12, text: 'Playing', type: TYPE.GENERAL, event: 'playing' },
        PROGRESS:         { ref: 13, text: 'Progress', type: TYPE.INFORMATION, event: 'progress' },
        RATE_CHANGE:      { ref: 14, text: 'Rate Change', type: TYPE.INFORMATION, event: 'ratechange' },
        SEEKED:           { ref: 15, text: 'Seeked', type: TYPE.INFORMATION, event: 'seeked' },
        SEEKING:          { ref: 16, text: 'Seeking', type: TYPE.INFORMATION, event: 'seeking' },
        STALLED:          { ref: 17, text: 'Stalled', type: TYPE.ERROR, event: 'stalled' },
        SUSPEND:          { ref: 18, text: 'Suspended', type: TYPE.ERROR, event: 'suspend' },
        TIME_UPDATE:      { ref: 19, text: 'Time Update', type: TYPE.GENERAL, event: 'timeupdate' },
        VOLUME_CHANGE:    { ref: 19, text: 'Volume Change', type: TYPE.GENERAL, event: 'volumechange' },
        WAITING:          { ref: 20, text: 'Waiting', type: TYPE.INFORMATION, event: 'waiting' }
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
            controller: ['$scope', function controller($scope) {

                /**
                 * @property messages
                 * @type {Array}
                 */
                $scope.messages = [];

                // Listen for the moment in which we can safely register the message events.
                $scope.$on('ng-video/attach-events', function registerMessageEvents(event, player) {

                    // Iterate over our messages to register their events.
                    $angular.forEach(ngVideoMessages, function forEach(messageModel) {

                        player.bind(messageModel.event, function eventTriggered() {

                            delete messageModel.$$hashKey;

                            // Create a copy to prevent duplicates.
                            messageModel = $angular.copy(messageModel);

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