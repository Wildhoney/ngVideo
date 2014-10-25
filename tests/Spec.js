(function() {

    describe('ngVideo', function ngVideoTests() {

        beforeEach(module('ngVideo'));

        /**
         * @property directiveInterface
         * @type {Object}
         */
        var directiveInterface = {};

        /**
         * @method compileDirective
         * @param html {String}
         * @param [properties={}] {Object}
         * @return {Object}
         */
        var compileDirective = function compileDirective(html, properties) {

            var scope, document = '';

            inject(function inject($rootScope, $compile) {

                scope = $rootScope.$new();

                for (var property in properties || {}) {

                    if (properties.hasOwnProperty(property)) {
                        scope[property] = properties[property];
                    }

                }

                document = $compile(html)(scope);

            });

            return { scope: scope.$$childHead, html: document };

        };

        it('Should be able to attach the interface to the local object;', function() {

            var scope = compileDirective('<section ng-video ng-model="interface"></section>', {
                interface: directiveInterface
            }).scope;

            expect(scope.interface).toEqual(directiveInterface);
            expect(typeof scope.videoElement).toBe('object');
            expect(typeof scope.interface.controls.play).toEqual('function');
            expect(typeof scope.interface.controls.stop).toEqual('function');
            expect(typeof scope.interface.controls.pause).toEqual('function');

        });

        describe('Controls', function() {

            it('Should be able to play, pause and stop the video state;', function() {

                var scope = compileDirective('<section ng-video ng-model="interface"></section>', {
                    interface: directiveInterface
                }).scope;

                expect(scope.isPaused).toBeTruthy();
                expect(scope.videoElement.paused).toBeTruthy();
                directiveInterface.controls.play();
                expect(scope.isPaused).toBeFalsy();
                expect(scope.videoElement.paused).toBeFalsy();
                directiveInterface.controls.pause();
                expect(scope.isPaused).toBeTruthy();
                expect(scope.videoElement.paused).toBeTruthy();
                directiveInterface.controls.play();
                expect(scope.isPaused).toBeFalsy();
                expect(scope.videoElement.paused).toBeFalsy();
                directiveInterface.controls.stop();
                expect(scope.isPaused).toBeTruthy();
                expect(scope.videoElement.paused).toBeTruthy();

            });

            it('Should be able to play/pause the video depending on the current state;', function() {

                var scope = compileDirective('<section ng-video ng-model="interface"></section>', {
                    interface: directiveInterface
                }).scope;

                expect(scope.isPaused).toBeTruthy();
                directiveInterface.controls.playPause();
                expect(scope.isPaused).toBeFalsy();
                directiveInterface.controls.playPause();
                expect(scope.isPaused).toBeTruthy();

            });

        });

        describe('Sources', function() {

            it('Should be able to add and remove string sources;', function() {

                compileDirective('<section ng-video ng-model="interface"></section>', {
                    interface: directiveInterface
                });

                expect(directiveInterface.sources.all().length).toEqual(0);
                directiveInterface.sources.add('http://www.w3schools.com/html/mov_bbb.mp4');
                expect(directiveInterface.sources.all().length).toEqual(1);
                directiveInterface.sources.add('http://www.w3schools.com/html/movie.mp4');
                expect(directiveInterface.sources.all().length).toEqual(2);
                directiveInterface.sources.remove('http://www.w3schools.com/html/mov_bbb.mp4');
                expect(directiveInterface.sources.all().length).toEqual(1);
                directiveInterface.sources.clear();
                expect(directiveInterface.sources.all().length).toEqual(0);

            });

            it('Should be able to autoplay the added video source;', function() {

                var scope = compileDirective('<section ng-video ng-model="interface"></section>', {
                    interface: directiveInterface
                }).scope;

                expect(directiveInterface.options.isAutoplay()).toBeFalsy();
                directiveInterface.options.setAutoplay(true);
                expect(directiveInterface.options.isAutoplay()).toBeTruthy();
                expect(scope.video).toBeFalsy();
                expect(scope.isPaused).toBeTruthy();
                expect(scope.videoElement.paused).toBeTruthy();
                directiveInterface.sources.add('http://www.w3schools.com/html/movie.mp4');
                expect(scope.video).toEqual('http://www.w3schools.com/html/movie.mp4');
                expect(scope.isPaused).toBeFalsy();
                expect(scope.videoElement.paused).toBeFalsy();

                scope.$apply();
                expect(scope.videoElement.getAttribute('src')).toEqual('http://www.w3schools.com/html/movie.mp4');

            });

        });

    });

})();