function Directory(elem) {

	var key = elem.getAttribute('key');
	var title = elem.getAttribute('title');
	var type = elem.getAttribute('type');
	var summary = elem.getAttribute('summary');


	var thumb = elem.getAttribute('thumb');
	var art = elem.getAttribute('art');
	var leafCount = elem.getAttribute('leafCount');
	var viewedLeafCount = elem.getAttribute('viewedLeafCount');

	var year = elem.getAttribute('year');

	var duration = 0;
    if (elem.getAttribute('duration') !== null) {
        duration = Math.floor(parseInt(elem.getAttribute('duration'), 10)/1000);
    }

	var unwatched = 0;
	if (leafCount && viewedLeafCount) {
		unwatched = leafCount - viewedLeafCount;
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
	};
}