/**
 * Parses a video container from Plex and returns if a simple/flat video
 * model.
 *
 * @author Jakob Hilarius
 *
 * @constructor
 * @param {object} elem The video element returned from Plex. This is NOT including the media container.
 */
function Video(elem) {
    /**
     * Convert the video container returned by Plex to a mime type for the player.
     *
     * @param {String} container the video container
     * @returns {String} the mime type
     */
    function getContainerMimeType(container) {
        if (container === null) {
            return null;
        }
        if (container === 'mp4') {
            return 'video/mp4';
        }
        if (container === 'mkv') {
            return 'video/x-matroska';
        }
        if (container === 'mpeg') {
            return 'video/mpeg';
        }
        if (container === 'avi') {
            return 'video/avi';
        }

        return null;
    }

    /**
     * Returns the media information such as codec, bitrate, resolution etc.
     *
     * @param {object} stream the library stream that contains the information.
     * @returns {object} an object containing the available media information.
     */
    function getVideoStreamInformation(stream) {
        return {
            codec: stream.getAttribute('codec'),
            bitrate: stream.getAttribute('bitrate'),
            framerate: stream.getAttribute('frameRate'),
            profile: stream.getAttribute('profile'),
            level: stream.getAttribute('level')
        };
    }

    /**
     * Returns the media information such as codec, bitrate, resolution etc.
     *
     * @param {object} stream the library stream that contains the information.
     * @returns {object} an object containing the available media information.
     */
    function getAudioStreamInformation(stream) {
        return {
            codec: stream.getAttribute('codec'),
            bitrate: stream.getAttribute('bitrate')
        };
    }

	var key = elem.getAttribute('key');
    var ratingKey = elem.getAttribute('ratingKey');
	var title = elem.getAttribute('title');
	var type = elem.getAttribute('type');
	var summary = elem.getAttribute('summary');
	var year = elem.getAttribute('year');

    var season = elem.getAttribute('parentIndex');
    var episode = elem.getAttribute('index');

	var thumb = elem.getAttribute('thumb');
    var art = elem.getAttribute('art');

    var duration = 0;
    if (elem.getAttribute('duration') !== null) {
        duration = Math.floor(parseInt(elem.getAttribute('duration'), 10)/1000);
    }

    var viewOffset = 0;
    if (elem.getAttribute('viewOffset') !== null) {
        viewOffset = Math.floor(parseInt(elem.getAttribute('viewOffset'), 10)/1000);
    }

    var viewCount = elem.getAttribute('viewCount');

    var grandparentTitle = elem.getAttribute('grandparentTitle');
    var grandparentThumb = elem.getAttribute('grandparentThumb');

    var resolution;

	var url = '';
    var mimeType = null;
	var subtitles = null;
	var files = [];

    var streamInformation = {};

    var children = elem.childNodes;
    var mediaCount = children.length;
	for (var i = 0; i < mediaCount; i++) {
		var media = children[i];
		if (media.nodeName !== 'Media') {
            continue;
        }

        mimeType = media.getAttribute('container');
        resolution = media.getAttribute('videoResolution');

		var parts = media.getElementsByTagName('Part');
        var partCount = parts.length;
		for (var j = 0; j < partCount; j++) {
			var part = parts[j];

			var partKeyAttrNode = part.attributes.getNamedItem('key');
			if (partKeyAttrNode !== null) {
				url = partKeyAttrNode.nodeValue;
				files.push(url);
			}

			var streams = part.getElementsByTagName('Stream');
            var streamCount = streams.length;
			for (var k = 0; k < streamCount; k++) {
				var stream = streams[k];

				var streamKey = stream.getAttribute('key');
				var streamCodec = stream.getAttribute('codec');
                var streamType = stream.getAttribute('streamType');
				var isStreamSelected = false;

				var streamSelectedAttrNode = stream.attributes.getNamedItem('selected');
				if (streamSelectedAttrNode !== null) {
					isStreamSelected = streamSelectedAttrNode.nodeValue === '1';
				}

                if (streamType === '1') {
                    streamInformation.video = getVideoStreamInformation(stream);
                }

                if (streamType === '2') {
                    streamInformation.audio = getAudioStreamInformation(stream);
                }

				if (isStreamSelected) {
					if (streamCodec === 'srt') {
						subtitles = streamKey;
					}
				}
			}
		}
	}


	return {
		key: key,
        ratingKey: ratingKey,
		type: type,
		container:false,
		title: title,
        season: season,
        episode: episode,
		summary: summary,
        year: year,
		thumb: thumb,
        grandparentTitle: grandparentTitle,
        grandparentThumb: grandparentThumb,
		art: art,
		url: url,
        mimeType: getContainerMimeType(mimeType),
		subtitles: subtitles,
        duration: duration,
        viewCount: viewCount,
        viewOffset: viewOffset,
        stream: streamInformation
	};
}