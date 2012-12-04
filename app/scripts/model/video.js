function Video(elem) {
	var keyAttrNode = elem.attributes.getNamedItem("key");
	var titleAttrNode = elem.attributes.getNamedItem("title");
	var typeAttrNode = elem.attributes.getNamedItem("type");
	var summaryAttrNode = elem.attributes.getNamedItem("summary");
	var thumbAttrNode = elem.attributes.getNamedItem("thumb");
    var grandparentThumbAttrNode = elem.attributes.getNamedItem("grandparentThumb");
	var artAttrNode = elem.attributes.getNamedItem("art");

	var durationAttrNode = elem.attributes.getNamedItem("duration");
	var viewOffsetAttrNode = elem.attributes.getNamedItem("viewOffset");
	
	var key = "";
	if (keyAttrNode != null) {
		key = keyAttrNode.nodeValue;
	}
	
	var title = "";
	if (titleAttrNode != null) {
		title = titleAttrNode.nodeValue;
	}
	var type = "";
	if (typeAttrNode != null) {
		type = typeAttrNode.nodeValue;
	}
	var summary = "";
	if (summaryAttrNode != null) {
		summary = summaryAttrNode.nodeValue;
	}
	var thumb = "";
	if (thumbAttrNode != null) {
		thumb = thumbAttrNode.nodeValue;
	}
    var grandparentThumb = "";
    if (grandparentThumbAttrNode != null) {
        grandparentThumb = grandparentThumbAttrNode.nodeValue;
    }
    
	var art = "";
	if (artAttrNode != null) {
		art = artAttrNode.nodeValue;
	}
	
    var duration = 0;
    if (durationAttrNode != null) {
        duration = Math.floor(parseInt(durationAttrNode.nodeValue, 10)/1000);
    }
    
    var viewOffset = 0;
    if (viewOffsetAttrNode != null) {
        viewOffset = Math.floor(parseInt(viewOffsetAttrNode.nodeValue, 10)/1000);
    }
    
	var url = "";
	var subtitles = null;
	var files = [];
	for (var i = 0; i < elem.childNodes.length; i++) {
		var media = elem.childNodes[i];	
		if (media.nodeName != "Media") continue;

		var parts = media.getElementsByTagName("Part");
		for (var j = 0; j < parts.length; j++) {
			var part = parts[j];

			var partKeyAttrNode = part.attributes.getNamedItem("key");
			if (partKeyAttrNode != null) {
				url = partKeyAttrNode.nodeValue;
				files.push(url);
			}
			
			var streams = part.getElementsByTagName("Stream");
			for (var k = 0; k < streams.length; k++) {
				var stream = streams[k];
				
				var streamKey = "";
				var streamCodec = "";
				var isStreamSelected = false;
				
				var streamKeyAttrNode = stream.attributes.getNamedItem("key");
				if (streamKeyAttrNode != null) {
					streamKey = streamKeyAttrNode.nodeValue;
				}
				var streamCodecAttrNode = stream.attributes.getNamedItem("codec");
				if (streamCodecAttrNode != null) {
					streamCodec = streamCodecAttrNode.nodeValue;
				}
				var streamSelectedAttrNode = stream.attributes.getNamedItem("selected");
				if (streamSelectedAttrNode != null) {
					isStreamSelected = streamSelectedAttrNode.nodeValue === "1";
				}
				
				if (isStreamSelected) {
					if (streamCodec === "srt") {
						subtitles = streamKey;
					}
				}
			}
		}
	}

	
	return {
		key: key,
		type: type,
		container:false,
		title: title,
		summary: summary,
		thumb: thumb,
        grandparentThumb: grandparentThumb,
		art: art,
		url: url,
		subtitles: subtitles,
        duration: duration,
        viewOffset: viewOffset
	}
}