function HomeView() {

    var nav = null;

    var ondeckMenu = null;
    var recentlyAddedMenu = null;
    var homeMenu = null;

    var lastUsedMenu = null;

    function updateTime() {
        var date = new Date();
        
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        document.getElementById('home-time').innerHTML = '<span>&#149;</span>' + strTime;
    }

    function changeActiveMenu(newMenu) {
        document.getElementById('ondeck-title').innerHTML = '';
        document.getElementById('recentlyadded-title').innerHTML = '';
        nav.deactivate();
        nav = newMenu;
        nav.activate();
        
        var scrollerId = DOM.getParent(nav.current()).getAttribute('id');
        var typeIdx = scrollerId.indexOf('-');
        if (typeIdx > 0) {
            // The section menu scroller doesn't contain '-'
            var titleId = scrollerId.substring(typeIdx+1) + '-title';
        
            setTitle(titleId, nav.current());
        }
    }
    
    function setTitle(id, element) {
        document.getElementById(id).innerHTML = element.getAttribute('data-title')+'<span>'+element.getAttribute('data-meta')+'</span>';
    }
    
    function buildNavigation() {
        ondeckMenu = new HorizontalFixedScrollMenu('scroller-ondeck','current-ondeck');
        ondeckMenu.onmenuleft = function(e) { 
            if (e.boundary) { changeActiveMenu(homeMenu) }
            else {
                setTitle('ondeck-title', e.element);
            }
        };
        ondeckMenu.onmenuright = function (e) {
            if (!e.boundary) {
                setTitle('ondeck-title', e.element);
            }
        }
        ondeckMenu.onmenudown = function(e) { 
            if (e.boundary) {
                changeActiveMenu(recentlyAddedMenu);
                lastUsedMenu = "recentlyadded";
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
        };
        recentlyAddedMenu.onmenuup = function(e) { 
            if (e.boundary) {
                changeActiveMenu(ondeckMenu); 
                lastUsedMenu = "ondeck";
            }
        };
        
    
        homeMenu = new VerticalFixedScrollMenu('scroller', 'current');
        homeMenu.onmenuright = function(e) { 
            if (e.boundary) {
                if (lastUsedMenu === null || lastUsedMenu === "recentlyadded") {
                    changeActiveMenu(recentlyAddedMenu);
                    lastUsedMenu = "recentlyadded";
                }
                else if (lastUsedMenu === "ondeck") {
                    changeActiveMenu(ondeckMenu);
                    lastUsedMenu = "ondeck";
                }
                else {
                    changeActiveMenu(recentlyAddedMenu);
                    lastUsedMenu = "recentlyadded";
                }
            }
        };
        homeMenu.onmenuup = function(e) {
            loadBackground(e.element.getAttribute('data-bg'))
            loadPreviewMenu(e.element.getAttribute('data-key'));
            lastUsedMenu = null;
        };
        homeMenu.onmenudown = function(e) {
            loadBackground(e.element.getAttribute('data-bg'))
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
        
        // clear old content
        list.innerHTML = '';
        
        var n = media.length;
        for (var i = 0; i < n; i++) {
            var video = media[i];
            
            var title = video.title;
            if (video.grandparentTitle) {
                title = video.grandparentTitle;
            }
            var meta = ' <img src="images/bullet.png" alt=""  /> ' + video.year;
            var offset = (video.viewOffset) ? video.viewOffset : 0;
            
            var item = document.createElement('li');
            item.setAttribute('data-key', video.key);
            item.setAttribute('data-type', (video.container) ? "container" : "video");
            item.setAttribute('data-title', title);
            item.setAttribute('data-meta', meta);
            item.setAttribute('data-offset', offset);
            //item.setAttribute('onclick', 'jump(,"'+(i*140)+'px");');
            
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
        
        var n = media.length;
        var selectedIndex = Math.floor(n/2);
        for (var i = 0; i < n; i++) {
            var section = media[i];
                
            var item = document.createElement('li');
            item.setAttribute('data-key', section.key);
            item.setAttribute('data-bg', section.art);
            item.setAttribute('data-type', (section.container) ? "container" : "video");
                
            item.appendChild(document.createTextNode(section.title));
            list.appendChild(item);
            
            if (i === selectedIndex) {
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
            
            updateTime();
            setInterval(updateTime, 1000);
            
            // Hide the loading screen
            setTimeout(function() {
                document.getElementById('loader').style.display = 'none';
            }, 2000);
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
            var key = current.getAttribute('data-key');
            var offset = parseInt(current.getAttribute('data-offset'), 10);
            
            if (offset > 0) {
                window.view = new ResumeView(plexAPI.getURL(key), offset);
            }
            else {
                window.view = new PlayerView(plexAPI.getURL(key));
            }
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