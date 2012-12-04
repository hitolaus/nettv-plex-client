function Directory(elem) {
	
	//leafCount="67" viewedLeafCount="54"
	
	var keyAttrNode = elem.attributes.getNamedItem("key");
	var titleAttrNode = elem.attributes.getNamedItem("title");
	var typeAttrNode = elem.attributes.getNamedItem("type");
	var summaryAttrNode = elem.attributes.getNamedItem("summary");
	var thumbAttrNode = elem.attributes.getNamedItem("thumb");
	var artAttrNode = elem.attributes.getNamedItem("art");
	var leafCountAttrNode = elem.attributes.getNamedItem("leafCount");
	var viewedLeafCountAttrNode = elem.attributes.getNamedItem("viewedLeafCount");
	
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
		unwatched: unwatched
	}
}