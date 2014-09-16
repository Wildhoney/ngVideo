(function VideoController($angular) {

    /**
     * @module ngVideo
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngVideo
     * @controller VideoController
     * @param $scope {Object}
     */
    $angular.module(APP_NAME).controller('VideoController',

    function videoController($scope, $timeout, video) {

        /**
         * @property playlistOpen
         * @type {Boolean}
         * @default false
         */
        $scope.playlistOpen = false;

        /**
         * @property videos
         * @type {Object}
         */
        $scope.videos = {
            first:  'http://www.w3schools.com/html/mov_bbb.mp4',
            second: 'http://www.w3schools.com/html/movie.mp4'
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

        // Add some video sources for the player!
        video.addSource('mp4', $scope.videos.first);
        video.addSource('mp4', $scope.videos.second);

    });

})(window.angular);