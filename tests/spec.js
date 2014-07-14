describe('ngVideo', function() {

    beforeEach(module('ngVideo'));

    var $scope, $childScope;

    beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();
    }));

    var createDirective = function createDirective(template) {

        inject(function($compile) {

            // Compile the directive, and find its child scope, if defined.
            $compile(template)($scope);
            $childScope = $scope.$$childHead;

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
            expect($childScope.player).toBeDefined();
            expect($childScope.player instanceof Object);
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
            expect($childScope.player.getAttribute('src')).toEqual('http://www.w3schools.com/html/mov_bbb.mp4');
            expect($childScope.player.paused).toBeTruthy();

            // Play the video.
            $childScope.player.play();
            angular.element($childScope.player).triggerHandler('play');
            expect($childScope.player.paused).toBeFalsy();
            $childScope.$apply();
            expect($childScope.playing).toBeTruthy();

            // Pause the video.
            $childScope.player.pause();
            angular.element($childScope.player).triggerHandler('pause');
            expect($childScope.player.paused).toBeTruthy();
            $childScope.$apply();
            expect($childScope.playing).toBeFalsy();

            // Toggle the video state.
            spyOn($childScope.player, 'play');
            $childScope.toggleState();
            angular.element($childScope.player).triggerHandler('play');
            expect($childScope.player.play).toHaveBeenCalled();

            // Toggle the video state.
            spyOn($childScope.player, 'pause');
            $childScope.toggleState();
            expect($childScope.player.pause).toHaveBeenCalled();

        }));

        it('Should be able to open in full-screen;', inject(function($rootScope) {
            createDirective(html);
            spyOn($childScope.container, 'mozRequestFullScreen');
            $childScope.openFullScreen();
            expect($childScope.container.mozRequestFullScreen).toHaveBeenCalled();
        }));

    });

});