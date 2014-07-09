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
            mp4: 'http://www.w3schools.com/html/mov_bbb.mp4',
            ogg: 'http://www.w3schools.com/html/mov_bbb.ogg'
        };

        video.addSource('mp4', $scope.videos.mp4);

//        $timeout(function() {
//            video.addSource('ogg', $scope.videos.ogg);
//        }, 1);


        $scope.play = function() {

//            video.play();

        };

    });

})(window.angular);