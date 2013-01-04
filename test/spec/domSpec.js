(function() {
    describe('DOM', function() {
        var elem;

        beforeEach(function() {
            elem = document.createElement('div');
            elem.className = 'test-class';
        });

        describe('#hasClass()', function(){
            it('should return true if the class exists', function() {
                expect(DOM.hasClass(elem, 'test-class')).to.equal(true);
            });
            it('should return false if the class doesnt exists', function() {
                expect(DOM.hasClass(elem, 'test-class2')).to.equal(false);
            });
        });
        describe('#addClass()', function(){
            it('should add a new class and not delete the old ones', function() {
                DOM.addClass(elem, 'test-class2');

                expect(DOM.hasClass(elem, 'test-class')).to.equal(true);
                expect(DOM.hasClass(elem, 'test-class2')).to.equal(true);
            });
        });
        describe('#removeClass()', function(){
            it('should remove only the specified class', function() {
                // Make sure that we have two classes
                DOM.addClass(elem, 'test-class2');

                // Execute the function under test
                DOM.removeClass(elem, 'test-class');

                expect(DOM.hasClass(elem, 'test-class')).to.equal(false);
                expect(DOM.hasClass(elem, 'test-class2')).to.equal(true);
            });
        });
    });
})();
