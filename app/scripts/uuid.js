 function UUID () {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    this.generate = function() {
         return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
    };
    this.simple = function() {
        return S4() + S4();
    };
}

window.UUID = new UUID();