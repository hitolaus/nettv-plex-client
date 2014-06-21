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
    var CONTROLS_TIMEOUT = 5000,
        PROGRESS_INTERVAL = 60000,
        // The percentage of the files that has to be view before we regard it as watched
        WATCHED_PERCENTAGE = 90;

    var scope = this;

    // Preload the element lookups
    var player = document.getElementById('player'),
        controls = document.getElementById('controls'),
        status = document.getElementById('player-status-message'),
        video = document.getElementById('video');


    if (Settings.useAnim()) {
        platform.addTransition(controls, '500ms', 'bottom');
    }

    var durationIndex = 0,
        state = 'stopped';

    var mediaRatingKey;
    var loading = false;
    var startViewOffset = null;

    var controlsTimer,
        processTimer,
        plexProgressTimer;

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

    function showPlayer() {
        player.style.display = 'block';
        // Initially the player is offscreen due to the loading hack, so we need to move it back
        player.style.top = '0';
    }

    function closePlayer() {
        hideControls();
        video.pause();
        state = 'stopped';

        // Manually report that we have stopped
        reportPlexProgress();

        // Stop all timers
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

        var duration = video.duration,
            position = Math.floor(video.currentTime);

        if (duration === 0) {
            // This happens when we are stopping a video
            return;
        }

        var viewedPercentage = Math.floor((position / duration) * 100);

        if (viewedPercentage > WATCHED_PERCENTAGE) {
            console.log('Reporting watched since we have viewed ' + viewedPercentage + '%');

            // Last 10% are regarded as watched
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
        var totalDuration = Math.floor(video.duration);
        durationIndex = 1200 / totalDuration;

        document.getElementById('total-duration').innerHTML = Time.format(totalDuration);
    }

    /**
     * Update the progress bar.
     */
    function updateElapsedTime() {
        var ct = video.currentTime;
        document.getElementById('duration').innerHTML = Time.format(ct);

        var sliceTime = Math.round(ct * durationIndex);
        document.getElementById('progressbar-front').style.width = sliceTime + 'px';
    }

    /**
     * Toggle the player state between playing and paused.
     */
    function togglePause() {
        if (loading) {
            return;
        }

        if (parseInt(controls.style.bottom, 10) === 0) {
            video.play();
            state = 'playing';

            // Delay hidding the controls a bit to make it more fluent
            setTimeout(function () {
                hideControls();
            }, 1000);
        }
        else {
            video.pause();
            state = 'paused';

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

        // Get the total time in seconds
        var totalTime = video.currentTime + time;

        if (totalTime > 0 && totalTime < video.duration) {
            video.currentTime = totalTime;
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

        video.playbackRate = direction * 4;
    }

    /**
     * Initializes playback.
     *
     * @param {string} url The url to start playing
     * @param {string} mimeType The mime type of the video content
     */
    function doPlayback(url, mimeType) {
        video.src = url;
        if (mimeType) {
            video.type = mimeType;
        }
        video.play();
        state = 'playing';

        // Update process bar every second
        processTimer = setInterval(updateElapsedTime, 1000);

        // Report progress to Plex
        plexProgressTimer = setInterval(reportPlexProgress, PROGRESS_INTERVAL);
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

        var url,
            mimeType;

        if (!platform.isSupported(media)) {
            plexAPI.transcode(media, function (m3u8, sessionId) {
                url = m3u8;
                //mimeType = 'application/vnd.apple.mpegurl';
                //mimeType = 'application/x-mpegURL';
                mimeType = 'video/mp4';

                console.log('Transcoding: ' + url);

                doPlayback(url, mimeType);
            });
        }
        else {
            url = plexAPI.getURL(media.url);
            mimeType = media.mimeType;

            doPlayback(url, mimeType);
        }

        // Load subtitles
        /*
        if (media.subtitles) {
            console.log('Loading subtitle ' + media.subtitles + '...');
            var p = new Popcorn('#video')
                .parseSRT(plexAPI.getURL(media.subtitles))
                .play();
        }
        */
    };

    loading = true;
    document.getElementById('video-loading').style.display = 'block';

    video.addEventListener('abort', function () {
        console.log('abort');
    }, true);
    video.addEventListener('error', function () {
        console.log('error');
        // TODO: Error message for the enduser
        closePlayer();
    }, true);
    video.addEventListener('canplay', function () {
        console.log('canplay');
        if (loading) {
            readyHandler();
        }
    }, true);
    video.addEventListener('play', function () {
        console.log('play');
    }, true);
    video.addEventListener('playing', function () {
        console.log('playing');
    }, true);
    video.addEventListener('pause', function () {
        console.log('pause');
    }, true);
    video.addEventListener('stalled', function () {
        console.log('stalled');
    }, true);
    video.addEventListener('waiting', function () {
        console.log('waiting');
        if (!loading) {
            showControls('BUFFERING', CONTROLS_TIMEOUT);
        }
    }, true);

    plexAPI.browse(uri, function (container) {
        scope.render(container);
    });
}