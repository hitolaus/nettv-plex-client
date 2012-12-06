function PlexAPI() {
    
	this.browse = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
        	if (xhr.readyState == 4) {
        		if (xhr.status == 200) {
                    callback(new MediaContainer(xhr.responseXML.firstChild));
        		}
            }
        };
    	xhr.open("GET", url, true);
    	xhr.send(null);
	};
	
	this.getURL = function(key, url) {
		if (key.indexOf('/') === 0) {
			return "http://"+Settings.getPMS()+":32400" + key;
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
		return "http://"+Settings.getPMS()+":32400/library/sections";
	};
    
    this.ping = function(address, callback) {
        var dummy = new Image();
        dummy.onload = function () {
            callback(true);
        };
        dummy.onerror = function () {
            callback(false);
        };
        // TODO: is /:/resources/movie-fanart.jpg always okay?
        dummy.src = 'http://'+address+':32400/:/resources/movie-fanart.jpg';
    };
    
    this.getScaledImageURL = function(url, width, height) {
        return "http://"+Settings.getPMS()+":32400/photo/:/transcode?width="+width+"&height="+height+"&url="+encodeURIComponent(url);
    };

}

// Register the API globally
window.plexAPI = new PlexAPI();	

