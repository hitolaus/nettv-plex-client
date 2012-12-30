function Directory(elem) {

	var key = elem.getAttribute('key');
	var title = elem.getAttribute('title');
	var type = elem.getAttribute('type');

	var summaryAttrNode = elem.attributes.getNamedItem("summary");
	var thumbAttrNode = elem.attributes.getNamedItem("thumb");
	var artAttrNode = elem.attributes.getNamedItem("art");
	var leafCountAttrNode = elem.attributes.getNamedItem("leafCount");
	var viewedLeafCountAttrNode = elem.attributes.getNamedItem("viewedLeafCount");

	var year = elem.getAttribute('year');

	var duration = 0;
    if (elem.getAttribute('duration') !== null) {
        duration = Math.floor(parseInt(elem.getAttribute('duration'), 10)/1000);
    }

	var summary = "";
	if (summaryAttrNode != null) {
		summary = summaryAttrNode.nodeValue;
	}
	var thumb = "";
	if (thumbAttrNode != null) {
		thumb = thumbAttrNode.nodeValue;
	}
	var art = "";
	if (artAttrNode != null) {
		art = artAttrNode.nodeValue;
	}

	var unwatched = 0;
	if (leafCountAttrNode != null && viewedLeafCountAttrNode != null) {
		unwatched = leafCountAttrNode.nodeValue - viewedLeafCountAttrNode.nodeValue;

	}

	return {
		key: key,
		type: type,
		container: true,
		title: title,
		summary: summary,
		thumb: thumb,
		art: art,
		unwatched: unwatched,
		duration: duration,
		year: year
	}
}