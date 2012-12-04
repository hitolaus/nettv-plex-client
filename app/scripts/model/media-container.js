function MediaContainer(elem) {

    var sizeAttrNode = elem.attributes.getNamedItem("size");
	var artAttrNode = elem.attributes.getNamedItem("art");
	var title1AttrNode = elem.attributes.getNamedItem("title1");
	var title2AttrNode = elem.attributes.getNamedItem("title2");
	
	if (sizeAttrNode != null) {
    	var size = sizeAttrNode.nodeValue;
	}
	if (artAttrNode != null) {
    	var art = artAttrNode.nodeValue;
	}
	if (title1AttrNode != null) {
    	var title1 = title1AttrNode.nodeValue;
	}
	if (title2AttrNode != null) {
    	var title2 = title2AttrNode.nodeValue;
	}
	
    var media = [];
    
    for (var i = 0; i < elem.childNodes.length; i++) {
        var e = elem.childNodes[i];
        
        if (e.nodeName === "Directory") {
            media.push(new Directory(e));
        }
        else if (e.nodeName === "Video") {
            media.push(new Video(e));
        }
    }
    
    return {
        size: size,
        art: art,
        title1: title1,
        title2: title2,
        media: media
    }
}