/**
 * The player view.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {string} uri The PLex API address of the video meta data.
 * @param {boolean} useViewOffset If <code>true</code> the view offset will be used.
 */
/*global Popcorn,video */
function PlayerView(uri, useViewOffset) {
	var scope = this;

    // Preload the element lookups
    var player = document.getElementById('player');
	var controls = document.getElementById('controls');
    var status = document.getElementById('player-status-message');
    var loadingMessage = document.getElementById('video-loading-message"');

    var totalDuration = 0;
    var durationIndex = 0;

    var loading = false;
    var startViewOffset = null;

    var CONTROLS_TIMEOUT = 5000;
    var controlsTimer;
    var processTimer;

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
        // Initially the player is offscreen due to the loading hack, so we need to move it back
        player.style.top = '0';
    }
    function closePlayer() {
        video.stop();

        clearInterval(processTimer);

        window.view = new HomeView();
        window.view.reload();

        player.style.display = 'none';
    }
    function setLoadingMessage(msg) {
        loadingMessage.innerHTML = msg;
    }

    function setMetaData(media) {
        document.getElementById('description').innerHTML = media.summary;
        document.getElementById('title').innerHTML = media.title;
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
        console.log('Player state: ' + video.playState);
        switch (video.playState)
        {
            case 5: // finished
                closePlayer();
                break;
            case 0: // stopped
                break;
            case 6: // error
                // TODO: Error message for the enduser
                closePlayer();
                break;
            case 1: // playing
                if (loading) {
                    readyHandler();
                }
                break;
            case 2: // paused
                break;
            case 3: // connecting
                setLoadingMessage('Connecting...');
                break;
            case 4: // buffering
                setLoadingMessage('Buffering...');
                showControls('BUFFERING', CONTROLS_TIMEOUT);
                break;
            default:
                // do nothing
                break;
        }
    }

    /**
     * Update the progress bar.
     */
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
            // Delay hidding the controls a bit to make it more fluent
            setTimeout(function() {
                hideControls();
            }, 1000);
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

        if (totalTime > 0 && totalTime < video.playTime) {
            video.seek(totalTime);
        }
    }

	this.onUp = function () {
        hideControls();
	};
	this.onDown = function () {
        showControls('');
	};
	this.onLeft = function () {
        doSkip(-60.0);
	};
    this.onRew = function () {
        doSkip(300.0);
    };
	this.onRight = function () {
        doSkip(60.0);
	};
    this.onFF = function () {
        doSkip(-300.0);
    };
	this.onEnter = function () {
        togglePause();
	};
    this.onPlay = function () {
        togglePause();
    };
    this.onPause = function () {
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

        showPlayer();

        if (useViewOffset && media.viewOffset) {
            // Save the offset so we can set if when the video is loaded
            startViewOffset = media.viewOffset;
        }

        setMetaData(media);

        var url = plexAPI.getURL(media.url);

        video.data = url;
        if (media.mimeType) {
            video.type = media.mimeType;
        }
        video.play(1);


        // Update process bar every 2 seconds
        processTimer = setInterval(updateElapsedTime, 2000);

		// Load subtitles
		if (media.subtitles) {
            console.log('Loading subtitle ' + media.subtitles + '...');
			var p =  new Popcorn( '#video' )
                        .parseSRT(plexAPI.getURL(media.subtitles))
                        .play();
		}
	};

    loading = true;
    document.getElementById('video-loading').style.display = 'block';

    video.onPlayStateChange=checkPlayState;

	plexAPI.browse(uri, function(container) {
		scope.render(container);
	});
}