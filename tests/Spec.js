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
            expect(typeof scope.video).toBe('object');
            expect(typeof scope.interface.controls.play).toEqual('function');
            expect(typeof scope.interface.controls.stop).toEqual('function');
            expect(typeof scope.interface.controls.pause).toEqual('function');

        });

        it('Should be able to play, pause and stop the video state;', function() {

            var scope = compileDirective('<section ng-video ng-model="interface"></section>', {
                interface: directiveInterface
            }).scope;

            expect(scope.isPaused).toBeTruthy();
            expect(scope.video.paused).toBeTruthy();
            directiveInterface.controls.play();
            expect(scope.isPaused).toBeFalsy();
            expect(scope.video.paused).toBeFalsy();
            directiveInterface.controls.pause();
            expect(scope.isPaused).toBeTruthy();
            expect(scope.video.paused).toBeTruthy();
            directiveInterface.controls.play();
            expect(scope.isPaused).toBeFalsy();
            expect(scope.video.paused).toBeFalsy();
            directiveInterface.controls.stop();
            expect(scope.isPaused).toBeTruthy();
            expect(scope.video.paused).toBeTruthy();

        });

    });

})();