function MediaContainer(elem) {

    if (!elem) {
        return {
            media:[]
        };
    }

    var size = elem.getAttribute('size');
	var art  = elem.getAttribute('art');
	var title1 = elem.getAttribute('title1');
	var title2 = elem.getAttribute('title2');

    var media = [];

    var children = elem.childNodes;
    var n = children.length;
    for (var i = 0; i < n; i++) {
        var e = children[i];

        if (e.nodeName === 'Directory') {
            media.push(new Directory(e));
        }
        else if (e.nodeName === 'Video') {
            media.push(new Video(e));
        }
    }

    return {
        size: size,
        art: art,
        title1: title1,
        title2: title2,
        media: media
    };
}