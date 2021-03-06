/**
 * The main home screen view.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 */
function HomeView() {
    var PLACEHOLDER_IMAGE = 'images/PosterPlaceholder.png';
    var PRELOADED_IMAGES = 7;
    var PREVIEW_MENU_LOADING_DELAY = 1000;

    var nav = null;

    // The menus
    var ondeckMenu = null;
    var recentlyAddedMenu = null;
    var homeMenu = null;

    // Name of the last used menu
    var lastUsedMenu = null;

    // Timer for preview menu (so we can cancel loading)
    var previewLoader;

    var backgroundLoader = new BackgroundLoader('bg1', 'bg2'),
        artLoader = new BackgroundLoader('home-description-art1', 'home-description-art2', 425, 240);

    // Whether we need to load the thumbs
    var dirtyOndeckThumbs = false;
    var dirtyRecentlyAddedThumbs = false;

    function updateTime() {
        document.getElementById('home-time').innerHTML = Time.to12HourFormat(new Date());
    }

    // Cache description elements
    var descriptionElem = document.getElementById('home-description'),
        descriptionTitleElem = document.getElementById('home-description-title'),
        descriptionInfoElem = document.getElementById('home-description-info'),
        descriptionSummaryElem = document.getElementById('home-description-summary'),
        descriptionResolutionFlagElem = document.getElementById('home-description-resolution'),
        descriptionAudioCodecFlagElem = document.getElementById('home-description-audiocodec'),
        descriptionAudioChannelsFlagElem = document.getElementById('home-description-audiochannels');

    if (Settings.useAnim()) {
        platform.addTransition(descriptionElem, '500ms', 'left');
    }

    function showDescription() {
        DOM.addClass(descriptionElem, 'show');
    }

    function hideDescription() {
        DOM.removeClass(descriptionElem, 'show');
    }

    function updateDescription(key) {

        // FIXME: This data was actually already loaded in the buildVideoList call.
        plexAPI.browse(plexAPI.getURL(key), function (container) {
            var media = container.media[0];

            artLoader.load(media.art);

            var title = media.title;
            if (media.grandparentTitle) {
                title = media.grandparentTitle;
            }
            descriptionTitleElem.innerHTML = title;

            //var meta = Time.format(media.duration) + ' <img src="images/bullet1.png" alt=""  /> ' + media.year;
            var meta = Time.format(media.duration) + ' ' + media.year;
            descriptionInfoElem.innerHTML = meta;

            descriptionSummaryElem.innerHTML = media.summary;

            descriptionResolutionFlagElem.src = plexAPI.flagMedia('videoResolution', media.stream.video.resolution);
            descriptionAudioCodecFlagElem.src = plexAPI.flagMedia('audioCodec', media.stream.audio.codec);
            descriptionAudioChannelsFlagElem.src = plexAPI.flagMedia('audioChannels', media.stream.audio.channels);
        });
    }

    /**
     * Changes the current active menu.
     *
     * @param newMenu The new menu to activate
     * @returns {boolean} <code>true</code> if the change was successful. It will fail if the new
     * menu have no elements.
     */
    function changeActiveMenu(newMenu) {
        if (!newMenu.current()) {
            return false;
        }

        document.getElementById('ondeck-title').innerHTML = '';
        document.getElementById('recentlyadded-title').innerHTML = '';

        nav.deactivate();
        nav = newMenu;
        nav.activate();

        var menuList = DOM.getParent(nav.current());

        // Set title of the scroller
        var scrollerId = menuList.getAttribute('id');
        var typeIdx = scrollerId.indexOf('-');
        if (typeIdx > 0) {
            updateDescription(nav.current().getAttribute('data-key'));
        }

        return true;
    }

    /**
     * TODO: Not very effective.
     */
    function loadImages(elem) {
        if (!elem) {
            return;
        }

        var images = elem.getElementsByTagName('img');

        var n = images.length;
        for (var i = 0; i < n; i++) {
            var image = images[i];

            if (image.getAttribute('data-src')) {
                image.src = image.getAttribute('data-src');
                image.removeAttribute('data-src');
            }
        }
    }

    function buildNavigation() {
        ondeckMenu = new HorizontalFixedScrollMenu('scroller-ondeck', 'current-ondeck');
        ondeckMenu.onmenuleft = function (e) {
            if (e.boundary) {
                hideDescription();
                changeActiveMenu(homeMenu);
            }
            else {
                updateDescription(e.element.getAttribute('data-key'));
            }
        };
        ondeckMenu.onmenuright = function (e) {
            if (!e.boundary) {
                updateDescription(e.element.getAttribute('data-key'));
            }

            if (dirtyOndeckThumbs) {
                loadImages(DOM.getParent(nav.current()));
            }
        };
        ondeckMenu.onmenudown = function (e) {
            if (e.boundary) {
                if (changeActiveMenu(recentlyAddedMenu)) {
                    lastUsedMenu = 'recentlyadded';
                }
            }
        };

        recentlyAddedMenu = new HorizontalFixedScrollMenu('scroller-recentlyadded', 'current-recentlyadded');
        recentlyAddedMenu.onmenuleft = function (e) {
            if (e.boundary) {
                hideDescription();
                changeActiveMenu(homeMenu);
            }
            else {
                updateDescription(e.element.getAttribute('data-key'));
            }
        };
        recentlyAddedMenu.onmenuright = function (e) {
            if (!e.boundary) {
                updateDescription(e.element.getAttribute('data-key'));
            }

            if (dirtyRecentlyAddedThumbs) {
                loadImages(DOM.getParent(nav.current()));
            }
        };
        recentlyAddedMenu.onmenuup = function (e) {
            if (e.boundary) {
                if (changeActiveMenu(ondeckMenu)) {
                    lastUsedMenu = 'ondeck';
                }
            }
        };


        homeMenu = new VerticalFixedScrollMenu('scroller', 'current');
        homeMenu.onmenuright = function (e) {
            var key = e.element.getAttribute('data-key');
            if (key === '') {
                // This is the preferences element
                return;
            }

            if (e.boundary) {
                showDescription();
                if (lastUsedMenu === null || lastUsedMenu === 'recentlyadded') {
                    changeActiveMenu(recentlyAddedMenu);
                    lastUsedMenu = 'recentlyadded';
                }
                else if (lastUsedMenu === 'ondeck') {
                    changeActiveMenu(ondeckMenu);
                    lastUsedMenu = 'ondeck';
                }
                else {
                    changeActiveMenu(recentlyAddedMenu);
                    lastUsedMenu = 'recentlyadded';
                }
            }
        };
        homeMenu.onmenuup = function (e) {
            clearTimeout(previewLoader);
            backgroundLoader.load(e.element.getAttribute('data-bg'));
            loadPreviewMenu(e.element.getAttribute('data-key'));
            lastUsedMenu = null;
        };
        homeMenu.onmenudown = function (e) {
            clearTimeout(previewLoader);
            backgroundLoader.load(e.element.getAttribute('data-bg'));
            loadPreviewMenu(e.element.getAttribute('data-key'));
            lastUsedMenu = null;
        };

        var currentScroller = document.getElementsByClassName('current-scroller');
        if (currentScroller.length === 0) {
            nav = homeMenu;
        }
        else {
            var currentId = currentScroller[0].getAttribute('id');
            if (currentId.indexOf('ondeck') > -1) {
                nav = ondeckMenu;
            }
            else if (currentId.indexOf('recentlyadded') > -1) {
                nav = recentlyAddedMenu;
            }
            else {
                nav = homeMenu;
            }
        }

        nav.activate();
    }

    function loadPreviewMenu(key) {

        if (key === '') {
            document.getElementById('preview-menu').style.display = 'none';
            return;
        }

        previewLoader = setTimeout(function () {

            plexAPI.browse(plexAPI.onDeck(key), function (container) {
                buildVideoList('scroller-ondeck', 'current-ondeck', container.media);
                ondeckMenu.reload();
                dirtyOndeckThumbs = true;
            });

            plexAPI.browse(plexAPI.recentlyAdded(key), function (container) {
                buildVideoList('scroller-recentlyadded', 'current-recentlyadded', container.media, true);
                recentlyAddedMenu.reload();
                dirtyRecentlyAddedThumbs = true;
            });

        }, PREVIEW_MENU_LOADING_DELAY);

        document.getElementById('preview-menu').style.display = 'block';
    }

    function posterErrorHandler(source) {
        this.src = PLACEHOLDER_IMAGE;
        this.onerror = ''; // Reset the error handler to avoid recursive references
        return true;
    }

    /**
     * FIXME: List is being modified directly on the DOM. Make a temp list and only one append to the DOM
     */
    function buildVideoList(id, activeId, media, excludeWatched) {
        excludeWatched = excludeWatched || false;

        var list = document.getElementById(id);

        // clear old content
        list.innerHTML = '';

        var n = media.length;

        console.log('Building menu (' + id + ') with ' + n + ' elements');

        var displayedPosterIndex = 0;
        for (var i = 0; i < n; i++) {
            var video = media[i];

            if (excludeWatched && video.viewCount > 0) {
                continue;
            }

            displayedPosterIndex++;

            var title = video.title;
            if (video.grandparentTitle) {
                title = video.grandparentTitle;
            }
            var offset = (video.viewOffset) ? video.viewOffset : 0;

            var item = document.createElement('li');
            item.setAttribute('data-key', video.key);
            item.setAttribute('data-type', (video.container) ? 'container' : 'video');
            item.setAttribute('data-title', title);
            item.setAttribute('data-offset', offset);
            //item.setAttribute('onclick', 'jump(,"'+(i*140)+'px");');

            var thumb = video.thumb;
            if (video.grandparentThumb) {
                thumb = video.grandparentThumb;
            }

            var scaledThumb = plexAPI.getScaledImageURL(plexAPI.getURL(thumb), 110, 150);

            var info;
            if (video.season && video.episode) {
                info = document.createElement('div');
                DOM.addClass(info, 'info');
                info.innerHTML = 'S' + video.season + ' E' + video.episode;
            }

            var overlay = document.createElement('div');
            DOM.addClass(overlay, 'overlay');

            var img = new Image();
            img.onerror = posterErrorHandler;
            if (displayedPosterIndex < PRELOADED_IMAGES) {
                img.src = scaledThumb;
            }
            else {
                img.src = PLACEHOLDER_IMAGE;
                img.setAttribute('data-src', scaledThumb);
            }

            item.appendChild(img);
            if (info) {
                item.appendChild(info);
            }
            item.appendChild(overlay);
            list.appendChild(item);

            if (displayedPosterIndex === 1) {
                item.setAttribute('id', activeId);
            }

        }
    }

    /**
     * FIXME: List is being modified directly on the DOM. Make a temp list and only one append to the DOM
     */
    function buildSectionList(media) {
        var list = document.getElementById('scroller');
        var item;
        var activeKey = '';
        var activeBg = '';

        var activeHeight = 0;

        // clear old content
        list.innerHTML = '';

        var i = 0;
        var n = media.length;
        var selectedIndex = Math.floor(n / 2);
        for (i = 0; i < n; i++) {
            var section = media[i];

            item = document.createElement('li');
            item.setAttribute('data-key', section.key);
            item.setAttribute('data-bg', section.art);
            item.setAttribute('data-type', (section.container) ? 'container' : 'video');

            item.appendChild(document.createTextNode(section.title));
            list.appendChild(item);

            if (i === selectedIndex) {
                item.setAttribute('id', 'current');
                activeKey = section.key;
                activeBg = section.art;
                activeHeight = list.offsetHeight;
            }
        }
        item = document.createElement('li');
        item.setAttribute('data-key', '');
        item.setAttribute('data-bg', '');
        item.setAttribute('data-type', 'pref');

        item.appendChild(document.createTextNode('Preferences'));
        list.appendChild(item);

        if (n === 0) {
            item.setAttribute('id', 'current');
            activeHeight = list.offsetHeight;
        }

        list.style.top = (360 - activeHeight + 8) + 'px';

        backgroundLoader.load(activeBg);
        loadPreviewMenu(activeKey);
    }

    this.reload = function () {
        buildNavigation();
    };
    this.render = function () {
        plexAPI.browse(plexAPI.sections(), function (container) {

            buildSectionList(container.media);
            buildNavigation();

            updateTime();
            setInterval(updateTime, 1000);

            // Hide the loading screen
            setTimeout(function () {
                document.getElementById('loader').style.display = 'none';
            }, 2000);
        });
    };

    function getCurrentId(scrollerId) {
        var idx = scrollerId.indexOf('-');
        if (idx < 0) {
            return 'current';
        }
        return 'current' + scrollerId.substring(idx);
    }

    function activate(selected) {
        var key = selected.getAttribute('data-key');
        var type = selected.getAttribute('data-type');
        if (type === 'video') {
            var offset = parseInt(selected.getAttribute('data-offset'), 10);

            if (offset > 0) {
                window.view = new ResumeView(plexAPI.getURL(key), offset);
            }
            else {
                window.view = new PlayerView(plexAPI.getURL(key));
            }
        }
        else if (type === 'pref') {
            window.view = new PreferencesView();
            window.view.render();
        }
        else {
            window.view = new ListView(plexAPI.getURL(key));
            window.view.render();
        }
    }

    this.onEnter = function () {
        hideDescription();

        var currentScroller = document.getElementsByClassName('current-scroller')[0];

        var currentId = getCurrentId(currentScroller.getAttribute('id'));
        var current = document.getElementById(currentId);

        activate(current);
    };

    this.onBack = function () {
    };

    this.onRight = function () {
        nav.right();
    };

    this.onLeft = function () {
        nav.left();
    };

    this.onUp = function () {
        nav.up();
    };

    this.onDown = function () {
        nav.down();
    };

    var moveTimer;
    function clearMoveTimer() { if (moveTimer) { clearTimeout(moveTimer); }}
    function move(id, direction) {
        var menu;
        // Find menu
        switch (id) {
            case 'ondeck':
                menu = ondeckMenu;
                break;
            case 'recentlyadded':
                menu = recentlyAddedMenu;
                break;
            default:
                menu = homeMenu;
        }


        return function() {
            switch (direction) {
                case 'up':
                    menu.up();
                    break;
                case 'down':
                    menu.down();
                    break;
                case 'left':
                    menu.left();
                    break;
                case 'right':
                    menu.right();
                    break;
            }

            moveTimer = setTimeout(move(id, direction), 500);
        };
    }

    document.getElementById('recentlyadded-scroll-left').onmouseover = function(e) {
        move('recentlyadded', 'left')();
    };
    document.getElementById('recentlyadded-scroll-left').onmouseout = clearMoveTimer;

    document.getElementById('recentlyadded-scroll-right').onmouseover = function(e) {
        move('recentlyadded', 'right')();
    };
    document.getElementById('recentlyadded-scroll-right').onmouseout = clearMoveTimer;

    document.getElementById('ondeck-scroll-left').onmouseover = function(e) {
        move('ondeck', 'left')();
    };
    document.getElementById('ondeck-scroll-left').onmouseout = clearMoveTimer;

    document.getElementById('ondeck-scroll-right').onmouseover = function(e) {
        move('ondeck', 'right')();
    };
    document.getElementById('ondeck-scroll-right').onmouseout = clearMoveTimer;

    document.getElementById('section-scroll-up').onmouseover = function(e) {
        move('home', 'up')();
    };
    document.getElementById('section-scroll-up').onmouseout = clearMoveTimer;

    document.getElementById('section-scroll-down').onmouseover = function(e) {
        move('home', 'down')();
    };
    document.getElementById('section-scroll-down').onmouseout = clearMoveTimer;


    document.getElementById('preview-menu').onclick = function(e) {
        if (e.target.tagName === 'LI') {
            activate(e.target);
        }
    };
    document.getElementById('home-menu').onclick = function(e) {
        if (e.target.tagName === 'LI') {
            activate(e.target);
        }
    };
}