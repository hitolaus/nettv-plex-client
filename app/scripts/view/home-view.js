function HomeView() {

    var nav = null;

    var ondeckMenu = null;
    var recentlyAddedMenu = null;
    var homeMenu = null;

    function changeActiveMenu(newMenu) {
        nav.deactivate();
        nav = newMenu;
        nav.activate();
    }
    
    function buildNavigation() {
        ondeckMenu = new HorizontalFixedScrollMenu('scroller-ondeck','current-ondeck');
        ondeckMenu.onmenuleft = function(e) { if (e.boundary) changeActiveMenu(homeMenu); };
        ondeckMenu.onmenudown = function(e) { if (e.boundary) changeActiveMenu(recentlyAddedMenu); };
    
        recentlyAddedMenu = new HorizontalFixedScrollMenu('scroller-recentlyadded','current-recentlyadded');
        recentlyAddedMenu.onmenuleft = function(e) { if (e.boundary) changeActiveMenu(homeMenu); };
        recentlyAddedMenu.onmenuup = function(e) { if (e.boundary) changeActiveMenu(ondeckMenu); };
    
        homeMenu = new VerticalFixedScrollMenu('scroller', 'current');
        homeMenu.onmenuright = function(e) { if (e.boundary) changeActiveMenu(ondeckMenu); };
        homeMenu.onmenuup = function(e) {
            loadBackground(e.element.getAttribute('data-bg'))
            loadPreviewMenu(e.element.getAttribute('data-key'));
        };
        homeMenu.onmenudown = function(e) {
            loadBackground(e.element.getAttribute('data-bg'))
            loadPreviewMenu(e.element.getAttribute('data-key'));
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
        }
        
        nav.activate();
    }
    
    function loadBackground(url) {
        if (url) {
            var body = document.body;
            body.style.backgroundImage = 'url('+plexAPI.getScaledImageURL(plexAPI.getURL(url), 1280, 720)+')';
            body.style.backgroundSize = '1280px 720px';
            body.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    function loadPreviewMenu(key) {
        
        plexAPI.browse(plexAPI.onDeck(key), function(container) {
            buildVideoList('scroller-ondeck', 'current-ondeck',container.media);
            ondeckMenu.reload();
        });
        
        plexAPI.browse(plexAPI.recentlyAdded(key), function(container) {
            buildVideoList('scroller-recentlyadded', 'current-recentlyadded', container.media);
            recentlyAddedMenu.reload();
        });
        
    }
    
    function buildVideoList(id, activeId, media) {
        var list = document.getElementById(id);
        
        // reset
        while (list.hasChildNodes()) {
            list.removeChild(list.lastChild);
        }
        
        for (var i = 0; i < media.length; i++) {
            var video = media[i];
                
            var item = document.createElement('li');
            item.setAttribute('data-key', video.key);
            item.setAttribute('data-type', (video.container) ? "container" : "video");
            
            var img = document.createElement('img');
            
            var thumb = video.thumb;
            if (video.grandparentThumb) {
                thumb = video.grandparentThumb;
            }

            var scaledThumb = plexAPI.getScaledImageURL(plexAPI.getURL(thumb), 110, 150);
            
            img.setAttribute('src', scaledThumb);
            item.appendChild(img);
            list.appendChild(item);
                
            if (i === 0) {
                item.setAttribute('id',activeId);
            }
        }
    }
    
    function buildSectionList(media) {
        var list = document.getElementById('scroller');
        var activeKey = "";
        var activeBg = "";

        var activeHeight = 0;
        
        for (var i = 0; i < media.length; i++) {
            var section = media[i];
                
            var item = document.createElement('li');
            item.setAttribute('data-key', section.key);
            item.setAttribute('data-bg', section.art);
            item.setAttribute('data-type', (section.container) ? "container" : "video");
                
            item.appendChild(document.createTextNode(section.title));
            list.appendChild(item);
                
                
            if (i === Math.floor(media.length/2)) {
                item.setAttribute('id','current');
                activeKey = section.key;
                activeBg = section.art;
                activeHeight = list.offsetHeight;
            }
        }
        list.style.top = (360-activeHeight+4)+'px';
        
        loadBackground(activeBg);
        loadPreviewMenu(activeKey);
    }
    
    this.reload = function() {
        buildNavigation();
    }
    this.render = function() {
        plexAPI.browse(plexAPI.sections(), function(container) {

            buildSectionList(container.media);
    
            buildNavigation();
        });
    }

    function getCurrentId(scrollerId) {
        var idx = scrollerId.indexOf('-');
        if (idx < 0) {
            return "current";
        }
        return "current"+scrollerId.substring(idx);
    }

    this.onEnter = function() {
        var currentScroller = document.getElementsByClassName('current-scroller')[0];
        
        var currentId = getCurrentId(currentScroller.getAttribute('id'));
        var current = document.getElementById(currentId);
        
        if (current.getAttribute('data-type') === "video") {
            window.view = new PlayerView(plexAPI.getURL(current.getAttribute('data-key')));
        }
    }

    this.onBack = function() {
    }

    this.onRight = function() {
        nav.right();
    }
   
    this.onLeft = function() {
        nav.left();
    }

    this.onUp = function() {
        nav.up();
    }

    this.onDown = function() {
        nav.down();
    }
}