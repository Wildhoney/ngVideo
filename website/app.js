/**
 * @module videoApp
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/ngVideo
 */
var videoApp = angular.module('videoApp', ['ngVideo']);

/**
 * @controller VideoController
 * @param $scope {Object}
 * @param video {Object}
 */
videoApp.controller('VideoController', function videoController($scope, video) {

    /**
     * @property playlistOpen
     * @type {Boolean}
     */
    $scope.playlistOpen = false;

    /**
     * @property videos
     * @type {Object}
     */
    $scope.videos = {
        first:  'https://www.w3schools.com/html/mov_bbb.mp4',
        second: 'https://www.w3schools.com/html/movie.mp4'
    };

    /**
     * @method playVideo
     * @param sourceUrl {String}
     * @return {void}
     */
    $scope.playVideo = function playVideo(sourceUrl) {
        video.addSource('mp4', sourceUrl, true);
    };

    /**
     * @method getVideoName
     * @param videoModel {Object}
     * @return {String}
     */
    $scope.getVideoName = function getVideoName(videoModel) {
        switch (videoModel.src) {
            case ($scope.videos.first): return "Big Buck Bunny";
            case ($scope.videos.second): return "The Bear";
            default: return "Unknown Video";
        }
    };

    // Add video sources for the player
    video.addSource('mp4', $scope.videos.first);
    video.addSource('mp4', $scope.videos.second);

});
