function Settings() {
    var _pms = null;
    var _debug = false;
    var _deviceId = 'nettv-plex-default';
    var _anim = true;

    function getCookie(name) {
        var x,y,ARRcookies=document.cookie.split(';');
        var n = ARRcookies.length;
        for (var i = 0; i < n; i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
            x=x.replace(/^\s+|\s+$/g,'');
            if (x === name) {
                return unescape(y);
            }
        }
    }
    function setCookie(name,value,exdays) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        value = escape(value) + ((exdays===null) ? '' : '; expires='+exdate.toUTCString());
        document.cookie = name + '=' + value;
    }

    function deleteCookie(name) {
        setCookie(name, '', -1);
    }

    function activateDebug(id) {
        var g=document.createElement('script');
        var s=document.getElementsByTagName('script')[0];
        g.src='http://jsconsole.com/remote.js?'+id;
        s.parentNode.insertBefore(g,s);
    }

    this.init = function() {
        _pms = getCookie('nettv_plex_pms_ip');
        _debug = getCookie('nettv_plex_debug') === 'true';
        _deviceId = getCookie('nettv_plex_device_id');
        _anim = getCookie('nettv_plex_disable_anim') !== 'true';

        if (_deviceId === undefined) {
            _deviceId = 'nettv-plex-' + UUID.simple();
            setCookie('nettv_plex_device_id', _deviceId, 3600);
        }

        if (_debug) {
            activateDebug(_deviceId);
        }

        console.log('Using PMS: ' + _pms);
        return _pms !== null && _pms !== undefined;
    };
    this.reset = function() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            deleteCookie(cookies[i].split('=')[0]);
        }
    };

    this.setPMS = function(pms) {
        setCookie('nettv_plex_pms_ip', pms, 3600);
        _pms = pms;
    };
    this.getPMS = function() {
		return _pms;
    };

    this.getDebug = function () {
        return _debug;
    };
    this.getDeviceId = function () {
        return _deviceId;
    };
    this.setDebug = function(debug) {
        setCookie('nettv_plex_debug', debug, 3600);
        _debug = debug;
    };

    this.setAnim = function(anim) {
        setCookie('nettv_plex_disable_anim', !anim, 3600);
        _anim = anim;
    };

    this.useAnim = function() {
        return _anim;
    };
}

window.Settings = new Settings();
