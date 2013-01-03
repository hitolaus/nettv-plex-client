(function() {
    describe('String', function() {

        describe('#encodeHTML()', function(){
            it('should HTML encode valid string', function() {
                expect('foo & bar'.encodeHTML()).to.equal('foo &amp; bar');
                expect('foo > bar'.encodeHTML()).to.equal('foo &gt; bar');
                expect('foo < bar'.encodeHTML()).to.equal('foo &lt; bar');
            });
        });
    });
})();