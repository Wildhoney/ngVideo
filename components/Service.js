/**
 * @module ngVideo
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/ngVideo
 */
(function Service($angular) {

    "use strict";

    /**
     * @property module
     * @type {Object}
     */
    var module = $angular.module('ngVideo', []);

    /**
     * @constant ngVideoOptions
     * @type {Object}
     */
    module.constant('ngVideoOptions', {
        RESTRICT: 'CA',
        REFRESH: 50,
        SCREEN_DIRECTIVE: 'vi-screen',
        SCREEN_CHANGE: true,
        TIMELINE_CHANGE: true,
        VOLUME_STEPS: 0.1,
        VOLUME_MINIMUM: 0,
        VOLUME_MAXIMUM: 1,
        BUFFER_COLOUR: '#dd4b39',
        BUFFER_HEIGHT: 1,
        BUFFER_WIDTH: 485
    });

    /**
     * @value ngVideoPlaylist
     * @type {Object}
     */
    module.value('ngVideoPlaylist', []);

    /**
     * @service video
     * @type {Function}
     * @param $rootScope {Object}
     * @param $timeout {Function|Object}
     * @param ngVideoPlaylist {Array}
     */
    module.service('video', ['$rootScope', '$timeout', 'ngVideoPlaylist',

    function videoService($rootScope, $timeout, ngVideoPlaylist) {

        var service = {};

        /**
         * @property forceVideo
         * @type {String}
         */
        service.forceVideo = '';

        /**
         * @method addSource
         * @param type {String}
         * @param src {String}
         * @param immediatelyPlay {Boolean}
         * @return {Object}
         */
        service.addSource = function addSource(type, src, immediatelyPlay) {

            // Add a new video to the playlist, and broadcast the success.
            var model = { type: type, src: src };
            ngVideoPlaylist.push(model);

            $rootScope.$broadcast('ng-video/add', model);

            if (immediatelyPlay) {
                service.forceVideo = model;
            }

            return model;

        };

        /**
         * @method multiSource
         * @return {MultiSource}
         */
        service.multiSource = function multiSource() {

            /**
             * @class MultiSource
             * @constructor
             */
            function MultiSource() {}

            /**
             * @property prototype
             * @type {Object}
             */
            MultiSource.prototype = {

                /**
                 * @property sources
                 * @type {Array}
                 */
                sources: [],

                /**
                 * @method addSource
                 * @param type {String}
                 * @param src {String}
                 * @return {void}
                 */
                addSource: function addSource(type, src) {
                    this.sources.push({ type: type, src: src });
                },

                /**
                 * @method save
                 * @param immediatelyPlay {Boolean}
                 * @return {Object}
                 */
                save: function save(immediatelyPlay) {

                    ngVideoPlaylist.push(this.sources);
                    $rootScope.$broadcast('ng-video/add', this.sources);

                    if (immediatelyPlay) {
                        service.forceVideo = this.sources;
                    }

                    return this.sources;

                }

            };

            return new MultiSource();

        };

        /**
         * @method throwException
         * @param message {String}
         * @return {void}
         */
        service.throwException = function throwException(message) {
            throw 'ngVideo: ' + message + '.';
        };

        return service;

    }]);

})(window.angular);