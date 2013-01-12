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

    var backgroundLoader = new BackgroundLoader('bg1', 'bg2');

    // Whether we need to load the thumbs
    var dirtyOndeckThumbs = false;
    var dirtyRecentlyAddedThumbs = false;

    function updateTime() {
        document.getElementById('home-time').innerHTML = Time.to12HourFormat(new Date());
    }

    function changeActiveMenu(newMenu) {
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
            // The section menu scroller doesn't contain '-'
            var titleId = scrollerId.substring(typeIdx+1) + '-title';

            setTitle(titleId, nav.current());
        }
    }

    function setTitle(id, element) {
        var heading = document.getElementById(id);
        var title = element.getAttribute('data-title').encodeHTML();
        var meta = element.getAttribute('data-meta');

        heading.innerHTML = title+'<span>'+meta+'</span>';
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
        ondeckMenu = new HorizontalFixedScrollMenu('scroller-ondeck','current-ondeck');
        ondeckMenu.onmenuleft = function(e) {
            if (e.boundary) { changeActiveMenu(homeMenu); }
            else {
                setTitle('ondeck-title', e.element);
            }
        };
        ondeckMenu.onmenuright = function (e) {
            if (!e.boundary) {
                setTitle('ondeck-title', e.element);
            }

            if (dirtyOndeckThumbs) {
                loadImages(DOM.getParent(nav.current()));
            }
        };
        ondeckMenu.onmenudown = function(e) {
            if (e.boundary) {
                changeActiveMenu(recentlyAddedMenu);
                lastUsedMenu = 'recentlyadded';
            }
        };

        recentlyAddedMenu = new HorizontalFixedScrollMenu('scroller-recentlyadded','current-recentlyadded');
        recentlyAddedMenu.onmenuleft = function(e) {
            if (e.boundary) { changeActiveMenu(homeMenu); }
            else {
                setTitle('recentlyadded-title', e.element);
            }
        };
        recentlyAddedMenu.onmenuright = function(e) {
            if (!e.boundary) {
                setTitle('recentlyadded-title', e.element);
            }

            if (dirtyRecentlyAddedThumbs) {
                loadImages(DOM.getParent(nav.current()));
            }
        };
        recentlyAddedMenu.onmenuup = function(e) {
            if (e.boundary) {
                changeActiveMenu(ondeckMenu);
                lastUsedMenu = 'ondeck';
            }
        };


        homeMenu = new VerticalFixedScrollMenu('scroller', 'current');
        homeMenu.onmenuright = function(e) {
            var key = e.element.getAttribute('data-key');
            if (key === '') {
                // This is the preferences element
                return;
            }

            if (e.boundary) {
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
        homeMenu.onmenuup = function(e) {
            clearTimeout(previewLoader);
            backgroundLoader.load(e.element.getAttribute('data-bg'));
            loadPreviewMenu(e.element.getAttribute('data-key'));
            lastUsedMenu = null;
        };
        homeMenu.onmenudown = function(e) {
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

        previewLoader = setTimeout(function() {

            plexAPI.browse(plexAPI.onDeck(key), function(container) {
                buildVideoList('scroller-ondeck', 'current-ondeck',container.media);
                ondeckMenu.reload();
                dirtyOndeckThumbs = true;
            });

            plexAPI.browse(plexAPI.recentlyAdded(key), function(container) {
                buildVideoList('scroller-recentlyadded', 'current-recentlyadded', container.media, true);
                recentlyAddedMenu.reload();
                dirtyRecentlyAddedThumbs = true;
            });

        }, PREVIEW_MENU_LOADING_DELAY);

        document.getElementById('preview-menu').style.display = 'block';
    }

    function posterErrorHandler (source) {
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

        console.log('Building menu ('+id+') with ' + n + ' elements');

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
            var meta = ' <img src="images/bullet1.png" alt=""  /> ' + video.year;
            var offset = (video.viewOffset) ? video.viewOffset : 0;

            var item = document.createElement('li');
            item.setAttribute('data-key', video.key);
            item.setAttribute('data-type', (video.container) ? 'container' : 'video');
            item.setAttribute('data-title', title);
            item.setAttribute('data-meta', meta);
            item.setAttribute('data-offset', offset);
            //item.setAttribute('onclick', 'jump(,"'+(i*140)+'px");');

            var thumb = video.thumb;
            if (video.grandparentThumb) {
                thumb = video.grandparentThumb;
            }

            var scaledThumb = plexAPI.getScaledImageURL(plexAPI.getURL(thumb), 110, 150);

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
            item.appendChild(overlay);
            list.appendChild(item);

            if (i === 0) {
                item.setAttribute('id',activeId);
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
        var selectedIndex = Math.floor(n/2);
        for (i = 0; i < n; i++) {
            var section = media[i];

            item = document.createElement('li');
            item.setAttribute('data-key', section.key);
            item.setAttribute('data-bg', section.art);
            item.setAttribute('data-type', (section.container) ? 'container' : 'video');

            item.appendChild(document.createTextNode(section.title));
            list.appendChild(item);

            if (i === selectedIndex) {
                item.setAttribute('id','current');
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
            item.setAttribute('id','current');
            activeHeight = list.offsetHeight;
        }

        // 360 = mid height, move half the count of elements down
        var midElementIdx = Math.floor(i/2);
        if (midElementIdx < 1) {
            midElementIdx = 1;
        }
        list.style.top = (360-(midElementIdx*activeHeight)+8)+'px';

        backgroundLoader.load(activeBg);
        loadPreviewMenu(activeKey);
    }

    this.reload = function() {
        buildNavigation();
    };
    this.render = function() {
        plexAPI.browse(plexAPI.sections(), function(container) {

            buildSectionList(container.media);
            buildNavigation();

            updateTime();
            setInterval(updateTime, 1000);

            // Hide the loading screen
            setTimeout(function() {
                document.getElementById('loader').style.display = 'none';
            }, 2000);
        });
    };

    function getCurrentId(scrollerId) {
        var idx = scrollerId.indexOf('-');
        if (idx < 0) {
            return 'current';
        }
        return 'current'+scrollerId.substring(idx);
    }

    this.onEnter = function() {
        var currentScroller = document.getElementsByClassName('current-scroller')[0];

        var currentId = getCurrentId(currentScroller.getAttribute('id'));
        var current = document.getElementById(currentId);

        var key = current.getAttribute('data-key');
        var type = current.getAttribute('data-type');
        if (type === 'video') {
            var offset = parseInt(current.getAttribute('data-offset'), 10);

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
    };

    this.onBack = function() {
    };

    this.onRight = function() {
        nav.right();
    };

    this.onLeft = function() {
        nav.left();
    };

    this.onUp = function() {
        nav.up();
    };

    this.onDown = function() {
        nav.down();
    };
}