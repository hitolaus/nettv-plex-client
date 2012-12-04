function Time() {
    function pad(s) {
    	s += "";
    	if (s.length < 2) 
    		s = "0" + s;
	
    	return s;
    }
    
    this.format = function(t) {
        t = Math.round(t);
        var timeInMin = Math.floor(t / 60);
        
        var s = t % 60;
        var m = timeInMin % 60;
        var h = Math.floor(timeInMin / 60);
  
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    }
};

window.Time = new Time();