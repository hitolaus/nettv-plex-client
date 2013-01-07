/**
 * The player view.
 * <p>
 * The view also handles reporting progress information to Plex as well as marking the
 * video as watched when a given amount has been viewed.
 * </p>
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {string} uri The PLex API address of the video meta data.
 * @param {boolean} [useViewOffset] If <code>true</code> the view offset will be used.
 * @param {object} [returnView] The view to return to
 */
/*global Popcorn,video */
function PlayerView(uri, useViewOffset, returnView) {
    var CONTROLS_TIMEOUT = 5000;
    var PROGRESS_INTERVAL = 60000;

    // The percentage of the files that has to be view before we regard it as watched
    var WATCHED_PERCENTAGE = 90;

    var scope = this;

    // Preload the element lookups
    var player = document.getElementById('player');
    var controls = document.getElementById('controls');
    var status = document.getElementById('player-status-message');

    if (Settings.useAnim()) {
        platform.addTransition(controls, '500ms', 'bottom');
    }

    var totalDuration = 0;
    var durationIndex = 0;

    var mediaRatingKey;
    var loading = false;
    var startViewOffset = null;

    var controlsTimer;
    var processTimer;
    var plexProgressTimer;

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
        hideControls();
        video.stop();

        // Manually report that we have stopped
        reportPlexProgress();

        clearInterval(processTimer);
        clearInterval(plexProgressTimer);
        clearInterval(controlsTimer);

        if (!returnView) {
            window.view = new HomeView();
        }
        else {
            window.view = returnView;
        }
        window.view.reload();

        player.style.display = 'none';
    }

    function reportPlexProgress() {

        if (!mediaRatingKey) {
            return;
        }

        var state = 'stopped';
        switch (video.playState)
        {
            case 0:
                state = 'stopped';
                break;
            case 1:
                state = 'playing';
                break;
            case 2:
                state = 'paused';
                break;
        }

        var duration = video.playTime;
        var position = video.playPosition;

        if (duration === 0) {
            // This happens when we are stopping a video
            return;
        }

        var viewedPercentage = Math.floor((position/duration)*100);

        if (viewedPercentage > WATCHED_PERCENTAGE) {
            console.log('Reporting watched since we have viewed ' + viewedPercentage + '%');

            // Last 5 min. are regarded as watched
            plexAPI.watched(mediaRatingKey);

            // Stop any further progress reporting
            clearInterval(plexProgressTimer);

            return;
        }

        plexAPI.progress(mediaRatingKey, position, state);
    }

    function setMetaData(media) {
        var heading1, heading2;
        var title = document.getElementById('controls-title');

        if (media.type === 'episode') {
            heading1 = media.grandparentTitle.encodeHTML();
            heading2 = 'Season ' + media.season + ', Episode ' + media.episode + '<br/>' + media.title.encodeHTML();
        }
        else {
            heading1 = media.title.encodeHTML();
            heading2 = '(' + media.year + ')';
        }

        title.innerHTML = '<h1>' + heading1 + '</h1><h2>' + heading2 + '</h2>';


        document.getElementById('controls-description').innerHTML = media.summary.encodeHTML();
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
                break;
            case 4: // buffering
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
     * @param {number} time the time to skip in seconds
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

    /**
     * Increase the play speed.
     * <p>
     * NOTE: Is currently not supported by NetTV.
     * </p>
     *
     * @param {number} direction if <code>1</code> seek forward if <code>-1</code> seek backwards
     */
    function doSeek(direction) {
        if (loading) {
            return;
        }

        showControls('');


        // TODO: 4 is the constant test speed. If it works use incremental speed
        video.play(direction*4);
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
        doSkip(-300.0);
    };
	this.onRight = function () {
        doSkip(60.0);
	};
    this.onFF = function () {
        doSkip(300.0);
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

        console.log('Playing: codec: ' + media.stream.video.codec + '/' + media.stream.audio.codec + ' profile: ' + media.stream.video.profile + ' level: ' + media.stream.video.level);

        showPlayer();

        mediaRatingKey = media.ratingKey;
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


        // Update process bar every second
        processTimer = setInterval(updateElapsedTime, 1000);

        // Report progress to Plex
        plexProgressTimer = setInterval(reportPlexProgress, PROGRESS_INTERVAL);

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