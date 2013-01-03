function PlexAPI() {
    'use strict';
	this.browse = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    callback(new MediaContainer(xhr.responseXML.firstChild));
                }
                else {
                    // TODO: Proper error handling
                    console.log('ERROR(' + xhr.status + ') msg: ' + xhr.statusText);
                    callback(new MediaContainer());
                }
            }
        };
        xhr.onerror = function() {
            console.log('ERROR');
            callback(new MediaContainer());
        };
        xhr.open('GET', url, true);
        xhr.send(null);
	};

	this.getURL = function(key, url) {
		if (key.indexOf('/') === 0) {
			return 'http://'+Settings.getPMS()+':32400' + key;
		}
        else if (!url) {
            return this.sections() + '/' + key;
        }
		else {
			return url + '/' + key;
		}
	};
    this.onDeck = function(key) {
        return this.getURL(key) + '/onDeck';
    };
    this.recentlyAdded = function(key) {
        return this.getURL(key) + '/recentlyAdded';
    };
	this.sections = function() {
		return 'http://'+Settings.getPMS()+':32400/library/sections';
	};

    /**
     * Ping an address to see if it is an valid Plex Media Server.
     *
     * @param address {string} the ip address of the PMS
     * @param callback {function} function that called with the result. The callback takes
     *                            a boolean param that indicate if the address was valid.
     */
    this.ping = function(address, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if ( xhr.status === 200 ) {
                    callback(true);
                }
            }
        };
        xhr.onerror = function() {
            callback(false);
        };
        xhr.open('GET', 'http://'+address+':32400/library/sections', true);
        xhr.send(null);
    };

    this.progress = function(key, time, state) {
        var url = 'http://'+Settings.getPMS()+':32400/:/progress?key='+key+'&identifier=com.plexapp.plugins.library&time='+time+'&state='+state;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send(null);
    };
    this.watched = function(key) {
        var url = 'http://'+Settings.getPMS()+':32400/:/scrobble?key='+key+'&identifier=com.plexapp.plugins.library';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send(null);
    };
    this.unwatched = function(key) {
        var url = 'http://'+Settings.getPMS()+':32400/:/unscrobble?key='+key+'&identifier=com.plexapp.plugins.library';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send(null);
    };

    this.getScaledImageURL = function(url, width, height) {
        return 'http://'+Settings.getPMS()+':32400/photo/:/transcode?width='+width+'&height='+height+'&url='+encodeURIComponent(url);
    };

}

// Register the API globally
window.plexAPI = new PlexAPI();

