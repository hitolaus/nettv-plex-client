/**
 * Preferences view.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @oaram {string} uri The URI of the section
 * @param {object} returnView  The view instance to return to when this view closes
 */
function ListView(uri, returnView) {
    var view = document.getElementById('list');
    var menu = document.getElementById('list-menu');

    var mediaList;

    var nav;

    var backgroundLoader = new BackgroundLoader('list-bg1', 'list-bg2');

    function show() {
        view.style.display = 'block';
    }
    function hide() {
        if (nav) {
            nav.reset();
        }
        view.style.display = 'none';
    }
    function close () {
        if (!returnView) {
            window.view = new HomeView();
            window.view.reload();

            hide();
        }
        else {
            window.view = returnView;
            window.view.render();
        }
    }
    function buildDescription () {
        var idx = nav.current().getAttribute('data-index');
        var media = mediaList[idx];

        backgroundLoader.load(media.art);

        var listInfo = document.getElementById('list-info');

        listInfo.innerHTML = '';
        if (!media.type) {
            // This is a container
            listInfo.appendChild(buildGenericMetaData(media));
        }
        else if (media.type === 'episode') {
            listInfo.appendChild(buildEpisodeMetaData(media));
        }
        else if (media.type === 'season') {
            listInfo.appendChild(buildGenericMetaData(media));
        }
        else {
            listInfo.appendChild(buildMetaData(media));
        }
    }
    function buildGenericMetaData(media) {
        var container = document.createElement('div');
        DOM.addClass(container, 'generic');

        if (media.thumb) {
            var thumb = new Image();
            thumb.src = plexAPI.getScaledImageURL(plexAPI.getURL(media.thumb), 245, 360);
            thumb.style.width = '245px';
            thumb.style.height = '360px';

            container.appendChild(thumb);
        }
        return container;
    }
    function buildEpisodeMetaData(media) {
        var container = document.createElement('div');
        DOM.addClass(container, 'episode');

        var heading1 = document.createElement('h1');
        heading1.appendChild(document.createTextNode(media.grandparentTitle));

        container.appendChild(heading1);

        var episodeInfo = 'Season ' + media.season + ', Episode ' + media.episode + ':<span> ' + media.title+ '</span>';

        var heading2 = document.createElement('h2');
        heading2.innerHTML = episodeInfo;

        container.appendChild(heading2);

        var thumb = new Image();
        thumb.src = plexAPI.getScaledImageURL(plexAPI.getURL(media.thumb), 460, 210);
        thumb.style.width = '460px';
        thumb.style.height = '210px';

        container.appendChild(thumb);

        return container;
    }

    function buildMetaData(media) {

        var container = document.createElement('div');
        DOM.addClass(container, 'video');

        var heading1 = document.createElement('h1');
        heading1.appendChild(document.createTextNode(media.title));

        container.appendChild(heading1);

        var heading2 = document.createElement('h2');
        heading2.appendChild(document.createTextNode(media.year + ' - ' + Time.format(media.duration)));

        container.appendChild(heading2);

        var summary = document.createElement('p');
        summary.appendChild(document.createTextNode(media.summary));

        container.appendChild(summary);

        var thumb = new Image();
        thumb.src = plexAPI.getScaledImageURL(plexAPI.getURL(media.thumb), 245, 360);
        thumb.style.width = '245px';
        thumb.style.height = '360px';

        container.appendChild(thumb);

        return container;
    }

    this.onUp = function () {
        if (nav) {
            nav.prev();
            //backgroundLoader.load(nav.current().getAttribute('data-art'));
            buildDescription();
        }
    };
    this.onDown = function () {
        if (nav) {
            nav.next();
            //backgroundLoader.load(nav.current().getAttribute('data-art'));
            buildDescription();
        }
    };
    this.onLeft = function () {
        close();
    };
    this.onRight = function () {};
    this.onEnter = function () {
        if (!nav) {
            return;
        }

        var selected = nav.current();
        var idx = selected.getAttribute('data-index');
        var key = mediaList[idx].key;
        var isContainer = mediaList[idx].container;
        //var key = selected.getAttribute('data-key');
        //var isContainer = selected.getAttribute('data-container') === 'true';

        if (isContainer) {
            window.view = new ListView(plexAPI.getURL(key, uri), this);
            window.view.render();
        }
        else {
            //var offset = parseInt(selected.getAttribute('data-offset'), 10);
            var offset = mediaList[idx].viewOffset;

            if (offset > 0) {
                window.view = new ResumeView(plexAPI.getURL(key), offset, this);
            }
            else {
                window.view = new PlayerView(plexAPI.getURL(key), false, this);
            }
        }
    };
    this.onBack = function () {
        close();
    };

    this.reload = function () {
        this.render();
    };
    this.render = function () {
        plexAPI.browse(uri, function(container) {
            //var mediaList = container.media;
            mediaList = container.media;

            backgroundLoader.load(container.art);

            var scroller = document.createElement('ul');
            scroller.setAttribute('id', 'list-scroller');

            var selectedItem;
            var selectedIdx;
            var n = mediaList.length;
            for (var i = 0; i < n; i++) {
                var media = mediaList[i];

                var offset = (media.viewOffset) ? media.viewOffset : 0;

                var builder = [ media.title ];
                if (media.unwatched > 0) {
                    builder.push('<span>'+media.unwatched+'</span>');
                }

                if (!media.container) {
                    if (media.viewOffset > 0) {
                        builder.push('<img src="images/OverlayInProgress.png" alt="" />');
                    }
                    else if (!media.viewCount) {
                        builder.push('<img src="images/OverlayUnwatched.png" alt="" />');
                    }
                }

                var item = document.createElement('li');
                item.innerHTML = builder.join(' ');
                item.setAttribute('data-index', i);

                if (i === 0) {
                    DOM.addClass(item, 'active');
                    selectedItem = item;
                    selectedIdx = i;
                }

                scroller.appendChild(item);
            }

            menu.innerHTML = '';
            menu.appendChild(scroller);


            nav = new SimpleListMenu('list-scroller', selectedItem, 8);
            document.getElementById('list-objects-count').innerHTML = n;
            buildDescription();

            show();
        });
    };
}