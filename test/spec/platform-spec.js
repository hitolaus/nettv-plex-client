/*global Platform */
(function() {
    describe('Platform', function() {

        var nettvPlatform, webkitPlatform;

        before(function () {
            nettvPlatform = new Platform({
                userAgent: 'Opera/9.80 (Linux mips; U; CE-HTML/1.0 NETTV/3.1.0 HbbTV/1.1.1 (;;;;;); en) Presto/2.6.33 Version/10.70'
            });
            webkitPlatform = new Platform({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.27+ (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27'
            });
        });

        describe('#isTransitionSupported()', function(){
            it('should not support transition on NetTV', function() {
                expect(nettvPlatform.isTransitionSupported()).to.equal(false);
            });
        });

        describe('#addTransition()', function(){
            it('should not add transition if not supported', function() {

                var elem = document.createElement('div');

                nettvPlatform.addTransition(elem, '500ms', 'bottom');

                expect(elem.style.oTranstion).to.equal(undefined);
            });
            it('should add transition on WebKit', function() {

                var elem = document.createElement('div');

                webkitPlatform.addTransition(elem, '500ms', 'bottom');

                expect(elem.style.webkitTransition).to.equal('bottom 500ms ease');
            });
        });
    });
})();