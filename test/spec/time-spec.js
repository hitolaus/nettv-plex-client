(function() {
    describe('Time', function() {

        describe('#format()', function(){
            it('should format all time components', function() {
                expect(Time.format(3661)).to.equal('01:01:01');
            });
            it('should format zero', function() {
                expect(Time.format(0)).to.equal('00:00:00');
            });
        });

        describe('#to12HourFormat()', function(){
            it('should format AM time', function() {
                var date = new Date();
                date.setHours(11);
                date.setMinutes(0);

                expect(Time.to12HourFormat(date)).to.equal('11:00 AM');
            });
            it('should format PM time', function() {
                var date = new Date();
                date.setHours(23);
                date.setMinutes(0);

                expect(Time.to12HourFormat(date)).to.equal('11:00 PM');
            });
        });
    });
})();