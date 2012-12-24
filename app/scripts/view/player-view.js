/*global Popcorn,video */
function PlayerView(uri, useViewOffset) {
	var scope = this;

    var player = document.getElementById('player');
	var controls = document.getElementById('controls');
    var message = document.getElementById('player-message');
    var status = document.getElementById('player-status-message');

    var totalDuration = 0;
    var durationIndex = 0;

    var loading = false;
    var startViewOffset = null;

    var CONTROLS_TIMEOUT = 5000;
    var controlsTimer;

    function showControls(msg, timeout) {
        controls.style.bottom = 0;
        status.innerHTML = msg;

        if (timeout) {
            clearTimeout(controlsTimer);
            controlsTimer = setTimeout(hideControls, timeout);
        }
    }
    function hideControls() {
        controls.style.bottom = -controls.offsetHeight + 'px';
    }

    function showPlayer () {
        player.style.display = 'block';
        player.style.top = '0';
    }
    function closePlayer() {
        video.stop();
        window.view = new HomeView();
        window.view.reload();

        player.style.display = 'none';
    }

    function readyHandler() {
        loading = false;
        document.getElementById('video-loading').style.display = 'none';

        setDuration();

        if (startViewOffset) {
            doSkip(startViewOffset);
            startViewOffset = null;
        }
    }

    function setDuration() {
        totalDuration = Math.floor(video.playTime/1000);
        durationIndex = 1200/totalDuration;

        document.getElementById('total-duration').innerHTML = Time.format(totalDuration);
    }

    function checkPlayState() {
        switch (video.playState)
        {
            case 5: // finished
                closePlayer();
                break;
            case 0: // stopped
                message.innerHTML = 'Stopped';
                break;
            case 6: // error
                message.innerHTML = 'Error';
                // TODO: Error message for the enduser
                closePlayer();
                break;
            case 1: // playing
                if (loading) {
                    readyHandler();
                }
                message.innerHTML = 'Playing';
                break;
            case 2: // paused
                message.innerHTML = 'Paused';
                break;
            case 3: // connecting
                message.innerHTML = 'Connecting';
                break;
            case 4: // buffering
                message.innerHTML = 'Buffering';
                showControls('BUFFERING', CONTROLS_TIMEOUT);
                break;
            default:
                // do nothing
                break;
        }
    }

    function updateElapsedTime() {
        var ct = video.playPosition/1000;
        document.getElementById('duration').innerHTML = Time.format(ct);

        var sliceTime = Math.round(ct * durationIndex);
        document.getElementById('progressbar-front').style.width = sliceTime+'px';
    }

    /**
     * Toggle the player state between playing and paused.
     */
    function togglePause() {
        if (loading) {
            return;
        }

        if (parseInt(controls.style.bottom,10) === 0) {
            video.play(1);
            hideControls();
        }
        else {
            video.play(0);
            showControls('PAUSED');
        }
    }

    /**
     * Skips x seconds in the video stream. If the amount to skip is outside the video
     * bounds the request is ignored.
     *
     * @param {Number} time the time to skip in seconds
     */
    function doSkip(time) {
        if (loading) {
            return;
        }

        showControls('', CONTROLS_TIMEOUT);

        // Get the total time in milliseconds
        var totalTime = video.playPosition + (time * 1000);

        if (totalTime < video.playTime && totalTime > 0) {
            video.seek(totalTime);
        }
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
    this.onPlay = function () {
        togglePause();
    };
	this.onBack = function () {
        closePlayer();
	};
    this.onStop = function () {
        closePlayer();
    };
	this.render = function (container) {
		var media = container.media[0];

        loading = true;
        document.getElementById('video-loading').style.display = 'block';

        showPlayer();

		var url = plexAPI.getURL(media.url);


		video.data = url;
        if (media.mimeType) {
            video.type = media.mimeType;
        }
        video.play(1);


        // Update process bar every 2 seconds
        setInterval(updateElapsedTime, 2000);

        if (useViewOffset && media.viewOffset) {
            // Save the offset so we can set if when the video is loaded
            startViewOffset = media.viewOffset;
        }

        document.getElementById('description').innerHTML = media.summary;
        document.getElementById('title').innerHTML = media.title;

		// Load subtitles
		if (media.subtitles) {
            console.log('Loading subtitle ' + media.subtitles + '...');
			var p =  new Popcorn( 'video' )
                        .parseSRT(plexAPI.getURL(media.subtitles))
                        .play();
		}
	};

    video.onPlayStateChange=checkPlayState;

	plexAPI.browse(uri, function(container) {
		scope.render(container);
	});
}