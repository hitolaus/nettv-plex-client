function Time() {
    function pad(s) {
        s += '';
        if (s.length < 2) {
            s = '0' + s;
        }
        return s;
    }

    this.format = function(t) {
        t = Math.round(t);
        var timeInMin = Math.floor(t / 60);
        
        var s = t % 60;
        var m = timeInMin % 60;
        var h = Math.floor(timeInMin / 60);
  
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    };

    this.to12HourFormat = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;

        return hours + ':' + minutes + ' ' + ampm;
    };
}

window.Time = new Time();