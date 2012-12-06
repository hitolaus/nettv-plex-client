function PlayerView(uri) {
	var scope = this;
	
    var player = document.getElementById('player');
    var video = document.getElementById('video');
	var controls = document.getElementById('controls');
    
    var totalDuration = 0;
    var durationIndex = 0;
    
    var loading = false;
    
    var CONTROLS_TIMEOUT = 5000;
    var controlsTimer;
    
    function showControls() {
        controls.style.bottom = 0;
    }
    function hideControls() {
        controls.style.bottom = -controls.offsetHeight + 'px';
    }
     
    function closePlayer() {
        video.pause();
        window.view = new HomeView();
        window.view.reload();
        
        player.style.display = 'none';
    }
     
    function durationChangeHandler() {
    	totalDuration = video.duration;
    	durationIndex = 1200/totalDuration;
        
    	document.getElementById('total-duration').innerHTML = Time.format(totalDuration);
    }
    function timeUpdateHandler() {
        var ct = video.currentTime;
        document.getElementById('duration').innerHTML = Time.format(ct);
        
        var sliceTime = Math.round(ct * durationIndex);
        document.getElementById('progressbar-front').style.width = sliceTime+"px"; 
    }
    function errorHandler() {
        loading = false;
        console.log('ERROR');
    }
	function finishedHandler() {
        closePlayer();
	}
    function readyHandler() {
        loading = false;
        document.getElementById('video-loading').style.display = 'none';
    }
    
    function togglePause() {
        if (loading) return;
        
        if (parseInt(controls.style.bottom,10) === 0) {
            video.play();
            hideControls();
        }
        else {
            video.pause();
            showControls();
        }
    }
    function doSkip(time) {
        if (loading) return;
        
        clearTimeout(controlsTimer);
        showControls();
    	
        var ct = video.currentTime;
    	if (( (ct + time) < video.duration) && ((ct + time) > 0)) {
    		video.currentTime += time; 
    	}
        
        controlsTimer = setTimeout(hideControls, CONTROLS_TIMEOUT);
    }
     
	this.onUp = function () {
	};
	this.onDown = function () {
	};
	this.onLeft = function () {
        doSkip(-60.0);
	};
	this.onRight = function () {
        doSkip(60.0);
	};
	this.onEnter = function () {
        togglePause();   
	};
	this.onBack = function () {
        closePlayer();
	};
	this.render = function (container) {
		var media = container.media[0];
		
        loading = true;
        document.getElementById('video-loading').style.display = 'block';
        
        player.style.display = 'block';
        
		var url = plexAPI.getURL(media.url);
        
		video.src = url;
        video.play();
        
        document.getElementById('description').innerHTML = media.summary;
        document.getElementById('title').innerHTML = media.title;
        
		// Load subtitles
		if (media.subtitles) {
			var p = Popcorn( "video" )
					.parseSRT(plexAPI.getURL(media.subtitles))
					.play();
		}
	};
	
	plexAPI.browse(uri, function(container) {
		scope.render(container);
	});
    
    video.addEventListener("loadeddata", readyHandler, true);
    video.addEventListener("ended", finishedHandler, true);
    video.addEventListener("error", errorHandler, true);
    video.addEventListener("timeupdate", timeUpdateHandler, true);
	video.addEventListener("durationchange", durationChangeHandler, true);
}