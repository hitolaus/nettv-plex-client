/**
 * Integrates with the Plex HLS Transcoder.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 */
function TranscoderHLS() {

    function getAuthParameters(url) {
        var publicKey = 'KQMIY6GATPC63AIMC4R2';
        var privateKey = 'k3U6GLkZOoNIoSgjDshPErvqMIFdE0xMTx8kgsrhnC0=';

        var time = Math.round(new Date().getTime() / 1000);

        var msg = url+'@'+time;

        var sha  = new jsSHA(msg, 'TEXT');
        var hmac = sha.getHMAC(privateKey, 'B64', 'SHA-256', 'B64');

        return '&X-Plex-Access-Key=' + encodeURIComponent(publicKey) + '&X-Plex-Access-Time='+ time + '&X-Plex-Access-Code=' + encodeURIComponent(hmac);
    }

    /**
     * Start transcoding of a video stream.
     *
     * Supported options for the transcoder are:
     * <ul>
     *   <li>offset: Begining streaming offset. Default: 0</li>
     *   <li>quality: The quality of the stream. Legal values are 5-15. Default: 8</li>
     * </ul>
     *
     * @param {object} the video object to transcode
     * @param {function} callback called on success with absolute playlist path and session id
     * @param {object} [options] The options for the transcoder
     */
    this.transcode = function (video, callback, options) {

        options = options || {};

        var offset  = options.offset  || 0;
        var quality = options.quality || 8;

        var url = '/video/:/transcode/segmented/start.m3u8?';
        url += 'identifier=com.plexapp.plugins.library';
        url += '&url='+encodeURIComponent('http://127.0.0.1:32400' + video.url);
        url += '&quality='+quality;
        url += '&ratingKey=' + video.ratingKey;
        url += '&3g=0';
        //url += '&httpCookies=&userAgent=';
        url += '&offset='+offset;
        url += getAuthParameters(url);

        /*
        if (capacities) {
            url += 'X-Plex-Client-Capabilities='+encodeURIComponent(capacities);
        }
        */

        // Get the variant playlist
        var xhr = new XMLHttpRequest();
        xhr.open('GET','http://'+Settings.getPMS()+':32400' + url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var response = xhr.responseText;
                var relativePlaylistPath = response.replace(/[\s\S]+(session.+?\.m3u8)[\s\S]+/, '$1');

                var sessionId = relativePlaylistPath.split('/')[1];
                var m3u8 = 'http://'+Settings.getPMS()+':32400/video/:/transcode/segmented/' + relativePlaylistPath;

                callback(m3u8, sessionId);
            }
        };
        xhr.send();
    };
}

/**
 * Integrates with the Plex generic Transcoder.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 */
function TranscoderGeneric() {
    // See how DLNA clients uses the generic transcoder
}
