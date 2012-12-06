function Settings() {
    var _pms = null;
    
    function getCookie(c_name) {
        var x,y,ARRcookies=document.cookie.split(";");
        var n = ARRcookies.length;
        for (var i = 0; i < n; i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }
    function setCookie(c_name,value,exdays) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }
    
	this.init = function() {
		_pms = getCookie("nettv_plex_pms_ip");
		return _pms != null;
	},
	this.setPMS = function(pms) {
		setCookie("nettv_plex_pms_ip", pms, 3600);
		_pms = pms;
	},
	this.getPMS = function() {
		return _pms;
	}
}

window.Settings = new Settings();
