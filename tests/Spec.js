describe('ngVideo', function() {

    beforeEach(module('ngVideo'));

    var $rootScope, $scope, $firstChildScope, $secondChildScope, $directive;

    beforeEach(inject(function(_$rootScope_) {
        $rootScope = _$rootScope_;
        $scope     = _$rootScope_.$new();
    }));

    var playVideo = function playVideo() {

        inject(function($rootScope, video) {
            video.addSource('mp4', 'http://www.w3schools.com/html/mov_bbb.mp4');
            $rootScope.$apply();
        });

    };

    var createDirective = function createDirective(template, shouldWrap) {

        if (shouldWrap) {
            template = '<section ng-video><video vi-screen></video>' + template + '</section>';
        }

        inject(function($compile) {

            // Compile the directive, and find its child scope, if defined.
            $directive        = $compile(template)($scope);
            $firstChildScope  = $scope.$$childHead;
            $secondChildScope = $firstChildScope.$$childHead;

        });

    };

    describe('Bootstrap', function() {

        var html = '<section ng-video><video vi-screen></video></section>';

        it('Should be able to ensure `ng-video-screen` directive exists;', function() {
            expect(function() {
                createDirective('<div ng-video></div>');
            }).toThrow('ngVideo: Must add ng-video-screen directive.');
        });

        it('Should be able to define the video element;', function() {
            createDirective(html);
            expect($firstChildScope.player).toBeDefined();
            expect($firstChildScope.player instanceof Object);
        });

        it('Should be able to broadcast `attach-events`;', inject(function($rootScope) {
            spyOn($rootScope, '$broadcast');
            createDirective(html);
            expect($rootScope.$broadcast).toHaveBeenCalled();
        }));

        it('Should be able to play a video and modify its state;', inject(function($rootScope, ngVideoPlaylist, video) {

            createDirective(html);
            expect(ngVideoPlaylist.length).toEqual(0);
            video.addSource('mp4', 'http://www.w3schools.com/html/mov_bbb.mp4');
            expect(ngVideoPlaylist.length).toEqual(1);
            $rootScope.$apply();
            expect($firstChildScope.player.getAttribute('src')).toEqual('http://www.w3schools.com/html/mov_bbb.mp4');
            expect($firstChildScope.player.paused).toBeTruthy();

            // Play the video.
            $firstChildScope.player.play();
            angular.element($firstChildScope.player).triggerHandler('play');
            expect($firstChildScope.player.paused).toBeFalsy();
            $firstChildScope.$apply();
            expect($firstChildScope.playing).toBeTruthy();

            // Pause the video.
            $firstChildScope.player.pause();
            angular.element($firstChildScope.player).triggerHandler('pause');
            expect($firstChildScope.player.paused).toBeTruthy();
            $firstChildScope.$apply();
            expect($firstChildScope.playing).toBeFalsy();

            // Toggle the video state.
            spyOn($firstChildScope.player, 'play');
            $firstChildScope.toggleState();
            angular.element($firstChildScope.player).triggerHandler('play');
            expect($firstChildScope.player.play).toHaveBeenCalled();

            // Toggle the video state.
            spyOn($firstChildScope.player, 'pause');
            $firstChildScope.toggleState();
            expect($firstChildScope.player.pause).toHaveBeenCalled();

        }));

        it('Should be able to open in full-screen;', inject(function($rootScope) {
            createDirective(html);
            spyOn($firstChildScope.container, 'mozRequestFullScreen');
            $firstChildScope.openFullScreen();
            expect($firstChildScope.container.mozRequestFullScreen).toHaveBeenCalled();
        }));

    });

    describe('Buffer', function() {

        var html = '<section ng-video><video vi-screen></video><div vi-buffer></div></section>';

        it('Should be able to define the dimensions of the canvas;', inject(function(ngVideoOptions) {

            ngVideoOptions.BUFFER_HEIGHT = 100;
            ngVideoOptions.BUFFER_WIDTH = 100;

            createDirective(html);
            expect($secondChildScope.height).toEqual(100);
            expect($secondChildScope.width).toEqual(100);
            expect($directive.find('canvas').length).toEqual(1);

        }));

        it('Should be able to listen to the `lastUpdate` property;', function() {

            spyOn($rootScope, '$watch').andCallThrough();
            createDirective(html);
            $scope.$apply();
            expect($rootScope.$watch).toHaveBeenCalled();

        });

    });

    describe('Controls', function() {

        var html = '<div vi-controls><a vi-controls-play>Play</a><a vi-controls-pause>Pause</a></div>';

        it('Should be able to play the video;', function() {

            createDirective(html, true);
            playVideo();

            spyOn($firstChildScope.player, 'play');
            spyOn($firstChildScope.player, 'pause');

            var playButton = angular.element($directive.find('a')[0]);
            playButton.triggerHandler('click');
            expect($firstChildScope.player.play).toHaveBeenCalled();
            expect($firstChildScope.player.pause).not.toHaveBeenCalled();

            var pauseButton = angular.element($directive.find('a')[1]);
            pauseButton.triggerHandler('click');
            expect($firstChildScope.player.pause).toHaveBeenCalled();

        });

    });

    describe('Feedback', function() {

        var html = '<div vi-feedback></div>';

        it('Should be able to retrieve details about the video;', function(done) {

            createDirective(html, true);
            playVideo();

            inject(function($rootScope, $timeout) {

                var lastUpdate = $secondChildScope.lastUpdate;
                expect($secondChildScope.lastUpdate).not.toEqual(0);

                $rootScope.$broadcast('ng-video/feedback/refresh');
                $rootScope.$digest();

                $timeout(function() {

                    expect($secondChildScope.lastUpdate).not.toEqual(0);
                    expect($secondChildScope.lastUpdate).not.toEqual(lastUpdate);
                    done();

                }, 1000);

            });

        });


    });

});