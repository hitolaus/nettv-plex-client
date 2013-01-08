/**
 * List view.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @oaram {string} uri The URI of the section
 * @param {object} returnView  The view instance to return to when this view closes
 */
function ListView(uri, returnView) {
    var NO_OF_MENU_ELEMENTS = 8;
    var METADATA_LOADING_DELAY = 1000;

    var view = document.getElementById('list');
    var menu = document.getElementById('list-menu');

    var mediaContainer;
    var mediaList;

    var nav = new SimpleListMenu(NO_OF_MENU_ELEMENTS);

    var backgroundLoader = new BackgroundLoader('list-bg1', 'list-bg2');

    var resourceLoadTimer;

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
        clearTimeout(resourceLoadTimer);

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

    function loadMetadata() {
        clearTimeout(resourceLoadTimer);
        resourceLoadTimer = setTimeout(buildDescription, METADATA_LOADING_DELAY);
    }

    function buildDescription () {
        if (!nav.current()) {
            return;
        }
        var idx = nav.current().getAttribute('data-index');
        var media = mediaContainer.media[idx];

        backgroundLoader.load(media.art);

        var listInfo = document.getElementById('list-info');

        listInfo.innerHTML = '';
        if (!media.type) {
            // This is a container
            listInfo.appendChild(buildGenericMetaData(media));
        }
        else if (media.type === 'genre') {
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
        heading1.innerHTML = (media.grandparentTitle) ? media.grandparentTitle : mediaContainer.grandparentTitle;

        container.appendChild(heading1);

        var episodeInfo = 'Season ' + ((media.season) ? media.season : mediaContainer.season) + ', Episode ' + media.episode + ':<span> ' + media.title.encodeHTML()+ '</span>';

        var heading2 = document.createElement('h2');
        heading2.innerHTML = episodeInfo;

        container.appendChild(heading2);

        var summary = document.createElement('p');
        summary.innerHTML = media.summary;

        container.appendChild(summary);

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
        heading1.innerHTML = media.title.encodeHTML();

        container.appendChild(heading1);

        var heading2 = document.createElement('h2');
        heading2.innerHTML = media.year + ' - ' + Time.format(media.duration);

        container.appendChild(heading2);

        var summary = document.createElement('p');
        summary.innerHTML = (media.summary) ? media.summary.encodeHTML() : '';

        container.appendChild(summary);

        if (media.thumb) {
            var thumb = new Image();
            thumb.src = plexAPI.getScaledImageURL(plexAPI.getURL(media.thumb), 245, 360);
            thumb.style.width = '245px';
            thumb.style.height = '360px';

            container.appendChild(thumb);
        }
        return container;
    }

    function buildScroller(mediaList) {
        var scroller = document.createElement('ul');
        scroller.setAttribute('id', 'list-scroller');

        var n = mediaList.length;
        for (var i = 0; i < n; i++) {
            var media = mediaList[i];

            var offset = (media.viewOffset) ? media.viewOffset : 0;

            var builder = [ media.title.encodeHTML() ];
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

            scroller.appendChild(item);
        }
        return scroller;
    }

    this.onUp = function () {
        if (nav) {
            nav.prev();
            loadMetadata();
        }
    };
    this.onDown = function () {
        if (nav) {
            nav.next();
            loadMetadata();
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

        clearTimeout(resourceLoadTimer);

        var selected = nav.current();
        var idx = parseInt(selected.getAttribute('data-index'), 10);
        var media = mediaContainer.media[idx];

        var key = media.key;
        var isContainer = media.container;

        if (isContainer) {
            window.view = new ListView(plexAPI.getURL(key, uri), this);
            window.view.render();
        }
        else {
            var offset = media.viewOffset;

            if (offset > 0 && platform.canSeek(media)) {
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

    this.onYellow = function () {
        var selected = nav.current();
        var idx = selected.getAttribute('data-index');
        var media = mediaContainer.media[idx];

        if (!media.container) {
            window.view = new ContextMenuView(media, this);
        }
    };

    this.reload = function () {
        this.render();
    };
    this.render = function () {
        plexAPI.browse(uri, function(container) {
            mediaContainer = container;

            var mediaList = container.media;
            var mediaListCount = mediaList.length;

            backgroundLoader.load(container.art);

            var scroller = buildScroller(mediaList);

            menu.innerHTML = '';
            menu.appendChild(scroller);

            var chunks = mediaListCount/NO_OF_MENU_ELEMENTS;
            if (chunks < 1) {
                chunks = 1;
            }
            // 400 is the scrollbar height. We hardcode it since offsetHeight causes reflow
            var scrollbarHeight = Math.floor(400/chunks);

            nav.onscroll = function (top) {
                var scaledElems = 400/mediaListCount;
                var menuMove = (-parseInt(top,10))/50*scaledElems;
                document.getElementById('list-scrollbar-thumb').style.top = menuMove + 'px';
            };
            nav.init(scroller);

            document.getElementById('list-scrollbar-thumb').style.height = scrollbarHeight + 'px';

            document.getElementById('list-objects-count').innerHTML = mediaListCount;
            buildDescription();

            show();
        });
    };
}