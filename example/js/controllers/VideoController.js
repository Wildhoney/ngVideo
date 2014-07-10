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
         * @default true
         */
        $scope.playlistOpen = true;

        /**
         * @property videos
         * @type {Object}
         */
        $scope.videos = {
            first: 'http://www.w3schools.com/html/mov_bbb.mp4',
            second: 'http://techslides.com/demos/sample-videos/small.mp4'
        };

        /**
         * @method videoName
         * @param videoModel {Object}
         * @return {String}
         */
        $scope.videoName = function videoName(videoModel) {

            switch (videoModel.src) {
                case ($scope.videos.first): return "Bunny and Butterfly";
                case ($scope.videos.second): return "Lego Mechanics";
                default: return "Unknown Video";
            }

        };

        // Add some video sources for the player!
        video.addSource('mp4', $scope.videos.first);
        video.addSource('ogg', $scope.videos.second);

    });

})(window.angular);