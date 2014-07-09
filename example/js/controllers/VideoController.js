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
         * @property videos
         * @type {Object}
         */
        $scope.videos = {
            first: 'http://www.w3schools.com/html/mov_bbb.mp4',
            second: 'http://techslides.com/demos/sample-videos/small.mp4'
        };

        video.addSource('mp4', $scope.videos.first);

        $timeout(function() {
            video.addSource('ogg', $scope.videos.second);
        }, 1);

    });

})(window.angular);