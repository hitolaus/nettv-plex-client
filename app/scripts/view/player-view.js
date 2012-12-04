function PlayerView(uri) {
	var scope = this;
	
    var player = document.getElementById('player');
    var video = document.getElementById('video');
	var controls = document.getElementById('controls');
    
    var totalDuration = 0;
    var durationIndex = 0;
    
    var CONTROLS_TIMEOUT = 5000;
    var controlsTimer;
    
    function showControls() {
        controls.style.bottom = 0;
    }
    function hideControls() {
        controls.style.bottom = -controls.offsetHeight + 'px';
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
     
    function togglePause() {
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
        video.pause();
        window.view = new HomeView();
        window.view.reload();
        
        player.style.display = 'none';
	};
	this.render = function (container) {
		var media = container.media[0];
		
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
    
    video.addEventListener("timeupdate", timeUpdateHandler, true);
	video.addEventListener("durationchange", durationChangeHandler, true);
}