function UUID() {
    function S4() {
        /*jshint bitwise: false */
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        /*jshint bitwise: true */
    }

    this.generate = function () {
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    };
    this.simple = function () {
        return S4() + S4();
    };
}

window.UUID = new UUID();